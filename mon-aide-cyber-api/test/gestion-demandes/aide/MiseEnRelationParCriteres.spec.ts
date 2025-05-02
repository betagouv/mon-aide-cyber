import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { MiseEnRelationParCriteres } from '../../../src/gestion-demandes/aide/MiseEnRelationParCriteres';
import {
  allier,
  Departement,
  gironde,
} from '../../../src/gestion-demandes/departements';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { beforeEach, describe, expect, it } from 'vitest';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { adaptateursCorpsMessage } from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { unAdaptateurDeCorpsDeMessage } from './ConstructeurAdaptateurDeCorpsDeMessage';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { DonneesMiseEnRelation } from '../../../src/gestion-demandes/aide/miseEnRelation';

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
      demandeAide: {
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
      },
      secteursActivite: [{ nom: 'Administration' }],
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
      demandeAide: {
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
      },
      secteursActivite: [{ nom: 'Administration' }],
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
    it("Pour le département de l'entité Aidée", async () => {
      const entrepots = new EntrepotsMemoire();
      const unAidantEnGironde = unAidant()
        .avecUnNomPrenom('Jean DUPONT')
        .avecUnEmail('jean.dupont@email.com')
        .ayantPourSecteursActivite([{ nom: 'Administration' }])
        .ayantPourDepartements([gironde])
        .construis();
      const unAidantSansDepartement = unAidant()
        .avecUnNomPrenom('Jean DUBOIS')
        .avecUnEmail('jean.dubois@email.com')
        .ayantPourDepartements([allier])
        .construis();
      await entrepots.aidants().persiste(unAidantEnGironde);
      await entrepots.aidants().persiste(unAidantSansDepartement);
      const donneesMiseEnRelation: DonneesMiseEnRelation = {
        demandeAide: {
          identifiant: crypto.randomUUID(),
          dateSignatureCGU: FournisseurHorloge.maintenant(),
          email: 'jean-dujardin@email.com',
          departement: gironde,
          raisonSociale: 'BetaGouv',
        },
        secteursActivite: [{ nom: 'Administration' }],
        siret: '12345',
      };
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .recapitulatifDemandeAide(
          (_aide, aidants, _relationUtilisateur) =>
            `${aidants[0].nomPrenom} (${aidants[0].email})`
        )
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
      await miseEnRelation.execute(donneesMiseEnRelation);

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          'gironde@ssi.gouv.fr',
          'Jean DUPONT (jean.dupont@email.com)'
        )
      ).toBe(true);
    });

    it("Pour le secteur d'activité de l'entité Aidée", async () => {
      const entrepots = new EntrepotsMemoire();
      const entrepotAidant = entrepots.aidants();
      const unAidantDansLAdministrationEtLAgroalimentaire = unAidant()
        .avecUnNomPrenom('Jean DUPONT')
        .avecUnEmail('jean.dupont@email.com')
        .ayantPourDepartements([gironde])
        .ayantPourSecteursActivite([
          { nom: 'Administration' },
          { nom: 'Agroalimentaire' },
        ])
        .construis();
      const unAidantDansLesTransports = unAidant()
        .avecUnNomPrenom('Jean DUBOIS')
        .avecUnEmail('jean.dubois@email.com')
        .ayantPourDepartements([gironde])
        .ayantPourSecteursActivite([{ nom: 'Transports' }])
        .construis();
      await entrepotAidant.persiste(
        unAidantDansLAdministrationEtLAgroalimentaire
      );
      await entrepotAidant.persiste(unAidantDansLesTransports);
      const donneesMiseEnRelation: DonneesMiseEnRelation = {
        demandeAide: {
          identifiant: crypto.randomUUID(),
          dateSignatureCGU: FournisseurHorloge.maintenant(),
          email: 'jean-dujardin@email.com',
          departement: gironde,
          raisonSociale: 'BetaGouv',
        },
        secteursActivite: [{ nom: 'Transports' }],
        siret: '12345',
      };
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .recapitulatifDemandeAide(
          (_aide, aidants, _relationUtilisateur) =>
            `${aidants[0].nomPrenom} (${aidants[0].email})`
        )
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
      await miseEnRelation.execute(donneesMiseEnRelation);

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          'gironde@ssi.gouv.fr',
          'Jean DUBOIS (jean.dubois@email.com)'
        )
      ).toBe(true);
    });
  });
});
