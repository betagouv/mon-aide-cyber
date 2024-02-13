import { describe, expect, it } from 'vitest';
import {
  cguCliquees,
  EtatFinalisationCreationCompte,
  finalisationCreationCompteInvalidee,
  finalisationCreationCompteTransmise,
  finalisationCreationCompteValidee,
  reducteurFinalisationCreationCompte,
} from '../../../src/composants/parcoursCGU/reducteurFinalisationCreationCompte.tsx';
import {
  ChampsErreur,
  TexteExplicatif,
} from '../../../src/composants/erreurs/Erreurs.tsx';

describe('Réducteur de finalisation de création de compte', () => {
  const etatInitialFinalisationCreationCompte: EtatFinalisationCreationCompte =
    {
      cguSignees: false,
      erreur: {},
      saisieValide: () => false,
    };
  describe('Lors de la validation du compte', () => {
    it('invalide les CGU si elles ne sont pas signées', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          { ...etatInitialFinalisationCreationCompte },
          finalisationCreationCompteValidee(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
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
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(false);
    });
  });

  describe("Lorsque l'on clique sur la case à cocher des CGU", () => {
    it('elles sont signées', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            erreur: {},
          },
          cguCliquees(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(true);
    });

    it('la finalisation de création du compte est validée', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            erreur: {},
          },
          cguCliquees(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(true);
    });

    it('elles sont invalidées', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            cguSignees: true,
            erreur: {},
          },
          cguCliquees(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
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
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(false);
    });

    it('les erreurs précédentes sur les CGU sont vidées', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            erreur: {
              cguSignees: {
                className: 'fr-input-group--error',
                texteExplicatif: <></>,
              },
            },
          },
          cguCliquees(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(true);
    });
  });

  describe('Lorsque la finalisation de création de compte a été transmise', () => {
    it('supprime la notion finalisation à transmettre', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            cguSignees: true,
          },
          finalisationCreationCompteTransmise(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });
  });

  describe('Lorsque la finalisation de création de compte a subi une erreur', () => {
    it('marque la finalisation comme invalide', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            cguSignees: true,
            finalisationCreationCompteATransmettre: true,
            saisieValide: () => true,
          },
          finalisationCreationCompteInvalidee(
            new Error('Une erreur est survenue'),
          ),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: false,
        erreur: {},
        saisieValide: expect.any(Function),
        champsErreur: (
          <ChampsErreur erreur={new Error('Une erreur est survenue')} />
        ),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(false);
    });
  });
});
