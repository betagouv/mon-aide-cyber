import { beforeEach, describe, expect, it } from 'vitest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  aidantCree,
  diagnosticLance,
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

      aidantCree(entrepot).consomme({
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
});
