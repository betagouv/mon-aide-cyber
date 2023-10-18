import { describe, expect, it } from 'vitest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  diagnosticLance,
  diagnosticTermnine,
  reponseAjoutee,
} from '../../src/journalisation/evenements';
import { EntrepotEvenementJournalMemoire } from '../infrastructure/entrepots/memoire/EntrepotsMemoire';
import crypto from 'crypto';

describe('Évènements', () => {
  beforeEach(() => {
    FournisseurHorlogeDeTest.initialise(new Date());
  });

  describe('Diagnostic terminé', () => {
    it("lorsque l'évènement est consommé, il est persisté", async () => {
      const entrepot = new EntrepotEvenementJournalMemoire();

      diagnosticTermnine(entrepot).consomme({
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_TERMINE',
        date: FournisseurHorloge.maintenant(),
        corps: {},
      });

      expect(await entrepot.tous()).toMatchObject([
        {
          date: FournisseurHorloge.maintenant(),
          type: 'DIAGNOSTIC_TERMINE',
          donnees: {},
        },
      ]);
    });
  });

  describe('Diagnostic lancé', () => {
    it("lorsque l'évènement est consommé, il est persisté", async () => {
      const entrepot = new EntrepotEvenementJournalMemoire();

      diagnosticLance(entrepot).consomme({
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
        corps: {},
      });

      expect(await entrepot.tous()).toMatchObject([
        {
          date: FournisseurHorloge.maintenant(),
          type: 'DIAGNOSTIC_LANCE',
          donnees: {},
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
});
