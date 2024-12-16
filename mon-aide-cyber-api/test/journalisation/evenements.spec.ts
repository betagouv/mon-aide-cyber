import { describe, expect, it } from 'vitest';
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
} from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import crypto from 'crypto';
import { RestitutionLancee } from '../../src/diagnostic/CapteurCommandeLanceRestitution';
import { Publication } from '../../src/journalisation/Publication';
import { DiagnosticLance } from '../../src/diagnostic/CapteurCommandeLanceDiagnostic';
import { unServiceAidant } from '../../src/espace-aidant/ServiceAidantMAC';
import { unAidant } from '../constructeurs/constructeursAidantUtilisateur';

describe('Évènements', () => {
  beforeEach(() => {
    FournisseurHorlogeDeTest.initialise(new Date());
  });

  describe('Restitution lancée', () => {
    it("lorsque l'évènement est consommé, il est persisté", async () => {
      const entrepot = new EntrepotEvenementJournalMemoire();
      const identifiant = crypto.randomUUID();

      restitutionLancee(entrepot).consomme<RestitutionLancee>({
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
    it("lorsque l'évènement est consommé, il est persisté", async () => {
      const entrepot = new EntrepotEvenementJournalMemoire();
      const entrepotAidant = new EntrepotAidantMemoire();
      const aidant = unAidant().construis();
      await entrepotAidant.persiste(aidant);
      const identifiant = crypto.randomUUID();

      await diagnosticLance(
        entrepot,
        unServiceAidant(entrepotAidant)
      ).consomme<DiagnosticLance>({
        identifiant: identifiant,
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiantDiagnostic: identifiant,
          identifiantAidant: aidant.identifiant,
        },
      });

      expect(await entrepot.tous()).toStrictEqual<Publication[]>([
        {
          identifiant: expect.any(String),
          date: FournisseurHorloge.maintenant(),
          type: 'DIAGNOSTIC_LANCE',
          donnees: {
            identifiantDiagnostic: identifiant,
            identifiantAidant: aidant.identifiant,
            profil: 'Aidant',
          },
        },
      ]);
    });

    it("Lorsque l'évènement est publié suite à un diagnostic Gendarme, l'information Gendarme est persistée", async () => {
      const entrepot = new EntrepotEvenementJournalMemoire();
      const entrepotAidant = new EntrepotAidantMemoire();
      const aidant = unAidant().avecUnSiret('GENDARMERIE').construis();
      await entrepotAidant.persiste(aidant);
      const identifiant = crypto.randomUUID();

      await diagnosticLance(
        entrepot,
        unServiceAidant(entrepotAidant)
      ).consomme<DiagnosticLance>({
        identifiant: identifiant,
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiantDiagnostic: identifiant,
          identifiantAidant: aidant.identifiant,
        },
      });

      expect(await entrepot.tous()).toStrictEqual<Publication[]>([
        {
          identifiant: expect.any(String),
          date: FournisseurHorloge.maintenant(),
          type: 'DIAGNOSTIC_LANCE',
          donnees: {
            identifiantDiagnostic: identifiant,
            identifiantAidant: aidant.identifiant,
            profil: 'Gendarme',
          },
        },
      ]);
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
