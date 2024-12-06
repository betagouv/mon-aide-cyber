import { beforeEach, describe, expect, it } from 'vitest';
import {
  cguCliquees,
  EtatFormulaireDemandeAutodiagnostic,
  initialiseFormulaireDemandeAutodiagnostic,
  reducteurFormulaireDemandeAutodiagnostic,
} from '../../../../src/domaine/auto-diagnostic/formulaire-demande-auto-diagnostic/reducteurFormulaireDemandeAutodiagnostic';

describe("Formulaire de demande d'autodiagnostic", () => {
  let etatInitial: EtatFormulaireDemandeAutodiagnostic =
    {} as EtatFormulaireDemandeAutodiagnostic;

  beforeEach(() => {
    etatInitial = initialiseFormulaireDemandeAutodiagnostic();
  });

  describe('Les CGUs sont modifiées', () => {
    it('Les prends en compte', () => {
      const etat = reducteurFormulaireDemandeAutodiagnostic(
        etatInitial,
        cguCliquees()
      );

      expect(etat).toStrictEqual({
        cguValidees: true,
        pretPourEnvoi: true,
      });
    });

    it('Les invalides si déjà cochées auparavant', () => {
      const etat = reducteurFormulaireDemandeAutodiagnostic(
        { ...etatInitial, cguValidees: true },
        cguCliquees()
      );

      expect(etat).toStrictEqual({
        cguValidees: false,
        pretPourEnvoi: false,
        erreurs: {
          cguValidees: 'Veuillez valider les CGU.',
        },
      });
    });
  });
});
