import { beforeEach, describe, expect, it } from 'vitest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  AidantMisEnRelation,
  MiseEnRelationParCriteres,
  tokenAttributionDemandeAide,
  TonkenAttributionDemandeAide,
} from '../../../src/gestion-demandes/aide/MiseEnRelationParCriteres';
import {
  allier,
  Departement,
  finistere,
  gironde,
} from '../../../src/gestion-demandes/departements';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { adaptateursCorpsMessage } from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { unAdaptateurDeCorpsDeMessage } from './ConstructeurAdaptateurDeCorpsDeMessage';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  Aidant,
  entitesPrivees,
  entitesPubliques,
} from '../../../src/espace-aidant/Aidant';
import { uneDemandeAide } from './ConstructeurDemandeAide';
import { DonneesMiseEnRelation } from '../../../src/gestion-demandes/aide/miseEnRelation';
import { ServiceDeChiffrementChacha20 } from '../../../src/infrastructure/securite/ServiceDeChiffrementChacha20';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';
import { AdaptateurGeographie } from '../../../src/adaptateurs/AdaptateurGeographie';
import { InformationEntitePourMiseEnRelation } from '../../../src/adaptateurs/AdaptateurEnvoiMail';
import { unTupleAttributionDemandeAideAAidant } from '../../../src/diagnostic/tuples';
import { EntrepotAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

describe('Mise en relation par critères', () => {
  let envoieMail: AdaptateurEnvoiMailMemoire;
  let annuaireCot: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  };
  let entrepots: EntrepotsMemoire;
  let adaptateurGeo: AdaptateurGeographie;

  beforeEach(() => {
    adaptateursCorpsMessage.demande =
      unAdaptateurDeCorpsDeMessage().construis().demande;
    adaptateurEnvironnement.messagerie = () =>
      adaptateursEnvironnementDeTest.messagerie({
        emailMac: 'mac@email.com',
        copieMac: 'copie-mac@email.com',
      });
    adaptateurEnvironnement.mac = () => ({
      urlMAC: () => 'http://domaine:1234',
      urlAideMAC: () => 'http://domaine:1234/aide',
    });

    envoieMail = new AdaptateurEnvoiMailMemoire();
    annuaireCot = {
      rechercheEmailParDepartement: (__d: Departement) => 'cot@email.com',
    };
    entrepots = new EntrepotsMemoire();
    annuaireCot = {
      rechercheEmailParDepartement: (__departement: Departement) =>
        'cot@par-defaut.fr',
    };
    adaptateurGeo = {
      epciAvecCode: async (__codeEpci: string) => ({ nom: '' }),
    };
  });

  const laMiseEnRelation = () =>
    new MiseEnRelationParCriteres(
      envoieMail,
      annuaireCot,
      entrepots,
      adaptateurGeo
    );

  it('Envoie un email de demande d’aide en copie à MAC', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-03-19T14:45:17+01:00'))
    );
    const miseEnRelation = laMiseEnRelation();

    await miseEnRelation.execute({
      demandeAide: uneDemandeAide().construis(),
      secteursActivite: [{ nom: 'Administration' }],
      typeEntite: entitesPubliques,
      siret: '12345',
      codeEPCI: 'Bordeaux Métropole',
    });

    expect(
      envoieMail.aEteEnvoyeEnCopieA(
        'copie-mac@email.com',
        'Bonjour une entité a fait une demande d’aide'
      )
    ).toBe(true);
  });

  it('Envoie un email de demande d’aide au COT de la région', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-03-19T14:45:17+01:00'))
    );
    annuaireCot.rechercheEmailParDepartement = (__d: Departement) =>
      'gironde@ssi.gouv.fr';
    const miseEnRelation = laMiseEnRelation();

    await miseEnRelation.execute({
      demandeAide: uneDemandeAide().construis(),
      secteursActivite: [{ nom: 'Administration' }],
      typeEntite: entitesPrivees,
      siret: '12345',
      codeEPCI: 'Bordeaux Métropole',
    });

    expect(
      envoieMail.aEteEnvoyeA(
        'gironde@ssi.gouv.fr',
        'Bonjour une entité a fait une demande d’aide'
      )
    ).toBe(true);
  });

  describe('Matching des Aidants', () => {
    it('Indique dans le mail envoyé au COT, la liste des aidants qui ont matchés', async () => {
      const unAidantEnGirondeEtTransportsPourDuPrive = unAidant()
        .avecUnNomPrenom('Jean DUPONT')
        .avecUnEmail('jean.dupont@email.com')
        .ayantPourDepartements([gironde])
        .ayantPourSecteursActivite([{ nom: 'Transports' }])
        .ayantPourTypesEntite([entitesPrivees])
        .construis();
      const unAidantDansAllierEtAdministrationPublique = unAidant()
        .avecUnNomPrenom('Jean DUBOIS')
        .avecUnEmail('jean.dubois@email.com')
        .ayantPourDepartements([allier])
        .ayantPourSecteursActivite([{ nom: 'Administration' }])
        .ayantPourTypesEntite([entitesPubliques])
        .construis();
      await entrepots
        .aidants()
        .persiste(unAidantEnGirondeEtTransportsPourDuPrive);
      await entrepots
        .aidants()
        .persiste(unAidantDansAllierEtAdministrationPublique);
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .recapitulatifDemandeAide((_aide, aidants) => {
          if (aidants.length === 0) {
            throw new Error('Ce test devrait trouver 1 Aidant.');
          }
          return `Aidant trouvé par le matching : ${aidants[0].nomPrenom} (${aidants[0].email})`;
        })
        .construis().demande;
      annuaireCot.rechercheEmailParDepartement = (__d: Departement) =>
        'gironde@ssi.gouv.fr';

      const miseEnRelation = laMiseEnRelation();

      await miseEnRelation.execute({
        demandeAide: uneDemandeAide().dansLeDepartement(gironde).construis(),
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPrivees,
        siret: '12345',
        codeEPCI: 'Bordeaux Métropole',
      });

      expect(
        envoieMail.aEteEnvoyeA(
          'gironde@ssi.gouv.fr',
          'Aidant trouvé par le matching : Jean DUPONT (jean.dupont@email.com)'
        )
      ).toBe(true);
    });

    it('Génère un lien unique par Aidant pour postuler à la demande', async () => {
      const premierAidant = unAidant()
        .ayantPourDepartements([finistere])
        .ayantPourSecteursActivite([{ nom: 'Transports' }])
        .ayantPourTypesEntite([entitesPubliques])
        .construis();
      const deuxiemeAidant = unAidant()
        .ayantPourDepartements([finistere])
        .ayantPourSecteursActivite([
          { nom: 'Transports' },
          { nom: 'Administration' },
        ])
        .ayantPourTypesEntite([entitesPubliques])
        .construis();
      await entrepots.aidants().persiste(premierAidant);
      await entrepots.aidants().persiste(deuxiemeAidant);

      const aidantsContactes: AidantMisEnRelation[] = [];
      envoieMail.envoiToutesLesMisesEnRelation = async (
        aidants: AidantMisEnRelation[],
        __donneesMiseEnRelation
      ) => {
        aidantsContactes.push(...aidants);
      };

      const miseEnRelation = laMiseEnRelation();

      const demandeAide = uneDemandeAide()
        .avecIdentifiant('11111111-1111-1111-1111-111111111111')
        .avecUnEmail('demandeur@societe.fr')
        .dansLeDepartement(finistere)
        .construis();

      await miseEnRelation.execute({
        demandeAide,
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPubliques,
        siret: '12345',
        codeEPCI: 'Bordeaux Métropole',
      });

      expect(aidantsContactes).toHaveLength(2);
      const premierAidantMisEnRelation = aidantsContactes[0];
      expect(
        tokenAttributionDemandeAide().dechiffre(
          premierAidantMisEnRelation.lienPourPostuler.substring(
            premierAidantMisEnRelation.lienPourPostuler.indexOf('=') + 1
          )
        )
      ).toStrictEqual<TonkenAttributionDemandeAide>({
        emailDemande: 'demandeur@societe.fr',
        identifiantDemande: '11111111-1111-1111-1111-111111111111',
        identifiantAidant: expect.any(String),
      });
      const deuxiemeAidantMisEnRelation = aidantsContactes[0];
      expect(
        tokenAttributionDemandeAide().dechiffre(
          deuxiemeAidantMisEnRelation.lienPourPostuler.substring(
            deuxiemeAidantMisEnRelation.lienPourPostuler.indexOf('=') + 1
          )
        )
      ).toStrictEqual<TonkenAttributionDemandeAide>({
        emailDemande: 'demandeur@societe.fr',
        identifiantDemande: '11111111-1111-1111-1111-111111111111',
        identifiantAidant: expect.any(String),
      });
    });

    it("Mentionne, dans le mail vers l'Aidant, les informations d'EPCI de l'Aidé", async () => {
      const premierAidant = unAidant()
        .ayantPourDepartements([finistere])
        .ayantPourSecteursActivite([{ nom: 'Transports' }])
        .ayantPourTypesEntite([entitesPubliques])
        .construis();
      await entrepots.aidants().persiste(premierAidant);

      let informationsDuMail: InformationEntitePourMiseEnRelation;
      envoieMail.envoiToutesLesMisesEnRelation = async (
        __aidants: AidantMisEnRelation[],
        informations: InformationEntitePourMiseEnRelation
      ) => {
        informationsDuMail = informations;
      };
      adaptateurGeo.epciAvecCode = async (__codeEpci: string) => ({
        nom: 'Bordeaux Métropole',
      });
      const miseEnRelation = laMiseEnRelation();

      const demandeAide = uneDemandeAide()
        .avecIdentifiant('11111111-1111-1111-1111-111111111111')
        .avecUnEmail('demandeur@societe.fr')
        .dansLeDepartement(finistere)
        .construis();

      await miseEnRelation.execute({
        demandeAide,
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPubliques,
        siret: '12345',
        codeEPCI: '888999',
      });

      expect(informationsDuMail!.epci).toBe('Bordeaux Métropole');
    });

    it('Envoie un mail aux Aidants qui matchent', async () => {
      const premierAidant = unAidant()
        .avecUnEmail('aidant-qui-matche@mail.con')
        .avecUnNomPrenom('Jean DUPONT')
        .ayantPourDepartements([finistere])
        .ayantPourSecteursActivite([{ nom: 'Transports' }])
        .ayantPourTypesEntite([entitesPubliques])
        .construis();
      const aidantsContactes: AidantMisEnRelation[] = [];
      envoieMail.envoiToutesLesMisesEnRelation = async (
        aidants: AidantMisEnRelation[],
        __donneesMiseEnRelation
      ) => {
        aidantsContactes.push(...aidants);
      };
      await entrepots.aidants().persiste(premierAidant);
      const miseEnRelation = laMiseEnRelation();

      const donneesMiseEnRelation: DonneesMiseEnRelation = {
        demandeAide: uneDemandeAide().dansLeDepartement(finistere).construis(),
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPubliques,
        siret: '12345',
        codeEPCI: 'Bordeaux Métropole',
      };
      await miseEnRelation.execute(donneesMiseEnRelation);

      expect(aidantsContactes).toHaveLength(1);
      expect(aidantsContactes[0].email).toBe('aidant-qui-matche@mail.con');
      expect(aidantsContactes[0].nomPrenom).toBe('Jean DUPONT');
    });

    it('Envoie un mail au COT en cas de matching infructueux', async () => {
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .aucunAidantPourLaDemandeAide((donneesMiseEnRelation) => {
          return `Aucun Aidant! ${donneesMiseEnRelation.siret}`;
        })
        .construis().demande;
      annuaireCot.rechercheEmailParDepartement = (__d: Departement) =>
        'gironde@ssi.gouv.fr';
      const miseEnRelation = laMiseEnRelation();

      await miseEnRelation.execute({
        demandeAide: uneDemandeAide().dansLeDepartement(gironde).construis(),
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPrivees,
        siret: '12345',
        codeEPCI: 'Bordeaux Métropole',
      });

      expect(
        envoieMail.aEteEnvoyeA('gironde@ssi.gouv.fr', 'Aucun Aidant! 12345')
      ).toBe(true);
    });

    it('Chiffre et déchiffre le token de mise en relation', async () => {
      const serviceDeChiffrement = new ServiceDeChiffrementChacha20(
        Buffer.from('ivlongueur12'),
        Buffer.from('assoc-longueur16'),
        'ma-clef-secrete-de-longueur-0032'
      );
      const demandeAide: DemandeAide = uneDemandeAide()
        .avecIdentifiant('11111111-1111-1111-1111-111111111111')
        .avecUnEmail('jean.dupont@email.com')
        .construis();
      const identifiantAidant = '7571dfe9-31e7-4e6f-80de-fafa3f323b1d';

      const valeurChiffree = tokenAttributionDemandeAide(
        serviceDeChiffrement
      ).chiffre(demandeAide.email, demandeAide.identifiant, identifiantAidant);

      expect(valeurChiffree).toBe(
        'Njk3NjZjNmY2ZTY3NzU2NTc1NzIzMTMyNjE3MzczNmY2MzJkNmM2ZjZlNjc3NTY1NzU3MjMxMzZmNWY0ZDFhNjc0Y2JhYjMwMGM1OGZmMmI4ZWI4YmFjMmEzOTY5NWY3NWMxMDY2MTg0ZGY3MWMyNTViZWIwNTVjOTg4NDIyYzE0OWVmMDI4YzdhMzlkMzliMzRlYTJjNTkyM2ZiZTRlZmM0ZjhhMTFmYmUxOTE2MGRjMDQzNDhlYmFlNjczNGYxNGVjZjhkY2JhNzk4MjE0N2U5ZDA4NjliZDI4NTE3MTYxNjEyOTAwMGVhZjg3NTA5N2Y1MDc3NDNiN2M1YTZkNDBkZDE4ZWQ3NDlhMDNjZDcwZWQxNjc1YmRmYzI2YTE0ZWY0ZjdhYjRhZjFkOTliNzhhYjM2MzFhOTYxYjZmYjNmZWU4MDg4ZmM2MDhlM2I4MDg3MTViMDMxOTA1ZTE0OGMxMjg1MDE3MTc2NGY5ZjY4MTcxYzMxMjMzM2FjOWQwNmVmZmViMTA3MWIyMzU0YmJmMDQ1YQ=='
      );
      expect(
        tokenAttributionDemandeAide(serviceDeChiffrement).dechiffre(
          valeurChiffree
        )
      ).toStrictEqual<TonkenAttributionDemandeAide>({
        emailDemande: 'jean.dupont@email.com',
        identifiantDemande: '11111111-1111-1111-1111-111111111111',
        identifiantAidant: '7571dfe9-31e7-4e6f-80de-fafa3f323b1d',
      });
    });

    it('Va au bout même si l’envoi de mail aux Aidants lève une erreur (bug survenu en PROD)', async () => {
      const premierAidant = unAidant()
        .avecUnEmail('aidant-qui-matche@mail.con')
        .avecUnNomPrenom('Jean DUPONT')
        .ayantPourDepartements([finistere])
        .ayantPourSecteursActivite([{ nom: 'Transports' }])
        .ayantPourTypesEntite([entitesPubliques])
        .construis();
      envoieMail.envoiToutesLesMisesEnRelation = async (
        __aidants,
        __donneesMiseEnRelation
      ) => {
        throw new Error('Erreur pour test lors de l’envoi du mail');
      };
      await entrepots.aidants().persiste(premierAidant);
      const miseEnRelation = laMiseEnRelation();

      const resultatMiseEnRelation = await miseEnRelation.execute({
        demandeAide: uneDemandeAide().dansLeDepartement(finistere).construis(),
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPubliques,
        siret: '12345',
        codeEPCI: 'Bordeaux Métropole',
      });

      expect(resultatMiseEnRelation.resultat).toBeDefined();
    });

    describe('Dans le cadre de la limite de mise en relation à 2 diagnostics sur une période glissante de 30 jours', () => {
      const creeDeuxDemandesAideEnDatePour = async (
        aidantAyantPostuleADeuxDemandesAide: Aidant,
        lesDates: Date[]
      ) => {
        const premiereDemande = uneDemandeAide()
          .avecUneDateDeSignatureDesCGU(lesDates[0])
          .construis();
        const secondeDemande = uneDemandeAide()
          .avecUneDateDeSignatureDesCGU(lesDates[1])
          .construis();
        await entrepots.demandesAides().persiste(premiereDemande);
        await entrepots.demandesAides().persiste(secondeDemande);
        const entrepotRelation = (entrepots.aidants() as EntrepotAidantMemoire)
          .entrepotRelation;
        await entrepotRelation.persiste(
          unTupleAttributionDemandeAideAAidant(
            premiereDemande.identifiant,
            aidantAyantPostuleADeuxDemandesAide.identifiant
          )
        );
        await entrepotRelation.persiste(
          unTupleAttributionDemandeAideAAidant(
            secondeDemande.identifiant,
            aidantAyantPostuleADeuxDemandesAide.identifiant
          )
        );
      };

      it('Retourne uniquement les Aidants à moins de 2 diagnostics', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date('2025-03-19T13:50:00.000Z')
        );
        const aidantAyantPostuleADeuxDemandesAide = unAidant()
          .ayantPourDepartements([finistere])
          .ayantPourSecteursActivite([{ nom: 'Transports' }])
          .ayantPourTypesEntite([entitesPubliques])
          .avecUnEmail('aidant-avec-deux-demandes@mail.con')
          .avecUnNomPrenom('Jean DUPONT')
          .construis();
        const secondAidant = unAidant()
          .ayantPourDepartements([finistere])
          .ayantPourSecteursActivite([{ nom: 'Transports' }])
          .ayantPourTypesEntite([entitesPubliques])
          .avecUnEmail('aidant-qui-matche@mail.con')
          .avecUnNomPrenom('Jean MARTIN')
          .construis();
        const aidantsContactes: AidantMisEnRelation[] = [];
        envoieMail.envoiToutesLesMisesEnRelation = async (
          aidants: AidantMisEnRelation[],
          __donneesMiseEnRelation
        ) => {
          aidantsContactes.push(...aidants);
        };
        await entrepots.aidants().persiste(aidantAyantPostuleADeuxDemandesAide);
        await entrepots.aidants().persiste(secondAidant);
        await creeDeuxDemandesAideEnDatePour(
          aidantAyantPostuleADeuxDemandesAide,
          [
            new Date('2025-02-21T14:50:00.000Z'),
            new Date('2025-03-15T08:50:00.000Z'),
          ]
        );
        const miseEnRelation = laMiseEnRelation();

        const donneesMiseEnRelation: DonneesMiseEnRelation = {
          demandeAide: uneDemandeAide()
            .dansLeDepartement(finistere)
            .construis(),
          secteursActivite: [{ nom: 'Transports' }],
          typeEntite: entitesPubliques,
          siret: '12345',
          codeEPCI: 'Bordeaux Métropole',
        };
        await miseEnRelation.execute(donneesMiseEnRelation);

        expect(aidantsContactes).toHaveLength(1);
        expect(aidantsContactes[0].email).toBe('aidant-qui-matche@mail.con');
        expect(aidantsContactes[0].nomPrenom).toBe('Jean MARTIN');
      });
    });
  });
});
