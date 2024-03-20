import { describe, expect, it } from 'vitest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { aidantCree, diagnosticLance, restitutionLancee, reponseAjoutee } from '../../src/journalisation/evenements';
import { EntrepotEvenementJournalMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import crypto from 'crypto';

describe('Évènements', () => {
  beforeEach(() => {
    FournisseurHorlogeDeTest.initialise(new Date());
  });

  describe('Restitution lancée', () => {
    it("lorsque l'évènement est consommé, il est persisté", async () => {
      const entrepot = new EntrepotEvenementJournalMemoire();

      restitutionLancee(entrepot).consomme({
        identifiant: crypto.randomUUID(),
        type: 'RESTITUTION_LANCEE',
        date: FournisseurHorloge.maintenant(),
        corps: {},
      });

      expect(await entrepot.tous()).toMatchObject([
        {
          date: FournisseurHorloge.maintenant(),
          type: 'RESTITUTION_LANCEE',
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
