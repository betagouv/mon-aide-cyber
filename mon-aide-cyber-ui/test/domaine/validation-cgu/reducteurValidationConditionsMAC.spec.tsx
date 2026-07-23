import { describe, expect, it } from 'vitest';
import {
  ChampsErreur,
  TexteExplicatif,
} from '../../../src/composants/alertes/Erreurs.tsx';
import {
  cguCliquees,
  EtatValidationConditionsMAC,
  initialiseReducteur,
  pixelDeSuiviClique,
  reducteurValidationConditionsMAC,
  validationCGUInvalidee,
} from '../../../src/domaine/validation-cgu/reducteurValidationConditionsMAC.tsx';

describe('Réducteur de validation des conditions d‘utilisation de MAC', () => {
  const etatInitialValidationCGU: EtatValidationConditionsMAC = initialiseReducteur();

  describe("Lorsque l'on clique sur la case à cocher des CGU", () => {
    it('Elles sont signées', () => {
      const etatValidationCGU = reducteurValidationConditionsMAC(
        {
          ...etatInitialValidationCGU,
          erreur: {},
        },
        cguCliquees()
      );

      expect(etatValidationCGU).toStrictEqual<EtatValidationConditionsMAC>({
        cguSignees: true,
        pixelDeSuiviAutorise: false,
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatValidationCGU.saisieValide()).toBe(true);
    });

    it("Elles sont invalidées lorsque l'on reclique dessus", () => {
      const etatValidationCGU = reducteurValidationConditionsMAC(
        {
          ...etatInitialValidationCGU,
          cguSignees: true,
          erreur: {},
        },
        cguCliquees()
      );

      expect(etatValidationCGU).toStrictEqual<EtatValidationConditionsMAC>({
        cguSignees: false,
        pixelDeSuiviAutorise: false,
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
      const etatValidationCGU = reducteurValidationConditionsMAC(
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

      expect(etatValidationCGU).toStrictEqual<EtatValidationConditionsMAC>({
        cguSignees: true,
        pixelDeSuiviAutorise: false,
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatValidationCGU.saisieValide()).toBe(true);
    });
  });

  describe('Lorsque la validation des CGU est revenue en erreur', () => {
    it('Marque la validation comme invalide', () => {
      const etatValidationCGU = reducteurValidationConditionsMAC(
        {
          ...etatInitialValidationCGU,
          cguSignees: true,
          saisieValide: () => true,
        },
        validationCGUInvalidee(new Error('Une erreur est survenue'))
      );

      expect(etatValidationCGU).toStrictEqual<EtatValidationConditionsMAC>({
        cguSignees: false,
        pixelDeSuiviAutorise: false,
        erreur: {},
        saisieValide: expect.any(Function),
        champsErreur: (
          <ChampsErreur erreur={new Error('Une erreur est survenue')} />
        ),
      });
      expect(etatValidationCGU.saisieValide()).toBe(false);
    });
  });

  describe('Lorsque l‘on clique sur la case à cocher de pixel de suivi', () => {
    it('Le suivi est autorisé', () => {
      const etatValidationCGU = reducteurValidationConditionsMAC(
        {
          ...etatInitialValidationCGU,
          cguSignees: true,
          erreur: {},
        },
        pixelDeSuiviClique()
      );

      expect(etatValidationCGU).toStrictEqual<EtatValidationConditionsMAC>({
        cguSignees: true,
        pixelDeSuiviAutorise: true,
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatValidationCGU.saisieValide()).toBe(true);
    });

    it('La saisie est invalide tant que les CGU ne sont pas validées', () => {
      const etatValidationCGU = reducteurValidationConditionsMAC(
        {
          ...etatInitialValidationCGU,
          cguSignees: false,
          erreur: {},
        },
        pixelDeSuiviClique()
      );

      expect(etatValidationCGU).toStrictEqual<EtatValidationConditionsMAC>({
        cguSignees: false,
        pixelDeSuiviAutorise: true,
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatValidationCGU.saisieValide()).toBe(false);
    });
  })
});
