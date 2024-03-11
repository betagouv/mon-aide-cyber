import { describe, expect, it } from 'vitest';
import {
  modificationMotDePasseValidee,
  EtatModificationMotDePasse,
  initialiseReducteur,
  ancienMotDePasseSaisi,
  nouveauMotDePasseConfirme,
  nouveauMotDePasseSaisi,
  reducteurModificationMotDePasse,
  reinitialiseLeReducteur,
} from '../../../src/composants/mot-de-passe/reducteurModificationMotDePasse.tsx';
import { TexteExplicatif } from '../../../src/composants/alertes/Erreurs.tsx';

describe('Réducteur de modification de mot de passe', () => {
  const messagesErreurs = {
    motsDePasseConfirmeDifferent:
      'La confirmation de votre mot de passe ne correspond pas au mot de passe saisi.',
    ancienMotDePasseIdentiqueAuNouveauMotDePasse:
      "Votre nouveau mot de passe doit être différent de l'ancien mot de passe.",
    motsDePasseVides: 'Vous devez saisir vos mots de passe.',
  };
  const etatInitialModificationMotDePasse: EtatModificationMotDePasse =
    initialiseReducteur(messagesErreurs);

  describe('Lorsque le formulaire contenant la modification du mot de passe est confirmé', () => {
    it('Une erreur est montrée si les mots de passe ne correspondent pas', () => {
      const etatModificationMotDePasse = reducteurModificationMotDePasse(
        {
          ...etatInitialModificationMotDePasse,
          ancienMotDePasse: 'ancien-mot-de-passe',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-autre-mot-de-passe',
          saisieValide: () => false,
        },
        modificationMotDePasseValidee(),
      );

      expect(
        etatModificationMotDePasse,
      ).toStrictEqual<EtatModificationMotDePasse>({
        ancienMotDePasse: 'ancien-mot-de-passe',
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
        messagesErreurs,
        saisieValide: expect.any(Function),
      });
      expect(etatModificationMotDePasse.saisieValide()).toBe(false);
    });

    it("Une erreur est montrée si l'ancien mot de passe est le même que le nouveau", () => {
      const etatModificationMotDePasse = reducteurModificationMotDePasse(
        {
          ...etatInitialModificationMotDePasse,
          ancienMotDePasse: 'mot-de-passe',
          nouveauMotDePasse: 'mot-de-passe',
          motDePasseConfirme: 'mot-de-passe',
          saisieValide: () => false,
        },
        modificationMotDePasseValidee(),
      );

      expect(
        etatModificationMotDePasse,
      ).toStrictEqual<EtatModificationMotDePasse>({
        ancienMotDePasse: 'mot-de-passe',
        nouveauMotDePasse: 'mot-de-passe',
        motDePasseConfirme: 'mot-de-passe',
        erreur: {
          motDePasse: {
            className: 'fr-input-group--error',
            texteExplicatif: (
              <TexteExplicatif
                id="nouveauMotDePasse"
                texte="Votre nouveau mot de passe doit être différent de l'ancien mot de passe."
              />
            ),
          },
        },
        saisieValide: expect.any(Function),
        messagesErreurs,
      });
      expect(etatModificationMotDePasse.saisieValide()).toBe(false);
    });

    it('Une erreur est montrée si les mots de passe ne sont pas saisis', () => {
      const etatModificationMotDePasse = reducteurModificationMotDePasse(
        {
          ...etatInitialModificationMotDePasse,
          ancienMotDePasse: '',
          nouveauMotDePasse: '',
          motDePasseConfirme: '',
          saisieValide: () => false,
        },
        modificationMotDePasseValidee(),
      );

      expect(
        etatModificationMotDePasse,
      ).toStrictEqual<EtatModificationMotDePasse>({
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        motDePasseConfirme: '',
        erreur: {
          motDePasse: {
            className: 'fr-input-group--error',
            texteExplicatif: (
              <TexteExplicatif
                id="nouveauMotDePasse"
                texte="Vous devez saisir vos mots de passe."
              />
            ),
          },
        },
        saisieValide: expect.any(Function),
        messagesErreurs,
      });
      expect(etatModificationMotDePasse.saisieValide()).toBe(false);
    });
  });

  describe("Lorsque l'on saisi les champs de mot de passe", () => {
    describe('Pour le nouveau mot de passe', () => {
      it("Prend en compte le nouveau mot de passe sans signifier d'erreur", () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            saisieValide: () => true,
          },
          nouveauMotDePasseSaisi('un-mot-de-passe'),
        );

        expect(
          etatModificationMotDePasse,
        ).toStrictEqual<EtatModificationMotDePasse>({
          ancienMotDePasse: '',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: '',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatModificationMotDePasse.saisieValide()).toBe(false);
      });

      it('Si le nouveau mot de passe et sa confirmation ne contiennent que des espaces, la saisie est invalide', () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            motDePasseConfirme: '   ',
            ancienMotDePasse: 'ancien-mot-de-passe',
            saisieValide: () => false,
          },
          nouveauMotDePasseSaisi('   '),
        );

        expect(
          etatModificationMotDePasse,
        ).toStrictEqual<EtatModificationMotDePasse>({
          ancienMotDePasse: 'ancien-mot-de-passe',
          nouveauMotDePasse: '   ',
          motDePasseConfirme: '   ',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatModificationMotDePasse.saisieValide()).toBe(false);
      });

      it("Si l'ancien mot de passe n'est pas saisi, la saisie est invalide", () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            motDePasseConfirme: 'mdp',
            ancienMotDePasse: ' ',
            saisieValide: () => false,
          },
          nouveauMotDePasseSaisi('mdp'),
        );

        expect(
          etatModificationMotDePasse,
        ).toStrictEqual<EtatModificationMotDePasse>({
          ancienMotDePasse: ' ',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatModificationMotDePasse.saisieValide()).toBe(false);
      });
    });

    describe("Pour la saisie de l'ancien mot de passe", () => {
      it('Si le nouveau mot de passe et sa confirmation ne correspondent pas, la saisie est invalide', () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            nouveauMotDePasse: 'un-mot-de-passe',
            motDePasseConfirme: 'mot-de-passe-qui-ne-correspond-pas',
            saisieValide: () => false,
          },
          ancienMotDePasseSaisi('ancien-mot-de-passe'),
        );

        expect(
          etatModificationMotDePasse,
        ).toStrictEqual<EtatModificationMotDePasse>({
          ancienMotDePasse: 'ancien-mot-de-passe',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'mot-de-passe-qui-ne-correspond-pas',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatModificationMotDePasse.saisieValide()).toBe(false);
      });

      it("Si l'ancien mot de passe est identique au nouveau mot de passe, la saisie est invalide", () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            nouveauMotDePasse: 'mot-de-passe',
            motDePasseConfirme: 'mot-de-passe',
            saisieValide: () => false,
          },
          ancienMotDePasseSaisi('mot-de-passe'),
        );

        expect(
          etatModificationMotDePasse,
        ).toStrictEqual<EtatModificationMotDePasse>({
          ancienMotDePasse: 'mot-de-passe',
          nouveauMotDePasse: 'mot-de-passe',
          motDePasseConfirme: 'mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatModificationMotDePasse.saisieValide()).toBe(false);
      });

      it('Si le nouveau mot de passe et sa confirmation ne contiennent que des espaces, la saisie est invalide', () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            nouveauMotDePasse: '   ',
            motDePasseConfirme: '   ',
            saisieValide: () => false,
          },
          ancienMotDePasseSaisi('ancien-mot-de-passe'),
        );

        expect(
          etatModificationMotDePasse,
        ).toStrictEqual<EtatModificationMotDePasse>({
          ancienMotDePasse: 'ancien-mot-de-passe',
          nouveauMotDePasse: '   ',
          motDePasseConfirme: '   ',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatModificationMotDePasse.saisieValide()).toBe(false);
      });

      it('La saisie est valide', () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            nouveauMotDePasse: 'un-mot-de-passe',
            motDePasseConfirme: 'un-mot-de-passe',
            saisieValide: () => false,
          },
          ancienMotDePasseSaisi('ancien-mot-de-passe'),
        );

        expect(etatModificationMotDePasse.saisieValide()).toBe(true);
      });
    });

    describe('Pour la confirmation du mot de passe', () => {
      it("N'affiche plus d'erreur si la confirmation du mot de passe est valide", () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            ancienMotDePasse: 'ancien-mot-de-passe',
            nouveauMotDePasse: 'un-mot-de-passe',
            motDePasseConfirme: 'erreur-mdp',
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
          etatModificationMotDePasse,
        ).toStrictEqual<EtatModificationMotDePasse>({
          ancienMotDePasse: 'ancien-mot-de-passe',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatModificationMotDePasse.saisieValide()).toBe(true);
      });

      it("Si l'ancien mot de passe n'est pas saisi, la saisie est invalide", () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            nouveauMotDePasse: 'mdp',
            ancienMotDePasse: ' ',
            saisieValide: () => false,
          },
          nouveauMotDePasseConfirme('mdp'),
        );

        expect(
          etatModificationMotDePasse,
        ).toStrictEqual<EtatModificationMotDePasse>({
          ancienMotDePasse: ' ',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatModificationMotDePasse.saisieValide()).toBe(false);
      });

      it('Sur la confirmation, valide la création', () => {
        const etatModificationMotDePasse = reducteurModificationMotDePasse(
          {
            ...etatInitialModificationMotDePasse,
            ancienMotDePasse: 'ancien-mot-de-passe',
            nouveauMotDePasse: 'un-mot-de-passe',
            saisieValide: () => false,
          },
          nouveauMotDePasseConfirme('un-mot-de-passe'),
        );

        expect(
          etatModificationMotDePasse,
        ).toStrictEqual<EtatModificationMotDePasse>({
          ancienMotDePasse: 'ancien-mot-de-passe',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatModificationMotDePasse.saisieValide()).toBe(true);
      });
    });
  });

  describe('Lors de la réinitialisation du formulaire', () => {
    it('Cela vide les mots de passe', () => {
      const etatModificationMotDePasse = reducteurModificationMotDePasse(
        {
          ancienMotDePasse: 'ancien-mot-de-passe',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {
            motDePasse: {
              className: 'fr-input-group--error',
              texteExplicatif: <></>,
            },
          },
          champsErreur: <></>,
          messagesErreurs,
          saisieValide: () => false,
        },
        reinitialiseLeReducteur(),
      );

      expect(
        etatModificationMotDePasse,
      ).toStrictEqual<EtatModificationMotDePasse>({
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        motDePasseConfirme: '',
        saisieValide: expect.any(Function),
        messagesErreurs,
      });
      expect(etatModificationMotDePasse.saisieValide()).toBe(false);
    });
  });
});
