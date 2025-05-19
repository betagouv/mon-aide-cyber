import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  AidantMisEnRelation,
  MiseEnRelationParCriteres,
  tokenAttributionDemandeAide,
} from '../../../src/gestion-demandes/aide/MiseEnRelationParCriteres';
import {
  allier,
  Departement,
  finistere,
  gironde,
} from '../../../src/gestion-demandes/departements';
import { beforeEach, describe, expect, it } from 'vitest';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { adaptateursCorpsMessage } from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { unAdaptateurDeCorpsDeMessage } from './ConstructeurAdaptateurDeCorpsDeMessage';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import {
  entitesPrivees,
  entitesPubliques,
} from '../../../src/espace-aidant/Aidant';
import { uneDemandeAide } from './ConstructeurDemandeAide';
import { DonneesMiseEnRelation } from '../../../src/gestion-demandes/aide/miseEnRelation';
import crypto from 'crypto';
import { ServiceDeChiffrementChacha20 } from '../../../src/infrastructure/securite/ServiceDeChiffrementChacha20';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';

const cotParDefaut = {
  rechercheEmailParDepartement: (__departement: Departement) => 'cot@email.com',
};

describe('Mise en relation par critères', () => {
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
    });
  });

  it('Envoie un email de demande d’aide en copie à MAC', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-03-19T14:45:17+01:00'))
    );
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    const miseEnRelation = new MiseEnRelationParCriteres(
      adaptateurEnvoiMail,
      cotParDefaut,
      new EntrepotsMemoire()
    );

    await miseEnRelation.execute({
      demandeAide: uneDemandeAide().construis(),
      secteursActivite: [{ nom: 'Administration' }],
      typeEntite: entitesPubliques,
      siret: '12345',
    });

    expect(
      adaptateurEnvoiMail.aEteEnvoyeEnCopieA(
        'copie-mac@email.com',
        'Bonjour une entité a fait une demande d’aide'
      )
    ).toBe(true);
  });

  it('Envoie un email de demande d’aide au COT de la région', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-03-19T14:45:17+01:00'))
    );
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    const annuaireCOT = {
      rechercheEmailParDepartement: (__departement: Departement) =>
        'gironde@ssi.gouv.fr',
    };
    const miseEnRelation = new MiseEnRelationParCriteres(
      adaptateurEnvoiMail,
      annuaireCOT,
      new EntrepotsMemoire()
    );

    await miseEnRelation.execute({
      demandeAide: uneDemandeAide().construis(),
      secteursActivite: [{ nom: 'Administration' }],
      typeEntite: entitesPrivees,
      siret: '12345',
    });

    expect(
      adaptateurEnvoiMail.aEteEnvoyeA(
        'gironde@ssi.gouv.fr',
        'Bonjour une entité a fait une demande d’aide'
      )
    ).toBe(true);
  });

  describe('Matching des Aidants', () => {
    it('Indique dans le mail envoyé au COT, la liste des aidants qui ont matchés', async () => {
      const entrepots = new EntrepotsMemoire();
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
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .recapitulatifDemandeAide((_aide, aidants) => {
          if (aidants.length === 0) {
            throw new Error('Ce test devrait trouver 1 Aidant.');
          }
          return `Aidant trouvé par le matching : ${aidants[0].nomPrenom} (${aidants[0].email})`;
        })
        .construis().demande;
      const annuaireCOT = {
        rechercheEmailParDepartement: (__departement: Departement) =>
          'gironde@ssi.gouv.fr',
      };
      const miseEnRelation = new MiseEnRelationParCriteres(
        adaptateurEnvoiMail,
        annuaireCOT,
        entrepots
      );

      await miseEnRelation.execute({
        demandeAide: uneDemandeAide().dansLeDepartement(gironde).construis(),
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPrivees,
        siret: '12345',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          'gironde@ssi.gouv.fr',
          'Aidant trouvé par le matching : Jean DUPONT (jean.dupont@email.com)'
        )
      ).toBe(true);
    });

    it('Génère un lien unique par Aidant pour postuler à la demande', async () => {
      const entrepots = new EntrepotsMemoire();
      const premierAidant = unAidant()
        .ayantPourDepartements([finistere])
        .ayantPourSecteursActivite([{ nom: 'Transports' }])
        .ayantPourTypesEntite([entitesPubliques])
        .construis();
      await entrepots.aidants().persiste(premierAidant);
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const aidantsContactes: AidantMisEnRelation[] = [];
      adaptateurEnvoiMail.envoieMiseEnRelation = async (
        _donneesMiseEnRelation,
        aidant
      ) => {
        aidantsContactes.push(aidant);
      };
      adaptateurEnvironnement.miseEnRelation = () => ({
        aidantsDeTest: ['jean.dupont@email.com', 'jean.dujardin@email.com'],
      });
      const miseEnRelation = new MiseEnRelationParCriteres(
        adaptateurEnvoiMail,
        cotParDefaut,
        entrepots
      );

      await miseEnRelation.execute({
        demandeAide: uneDemandeAide()
          .avecUnEmail('demandeur@societe.fr')
          .dansLeDepartement(finistere)
          .construis(),
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPubliques,
        siret: '12345',
      });

      expect(aidantsContactes).toHaveLength(2);
      const premierAidantMisEnRelation = aidantsContactes[0];
      expect(
        tokenAttributionDemandeAide().dechiffre(
          premierAidantMisEnRelation.lienPourPostuler.substring(
            premierAidantMisEnRelation.lienPourPostuler.indexOf('=') + 1
          )
        )
      ).toStrictEqual<{ demande: string; aidant: crypto.UUID }>({
        demande: 'demandeur@societe.fr',
        aidant: expect.any(String),
      });
      const deuxiemeAidantMisEnRelation = aidantsContactes[0];
      expect(
        tokenAttributionDemandeAide().dechiffre(
          deuxiemeAidantMisEnRelation.lienPourPostuler.substring(
            deuxiemeAidantMisEnRelation.lienPourPostuler.indexOf('=') + 1
          )
        )
      ).toStrictEqual<{ demande: string; aidant: crypto.UUID }>({
        demande: 'demandeur@societe.fr',
        aidant: expect.any(String),
      });
    });

    it('[FEATURE FLAG] Envoie un mail direct seulement aux Aidants mentionnés dans la variable d’environnement', async () => {
      const entrepots = new EntrepotsMemoire();
      const premierAidant = unAidant()
        .ayantPourDepartements([finistere])
        .ayantPourSecteursActivite([{ nom: 'Transports' }])
        .ayantPourTypesEntite([entitesPubliques])
        .construis();
      adaptateurEnvironnement.miseEnRelation = () => ({
        aidantsDeTest: ['aidant-hardcode@beta.gouv.fr'],
      });
      const aidantsContactes: AidantMisEnRelation[] = [];
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      adaptateurEnvoiMail.envoieMiseEnRelation = async (
        _donneesMiseEnRelation,
        aidant
      ) => {
        aidantsContactes.push(aidant);
      };
      await entrepots.aidants().persiste(premierAidant);
      const miseEnRelation = new MiseEnRelationParCriteres(
        adaptateurEnvoiMail,
        cotParDefaut,
        entrepots
      );

      const donneesMiseEnRelation: DonneesMiseEnRelation = {
        demandeAide: uneDemandeAide().dansLeDepartement(finistere).construis(),
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPubliques,
        siret: '12345',
      };
      await miseEnRelation.execute(donneesMiseEnRelation);

      expect(aidantsContactes).toHaveLength(1);
      expect(aidantsContactes[0].email).toBe('aidant-hardcode@beta.gouv.fr');
    });

    it('Envoie un mail au COT en cas de matching infructueux', async () => {
      const entrepots = new EntrepotsMemoire();
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .aucunAidantPourLaDemandeAide((donneesMiseEnRelation) => {
          return `Aucun Aidant! ${donneesMiseEnRelation.siret}`;
        })
        .construis().demande;
      const annuaireCOT = {
        rechercheEmailParDepartement: (__departement: Departement) =>
          'gironde@ssi.gouv.fr',
      };
      const miseEnRelation = new MiseEnRelationParCriteres(
        adaptateurEnvoiMail,
        annuaireCOT,
        entrepots
      );

      await miseEnRelation.execute({
        demandeAide: uneDemandeAide().dansLeDepartement(gironde).construis(),
        secteursActivite: [{ nom: 'Transports' }],
        typeEntite: entitesPrivees,
        siret: '12345',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          'gironde@ssi.gouv.fr',
          'Aucun Aidant! 12345'
        )
      ).toBe(true);
    });

    it('Chiffre et déchiffre le token de mise en relation', async () => {
      const serviceDeChiffrement = new ServiceDeChiffrementChacha20(
        Buffer.from('ivlongueur12'),
        Buffer.from('assoc-longueur16'),
        'ma-clef-secrete-de-longueur-0032'
      );
      const demandeAide: DemandeAide = uneDemandeAide()
        .avecUnEmail('jean.dupont@email.com')
        .construis();
      const identifiantAidant = '7571dfe9-31e7-4e6f-80de-fafa3f323b1d';

      const valeurChiffree = tokenAttributionDemandeAide(
        serviceDeChiffrement
      ).chiffre(demandeAide.email, identifiantAidant);

      expect(valeurChiffree).toBe(
        'Njk3NjZjNmY2ZTY3NzU2NTc1NzIzMTMyNjE3MzczNmY2MzJkNmM2ZjZlNjc3NTY1NzU3MjMxMzZmNWY0ZDBhZTc4YzNhOTEwMGMxN2E0Njc4MGI4Zjk5NmFmOTg4NWU2NWQ1MDc2MmQ1OGY1MTMzODc3YTAwYjUyOWNjYTIwODA0N2ViNDRjMTM2MjQ5NWM0NzhhOTcwMDg3YmZlZWNmZWI5YjBmZjRmYjU0YTVlMWI5ZjU3MWZmN2E3NjY2MWE1NTI5OGMxOWNmNzlhNzY1OWVhZDJkNTliOWI5NjViMDFhOWM4YmU3MmZiOGNkOTU2NjkyMTExNTIwNDVlYWM='
      );
      expect(
        tokenAttributionDemandeAide(serviceDeChiffrement).dechiffre(
          valeurChiffree
        )
      ).toStrictEqual({
        demande: 'jean.dupont@email.com',
        aidant: '7571dfe9-31e7-4e6f-80de-fafa3f323b1d',
      });
    });
  });
});
