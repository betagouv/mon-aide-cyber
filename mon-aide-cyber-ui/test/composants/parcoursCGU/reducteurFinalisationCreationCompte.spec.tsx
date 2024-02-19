import { describe, expect, it } from 'vitest';
import {
  cguCliquees,
  EtatFinalisationCreationCompte,
  finalisationCreationCompteInvalidee,
  finalisationCreationCompteTransmise,
  finalisationCreationCompteValidee,
  nouveauMotDePasseConfirme,
  nouveauMotDePasseSaisi,
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
      nouveauMotDePasse: '',
      erreur: {},
      saisieValide: () => false,
    };
  describe('Lors de la validation du compte', () => {
    it('invalide les CGU si elles ne sont pas signées', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            nouveauMotDePasse: 'mdp',
            motDePasseConfirme: 'mdp',
          },
          finalisationCreationCompteValidee(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: false,
        nouveauMotDePasse: 'mdp',
        motDePasseConfirme: 'mdp',
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

    it('sur la confirmation, une erreur est montrée si les mots de passe ne correspondent pas', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            cguSignees: true,
            nouveauMotDePasse: 'un-mot-de-passe',
            motDePasseConfirme: 'un-autre-mot-de-passe',
            saisieValide: () => false,
          },
          finalisationCreationCompteValidee(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        nouveauMotDePasse: 'un-mot-de-passe',
        motDePasseConfirme: 'un-autre-mot-de-passe',
        erreur: {
          motDePasse: {
            className: 'fr-input-group--error',
            texteExplicatif: (
              <TexteExplicatif
                id="motDePasseConfirme"
                texte="La confirmation de votre mot de passe ne correspond pas au mot de passe saisi."
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
            nouveauMotDePasse: 'mdp',
            erreur: {},
          },
          cguCliquees(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        nouveauMotDePasse: 'mdp',
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
            nouveauMotDePasse: 'mdp',
            erreur: {},
          },
          cguCliquees(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        nouveauMotDePasse: 'mdp',
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
            nouveauMotDePasse: 'mdp',
            erreur: {},
          },
          cguCliquees(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: false,
        nouveauMotDePasse: 'mdp',
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
        nouveauMotDePasse: '',
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
            nouveauMotDePasse: 'mdp',
            cguSignees: true,
          },
          finalisationCreationCompteTransmise(),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        nouveauMotDePasse: 'mdp',
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
            nouveauMotDePasse: 'mdp',
            motDePasseConfirme: 'mdp',
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
        nouveauMotDePasse: '',
        motDePasseConfirme: '',
        erreur: {},
        saisieValide: expect.any(Function),
        champsErreur: (
          <ChampsErreur erreur={new Error('Une erreur est survenue')} />
        ),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(false);
    });
  });

  describe("Lorsque l'on saisi le nouveau mot de passe", () => {
    it("prend en compte le nouveau mot de passe sans signifier d'erreur", () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            cguSignees: true,
            saisieValide: () => true,
          },
          nouveauMotDePasseSaisi('un-mot-de-passe'),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        nouveauMotDePasse: 'un-mot-de-passe',
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(false);
    });

    it('Si les CGU ne sont pas signées, la saisie est invalide sur la saisie du nouveau mot de passe', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            motDePasseConfirme: 'un-mot-de-passe',
            cguSignees: false,
            saisieValide: () => false,
          },
          nouveauMotDePasseSaisi('un-mot-de-passe'),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: false,
        nouveauMotDePasse: 'un-mot-de-passe',
        motDePasseConfirme: 'un-mot-de-passe',
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(false);
    });

    it('Si les CGU ne sont pas signées, la saisie est invalide sur la confirmation du nouveau mot de passe', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            nouveauMotDePasse: 'un-mot-de-passe',
            cguSignees: false,
            saisieValide: () => false,
          },
          nouveauMotDePasseConfirme('un-mot-de-passe'),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: false,
        nouveauMotDePasse: 'un-mot-de-passe',
        motDePasseConfirme: 'un-mot-de-passe',
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(false);
    });

    it("N'affiche plus d'erreur si la confirmation du mot de passe est valide", () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            nouveauMotDePasse: 'un-mot-de-passe',
            motDePasseConfirme: 'erreur-mdp',
            cguSignees: true,
            erreur: {
              motDePasse: {
                className: 'fr-input-group--error',
                texteExplicatif: <></>,
              },
            },
            saisieValide: () => false,
          },
          nouveauMotDePasseConfirme('un-mot-de-passe'),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        nouveauMotDePasse: 'un-mot-de-passe',
        motDePasseConfirme: 'un-mot-de-passe',
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(true);
    });

    it('sur la confirmation, valide la finalisation', () => {
      const etatFinalisationCreationCompte =
        reducteurFinalisationCreationCompte(
          {
            ...etatInitialFinalisationCreationCompte,
            cguSignees: true,
            nouveauMotDePasse: 'un-mot-de-passe',
            saisieValide: () => true,
          },
          nouveauMotDePasseConfirme('un-mot-de-passe'),
        );

      expect(
        etatFinalisationCreationCompte,
      ).toStrictEqual<EtatFinalisationCreationCompte>({
        cguSignees: true,
        nouveauMotDePasse: 'un-mot-de-passe',
        motDePasseConfirme: 'un-mot-de-passe',
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatFinalisationCreationCompte.saisieValide()).toBe(true);
    });
  });
});
