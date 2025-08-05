import { beforeEach, describe, expect, it } from 'vitest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  aidantCree,
  diagnosticLance,
  mailCreationCompteAidantEnvoye,
  mailCreationCompteAidantNonEnvoye,
  relaieSurMattermostActivationCompteAidantEchouee,
  reponseAjoutee,
  restitutionLancee,
} from '../../src/journalisation/evenements';
import {
  EntrepotAidantMemoire,
  EntrepotEvenementJournalMemoire,
  EntrepotUtilisateurInscritMemoire,
  EntrepotUtilisateurMACMemoire,
} from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import crypto from 'crypto';
import { RestitutionLancee } from '../../src/diagnostic/CapteurCommandeLanceRestitution';
import { Publication } from '../../src/journalisation/Publication';
import { DiagnosticLance } from '../../src/diagnostic/CapteurCommandeLanceDiagnostic';
import { unAidant } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { uneRechercheUtilisateursMAC } from '../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { uneDemandeAide } from '../gestion-demandes/aide/ConstructeurDemandeAide';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  ActivationCompteAidantEchouee,
  MailCompteAidantActiveEnvoye,
  MailCompteAidantActiveNonEnvoye,
} from '../../src/gestion-demandes/devenir-aidant/CapteurSagaActivationCompteAidant';
import { Messagerie } from '../../src/infrastructure/adaptateurs/AdaptateurMessagerieMattermost';

