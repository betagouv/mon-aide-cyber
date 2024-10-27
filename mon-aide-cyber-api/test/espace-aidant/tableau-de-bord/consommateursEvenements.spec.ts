import { describe, it } from 'vitest';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import { aidantInitieDiagnostic } from '../../../src/espace-aidant/tableau-de-bord/consommateursEvenements';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { DiagnosticLance } from '../../../src/diagnostic/evenements';

describe("Les consommateurs d'évènements du tableau de bord", () => {
  describe("Lorsque l'évènement 'DIAGNOSTIC_LANCE' est consommé", () => {
    it("Créé une relation entre l'aidant et le diagnostic", async () => {
      const adaptateurRelations = new AdaptateurRelationsMAC(
        new EntrepotRelationMemoire()
      );
      const identifiantAidant = crypto.randomUUID();
      const identifiantDiagnostic = crypto.randomUUID();

      await aidantInitieDiagnostic(
        adaptateurRelations
      ).consomme<DiagnosticLance>({
        corps: {
          identifiantDiagnostic,
          origine: { identifiant: identifiantAidant, type: 'AIDANT' },
        },
        identifiant: crypto.randomUUID(),
        type: 'DIAGNOSTIC_LANCE',
        date: FournisseurHorloge.maintenant(),
      });

      expect(
        await adaptateurRelations.diagnosticsInitiePar(identifiantAidant)
      ).toStrictEqual([identifiantDiagnostic]);
    });
  });
});
