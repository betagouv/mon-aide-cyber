import { describe, expect, it } from 'vitest';

import { TexteExplicatif } from '../../../src/composants/alertes/Erreurs.tsx';
import {
  EtatCreationMotDePasse,
  initialiseReducteur,
  creationMotDePasseValidee,
  nouveauMotDePasseConfirme,
  nouveauMotDePasseSaisi,
  reducteurCreationMotDePasse,
  reinitialiseLeReducteur,
} from '../../../src/composants/mot-de-passe/reducteurCreationMotDePasse.tsx';

describe('Réducteur de création de mot de passe', () => {
  const messagesErreurs = {
    motsDePasseConfirmeDifferent:
      'La confirmation de votre mot de passe ne correspond pas au mot de passe saisi.',
    ancienMotDePasseIdentiqueAuNouveauMotDePasse:
      "Votre nouveau mot de passe doit être différent de l'ancien mot de passe.",
    motsDePasseVides: 'Vous devez saisir vos mots de passe.',
  };
  const etatInitialCreationMotDePasse: EtatCreationMotDePasse =
    initialiseReducteur(messagesErreurs);

  describe('Lorsque le formulaire contenant la création du mot de passe est confirmé', () => {
    it('Une erreur est montrée si les mots de passe ne correspondent pas', () => {
      const etatCreationMotDePasse = reducteurCreationMotDePasse(
        {
          ...etatInitialCreationMotDePasse,
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-autre-mot-de-passe',
          saisieValide: () => false,
        },
        creationMotDePasseValidee()
      );

      expect(etatCreationMotDePasse).toStrictEqual<EtatCreationMotDePasse>({
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
      expect(etatCreationMotDePasse.saisieValide()).toBe(false);
    });

    it('Une erreur est montrée si les mots de passe ne sont pas saisis', () => {
      const etatCreationMotDePasse = reducteurCreationMotDePasse(
        {
          ...etatInitialCreationMotDePasse,
          nouveauMotDePasse: '',
          motDePasseConfirme: '',
          saisieValide: () => false,
        },
        creationMotDePasseValidee()
      );

      expect(etatCreationMotDePasse).toStrictEqual<EtatCreationMotDePasse>({
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
      expect(etatCreationMotDePasse.saisieValide()).toBe(false);
    });
  });

  describe("Lorsque l'on saisi les champs de mot de passe", () => {
    describe('Pour le nouveau mot de passe', () => {
      it("Prend en compte le nouveau mot de passe sans signifier d'erreur", () => {
        const etatCreationMotDePasse = reducteurCreationMotDePasse(
          {
            ...etatInitialCreationMotDePasse,
            saisieValide: () => true,
          },
          nouveauMotDePasseSaisi('un-mot-de-passe')
        );

        expect(etatCreationMotDePasse).toStrictEqual<EtatCreationMotDePasse>({
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: '',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatCreationMotDePasse.saisieValide()).toBe(false);
      });

      it('Si le nouveau mot de passe et sa confirmation ne contiennent que des espaces, la saisie est invalide', () => {
        const etatCreationMotDePasse = reducteurCreationMotDePasse(
          {
            ...etatInitialCreationMotDePasse,
            motDePasseConfirme: '   ',
            saisieValide: () => false,
          },
          nouveauMotDePasseSaisi('   ')
        );

        expect(etatCreationMotDePasse).toStrictEqual<EtatCreationMotDePasse>({
          nouveauMotDePasse: '   ',
          motDePasseConfirme: '   ',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatCreationMotDePasse.saisieValide()).toBe(false);
      });
    });

    describe('Pour la confirmation du mot de passe', () => {
      it("N'affiche plus d'erreur si la confirmation du mot de passe est valide", () => {
        const etatCreationMotDePasse = reducteurCreationMotDePasse(
          {
            ...etatInitialCreationMotDePasse,
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
          nouveauMotDePasseConfirme('un-mot-de-passe')
        );

        expect(etatCreationMotDePasse).toStrictEqual<EtatCreationMotDePasse>({
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatCreationMotDePasse.saisieValide()).toBe(true);
      });

      it('Sur la confirmation, valide la création', () => {
        const etatCreationMotDePasse = reducteurCreationMotDePasse(
          {
            ...etatInitialCreationMotDePasse,
            nouveauMotDePasse: 'un-mot-de-passe',
            saisieValide: () => false,
          },
          nouveauMotDePasseConfirme('un-mot-de-passe')
        );

        expect(etatCreationMotDePasse).toStrictEqual<EtatCreationMotDePasse>({
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
          messagesErreurs,
        });
        expect(etatCreationMotDePasse.saisieValide()).toBe(true);
      });
    });
  });

  describe('Lors de la réinitialisation du formulaire', () => {
    it('Cela vide les mots de passe', () => {
      const etatCreationMotDePasse = reducteurCreationMotDePasse(
        {
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
        reinitialiseLeReducteur()
      );

      expect(etatCreationMotDePasse).toStrictEqual<EtatCreationMotDePasse>({
        nouveauMotDePasse: '',
        motDePasseConfirme: '',
        saisieValide: expect.any(Function),
        messagesErreurs,
      });
      expect(etatCreationMotDePasse.saisieValide()).toBe(false);
    });
  });
});