describe('Évènements', () => {
  beforeEach(() => {
    FournisseurHorlogeDeTest.initialise(new Date());
  });

  describe('Restitution lancée', () => {
    it("lorsque l'évènement est consommé, il est persisté", async () => {
      const entrepot = new EntrepotEvenementJournalMemoire();
      const identifiant = crypto.randomUUID();

      await restitutionLancee(entrepot).consomme<RestitutionLancee>({
        identifiant: identifiant,
        type: 'RESTITUTION_LANCEE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiantDiagnostic: identifiant,
        },
      });

      expect(await entrepot.tous()).toStrictEqual<Publication[]>([
        {
          identifiant: expect.any(String),
          date: FournisseurHorloge.maintenant(),
          type: 'RESTITUTION_LANCEE',
          donnees: { identifiantDiagnostic: identifiant },
        },
      ]);
    });
  });

  describe('Diagnostic lancé', () => {
    describe("Dans le cas d'un Aidant", () => {
      const entrepoUtilisateurInscrit = new EntrepotUtilisateurInscritMemoire();
      it("lorsque l'évènement est consommé, il est persisté", async () => {
        const entrepots = new EntrepotsMemoire();
        const entrepot = new EntrepotEvenementJournalMemoire();
        const entrepotAidant = new EntrepotAidantMemoire();
        const aidant = unAidant().construis();
        await entrepotAidant.persiste(aidant);
        const demandeAide = uneDemandeAide()
          .avecUnEmail('beta@beta.gouv.fr')
          .construis();
        await entrepots.demandesAides().persiste(demandeAide);
        const identifiantEvenement = crypto.randomUUID();

        await diagnosticLance(
          entrepot,
          uneRechercheUtilisateursMAC(
            new EntrepotUtilisateurMACMemoire({
              aidant: entrepotAidant,
              utilisateurInscrit: entrepoUtilisateurInscrit,
            })
          ),
          entrepots.demandesAides()
        ).consomme<DiagnosticLance>({
          identifiant: identifiantEvenement,
          type: 'DIAGNOSTIC_LANCE',
          date: FournisseurHorloge.maintenant(),
          corps: {
            identifiantDiagnostic: identifiantEvenement,
            identifiantUtilisateur: aidant.identifiant,
            emailEntite: demandeAide.email,
          },
        });

        expect(await entrepot.tous()).toStrictEqual<Publication[]>([
          {
            identifiant: expect.any(String),
            date: FournisseurHorloge.maintenant(),
            type: 'DIAGNOSTIC_LANCE',
            donnees: {
              identifiantDiagnostic: identifiantEvenement,
              identifiantUtilisateur: aidant.identifiant,
              profil: 'Aidant',
              identifiantDemandeAide: demandeAide.identifiant,
            },
          },
        ]);
      });

      it("Lorsque l'évènement est publié suite à un diagnostic Gendarme, l'information Gendarme est persistée", async () => {
        const entrepots = new EntrepotsMemoire();
        const entrepot = new EntrepotEvenementJournalMemoire();
        const entrepotAidant = new EntrepotAidantMemoire();
        const aidant = unAidant().avecUnProfilGendarme().construis();
        await entrepotAidant.persiste(aidant);
        const identifiantEvenement = crypto.randomUUID();
        const demandeAide = uneDemandeAide()
          .avecUnEmail('beta@beta.gouv.fr')
          .construis();
        await entrepots.demandesAides().persiste(demandeAide);

        await diagnosticLance(
          entrepot,
          uneRechercheUtilisateursMAC(
            new EntrepotUtilisateurMACMemoire({
              aidant: entrepotAidant,
              utilisateurInscrit: entrepoUtilisateurInscrit,
            })
          ),
          entrepots.demandesAides()
        ).consomme<DiagnosticLance>({
          identifiant: identifiantEvenement,
          type: 'DIAGNOSTIC_LANCE',
          date: FournisseurHorloge.maintenant(),
          corps: {
            identifiantDiagnostic: identifiantEvenement,
            identifiantUtilisateur: aidant.identifiant,
            emailEntite: demandeAide.email,
          },
        });

        expect(await entrepot.tous()).toStrictEqual<Publication[]>([
          {
            identifiant: expect.any(String),
            date: FournisseurHorloge.maintenant(),
            type: 'DIAGNOSTIC_LANCE',
            donnees: {
              identifiantDiagnostic: identifiantEvenement,
              identifiantUtilisateur: aidant.identifiant,
              identifiantDemandeAide: demandeAide.identifiant,
              profil: 'Gendarme',
            },
          },
        ]);
      });
    });
  });

  describe('Diagnostic réponse ajoutée', () => {
    it("lorsque l'évènement est consommé, il est persisté", async () => {
      const entrepot = new EntrepotEvenementJournalMemoire();

      reponseAjoutee(entrepot).consomme({
        identifiant: crypto.randomUUID(),
        type: 'REPONSE_AJOUTEE',
        date: FournisseurHorloge.maintenant(),
        corps: {},
      });

      expect(await entrepot.tous()).toMatchObject([
        {
          date: FournisseurHorloge.maintenant(),
          type: 'REPONSE_AJOUTEE',
          donnees: {},
        },
      ]);
    });
  });

  describe('Aidant créé', () => {
    it("lorsque l'évènement est consommé, il est persisté", async () => {
      const identifiant = crypto.randomUUID();
      const entrepot = new EntrepotEvenementJournalMemoire();

      await aidantCree(entrepot).consomme({
        date: FournisseurHorloge.maintenant(),
        identifiant,
        type: 'AIDANT_CREE',
        corps: { identifiant },
      });

      expect(await entrepot.tous()).toMatchObject([
        {
          donnees: { identifiant },
          date: FournisseurHorloge.maintenant(),
          type: 'AIDANT_CREE',
        },
      ]);
    });
  });

  describe('Activation compte Aidant', () => {
    it("publie sur la messagerie lorsqu'une demande inexistante est reçue", async () => {
      let messageEnvoye: string | null = null;
      const messagerie: Messagerie = {
        envoieMessageMarkdown: async (message: string) => {
          messageEnvoye = message;
        },
      };
      FournisseurHorlogeDeTest.initialise(new Date());
      const identifiant = crypto.randomUUID();

      await relaieSurMattermostActivationCompteAidantEchouee(
        messagerie
      ).consomme<ActivationCompteAidantEchouee>({
        identifiant,
        type: 'ACTIVATION_COMPTE_AIDANT_ECHOUEE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          emailDemande: 'mail-inconnu@mail.com',
          raisonEchec: 'DEMANDE_DEVENIR_AIDANT_INEXISTANTE',
        },
      });

      expect(messageEnvoye).toStrictEqual(
        "#### ❌ Activation compte Aidant : \n > Une requête d‘activation de compte Aidant a été faite avec un email inconnu \n\n Email de l'Aidant : `mail-inconnu@mail.com`"
      );
    });

    it('publie sur la messagerie lorsque l‘Aidant existe déjà', async () => {
      let messageEnvoye: string | null = null;
      const messagerie: Messagerie = {
        envoieMessageMarkdown: async (message: string) => {
          messageEnvoye = message;
        },
      };
      FournisseurHorlogeDeTest.initialise(new Date());
      const identifiant = crypto.randomUUID();

      await relaieSurMattermostActivationCompteAidantEchouee(
        messagerie
      ).consomme<ActivationCompteAidantEchouee>({
        identifiant,
        type: 'ACTIVATION_COMPTE_AIDANT_ECHOUEE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          emailDemande: 'mail-deja-aidant@mail.com',
          raisonEchec: 'AIDANT_DEJA_EXISTANT',
        },
      });

      expect(messageEnvoye).toStrictEqual(
        '#### 🙆‍♂️ Activation compte Aidant : \n > La personne ayant pour email `mail-deja-aidant@mail.com` est déjà Aidante !'
      );
    });

    it("journalise l'événément MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE", async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const identifiant = crypto.randomUUID();

      const entrepotEvenementJournalMemoire =
        new EntrepotEvenementJournalMemoire();
      await mailCreationCompteAidantEnvoye(
        entrepotEvenementJournalMemoire
      ).consomme<MailCompteAidantActiveEnvoye>({
        identifiant,
        type: 'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiantDemande: identifiant,
        },
      });

      expect(await entrepotEvenementJournalMemoire.tous()).toHaveLength(1);
    });

    it('publie sur la messagerie quand le compte Aidant est activé', async () => {
      let messageEnvoye: string | null = null;
      const messagerie: Messagerie = {
        envoieMessageMarkdown: async (message: string) => {
          messageEnvoye = message;
        },
      };
      FournisseurHorlogeDeTest.initialise(new Date());
      const identifiant = crypto.randomUUID();

      await mailCreationCompteAidantEnvoye(
        new EntrepotEvenementJournalMemoire(),
        messagerie
      ).consomme<MailCompteAidantActiveEnvoye>({
        identifiant,
        type: 'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiantDemande: identifiant,
        },
      });

      expect(messageEnvoye).toStrictEqual(
        `#### :partying_face: Activation compte Aidant : \n > Activation faite pour la demande ${identifiant}`
      );
    });

    it("journalise l'événément MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE", async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const identifiant = crypto.randomUUID();

      const entrepotEvenementJournalMemoire =
        new EntrepotEvenementJournalMemoire();
      await mailCreationCompteAidantNonEnvoye(
        entrepotEvenementJournalMemoire
      ).consomme<MailCompteAidantActiveNonEnvoye>({
        identifiant,
        type: 'MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiantDemande: identifiant,
          erreur: 'Erreur',
        },
      });

      const tousLesEvenements = await entrepotEvenementJournalMemoire.tous();
      expect(tousLesEvenements[0]).toStrictEqual<Publication>({
        identifiant: expect.any(String),
        date: FournisseurHorloge.maintenant(),
        type: 'MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE',
        donnees: {
          identifiantDemande: identifiant,
        },
      });
    });

    it('publie sur la messagerie lorsque le mail d‘activation n‘a pu être envoyé', async () => {
      let messageEnvoye: string | null = null;
      const messagerie: Messagerie = {
        envoieMessageMarkdown: async (message: string) => {
          messageEnvoye = message;
        },
      };
      FournisseurHorlogeDeTest.initialise(new Date());
      const identifiant = crypto.randomUUID();

      await mailCreationCompteAidantNonEnvoye(
        new EntrepotEvenementJournalMemoire(),
        messagerie
      ).consomme<MailCompteAidantActiveNonEnvoye>({
        identifiant,
        type: 'MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiantDemande: identifiant,
          erreur: 'Erreur lors de l‘envoi',
        },
      });

      expect(messageEnvoye).toStrictEqual(
        `#### :alert: Activation compte Aidant : \n > Le mail d‘activation n‘ pu être remis pour la demande ${identifiant} (erreur: 'Erreur lors de l‘envoi')`
      );
    });
  });
});
