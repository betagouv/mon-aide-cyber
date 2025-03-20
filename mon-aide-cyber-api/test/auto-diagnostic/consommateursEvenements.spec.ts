import { describe, expect, it } from 'vitest';
import { AdaptateurRelationsMAC } from '../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../src/relation/infrastructure/EntrepotRelationMemoire';
import crypto from 'crypto';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { EntrepotEvenementJournalMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';

describe("Les consommateurs d'évènements de l’auto diagnostic", () => {
  describe("Lorsque l’événement 'AUTO_DIAGNOSTIC_LANCE' est consommé", () => {
    it('Crée la relation entre la demande et l’auto diagnostic', async () => {
      const adaptateurRelations = new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire()
      );
      const identifiantDemande = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();
      const busEvenement = new BusEvenementDeTest(
        {
          adaptateurRelations,
          entrepotJournalisation: new EntrepotEvenementJournalMemoire(),
        },
        ['DIAGNOSTIC_LIBRE_ACCES_LANCE']
      );

      await busEvenement.publie({
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_LIBRE_ACCES_LANCE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          idDiagnostic: identifiantDiagnostic,
          idDemande: identifiantDemande,
        },
      });

      expect(
        await adaptateurRelations.diagnosticsFaitsParUtilisateurMAC(
          identifiantDemande
        )
      ).toStrictEqual([identifiantDiagnostic]);
    });
  });
});
