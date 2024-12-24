import { describe, expect, it } from 'vitest';
import {
  ChampsErreur,
  TexteExplicatif,
} from '../../../src/composants/alertes/Erreurs.tsx';
import {
  cguCliquees,
  EtatValidationCGU,
  initialiseReducteur,
  reducteurValidationCGU,
  validationCGUInvalidee,
} from '../../../src/domaine/validation-cgu/reducteurValidationCGU.tsx';

describe('Réducteur de validation des CGU', () => {
  const etatInitialValidationCGU: EtatValidationCGU = initialiseReducteur();

  describe("Lorsque l'on clique sur la case à cocher des CGU", () => {
    it('Elles sont signées', () => {
      const etatValidationCGU = reducteurValidationCGU(
        {
          ...etatInitialValidationCGU,
          erreur: {},
        },
        cguCliquees()
      );

      expect(etatValidationCGU).toStrictEqual<EtatValidationCGU>({
        cguSignees: true,
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatValidationCGU.saisieValide()).toBe(true);
    });

    it("Elles sont invalidées lorsque l'on reclique dessus", () => {
      const etatValidationCGU = reducteurValidationCGU(
        {
          ...etatInitialValidationCGU,
          cguSignees: true,
          erreur: {},
        },
        cguCliquees()
      );

      expect(etatValidationCGU).toStrictEqual<EtatValidationCGU>({
        cguSignees: false,
        erreur: {
          cguSignees: {
            className: 'fr-input-group--error',
            texteExplicatif: (
              <TexteExplicatif
                id="cguSignees"
                texte="Veuillez accepter les CGU."
              />
            ),
          },
        },
        saisieValide: expect.any(Function),
      });
      expect(etatValidationCGU.saisieValide()).toBe(false);
    });

    it('Les erreurs précédentes sur les CGU sont vidées', () => {
      const etatValidationCGU = reducteurValidationCGU(
        {
          ...etatInitialValidationCGU,
          erreur: {
            cguSignees: {
              className: 'fr-input-group--error',
              texteExplicatif: <></>,
            },
          },
        },
        cguCliquees()
      );

      expect(etatValidationCGU).toStrictEqual<EtatValidationCGU>({
        cguSignees: true,
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatValidationCGU.saisieValide()).toBe(true);
    });
  });

  describe('Lorsque la validation des CGU est revenue en erreur', () => {
    it('Marque la validation comme invalide', () => {
      const etatValidationCGU = reducteurValidationCGU(
        {
          ...etatInitialValidationCGU,
          cguSignees: true,
          saisieValide: () => true,
        },
        validationCGUInvalidee(new Error('Une erreur est survenue'))
      );

      expect(etatValidationCGU).toStrictEqual<EtatValidationCGU>({
        cguSignees: false,
        erreur: {},
        saisieValide: expect.any(Function),
        champsErreur: (
          <ChampsErreur erreur={new Error('Une erreur est survenue')} />
        ),
      });
      expect(etatValidationCGU.saisieValide()).toBe(false);
    });
  });
});
