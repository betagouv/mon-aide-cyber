import { describe, expect, it } from 'vitest';
import {
  authentificationInvalidee,
  identifiantSaisi,
  initialiseReducteur,
  motDePasseSaisi,
  reducteurAuthentification,
  saisieInvalidee,
} from '../../../src/composants/authentification/reducteurAuthentification';
import {
  ChampsErreur,
  TexteExplicatif,
} from '../../../src/composants/alertes/Erreurs.tsx';

describe('Réducteur authentification', () => {
  describe("Lorsque l'authentification est invalidée", () => {
    it("affiche le champs d'erreur", () => {
      const etatAuthentification = reducteurAuthentification(
        initialiseReducteur(),
        authentificationInvalidee(new Error('Identifiants incorrects')),
      );

      expect(etatAuthentification.identifiant).toBe('');
      expect(etatAuthentification.motDePasse).toBe('');
      expect(etatAuthentification.champsErreur).toStrictEqual(
        <ChampsErreur erreur={new Error('Identifiants incorrects')} />,
      );
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toStrictEqual({
        identifiant: {
          texteExplicatif: (
            <TexteExplicatif
              id="identifiant-connexion"
              texte="Veuillez saisir votre identifiant de connexion."
            />
          ),
          className: 'fr-input-group--error',
        },
        motDePasse: {
          texteExplicatif: (
            <TexteExplicatif
              id="mot-de-passe"
              texte="Veuillez saisir votre mot de passe."
            />
          ),
          className: 'fr-input-group--error',
        },
      });
    });
  });

  describe("Dans le cadre de la saisie de l'identifiant", () => {
    it("l'identifiant est validé", () => {
      const etatAuthentification = reducteurAuthentification(
        initialiseReducteur(),
        identifiantSaisi('identifiant'),
      );

      expect(etatAuthentification.identifiant).toBe('identifiant');
      expect(etatAuthentification.motDePasse).toBe('');
      expect(etatAuthentification.champsErreur).toStrictEqual(<></>);
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toBeUndefined();
    });

    it("l'identifiant est invalidé", () => {
      const etatAuthentification = reducteurAuthentification(
        initialiseReducteur(),
        identifiantSaisi(''),
      );

      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toStrictEqual({
        identifiant: {
          texteExplicatif: (
            <TexteExplicatif
              id="identifiant-connexion"
              texte="Veuillez saisir votre identifiant de connexion."
            />
          ),
          className: 'fr-input-group--error',
        },
      });
    });

    it("l'identifiant est validé lorsque l'utilisateur corrige sa saisie", () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: '',
          motDePasse: '',
          saisieValide: () => false,
          erreur: {
            identifiant: {
              texteExplicatif: (
                <TexteExplicatif
                  id="identifiant-connexion"
                  texte="Veuillez saisir votre identifiant de connexion."
                />
              ),
              className: 'fr-input-group--error',
            },
          },
        },
        identifiantSaisi('nouvelle-saisie'),
      );

      expect(etatAuthentification.identifiant).toBe('nouvelle-saisie');
      expect(etatAuthentification.motDePasse).toBe('');
      expect(etatAuthentification.champsErreur).toStrictEqual(<></>);
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toBeUndefined();
    });

    it("l'identifiant est validé même avec un mot de passe invalide", () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: '',
          motDePasse: '',
          saisieValide: () => false,
          erreur: {
            motDePasse: {
              texteExplicatif: (
                <TexteExplicatif
                  id="mot-de-passe"
                  texte="Veuillez saisir votre mot de passe."
                />
              ),
              className: 'fr-input-group--error',
            },
            identifiant: {
              texteExplicatif: (
                <TexteExplicatif
                  id="identifiant-connexion"
                  texte="Veuillez saisir votre identifiant de connexion."
                />
              ),
              className: 'fr-input-group--error',
            },
          },
        },
        identifiantSaisi('nouvelle-saisie'),
      );

      expect(etatAuthentification.identifiant).toBe('nouvelle-saisie');
      expect(etatAuthentification.motDePasse).toBe('');
      expect(etatAuthentification.champsErreur).toStrictEqual(<></>);
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toStrictEqual({
        motDePasse: {
          texteExplicatif: (
            <TexteExplicatif
              id="mot-de-passe"
              texte="Veuillez saisir votre mot de passe."
            />
          ),
          className: 'fr-input-group--error',
        },
      });
    });

    it("la saisie est valide lorsque l'identifiant et le mot de passe sont saisis", () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: '',
          motDePasse: 'mdp',
          saisieValide: () => false,
        },
        identifiantSaisi('nouvelle-saisie'),
      );

      expect(etatAuthentification.saisieValide()).toBe(true);
    });

    it("la saisie du mot de passe reste invalide si on vide l'identifiant", () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: 'un-identifiant',
          motDePasse: '',
          saisieValide: () => false,
          erreur: {
            motDePasse: {
              texteExplicatif: (
                <TexteExplicatif
                  id="mot-de-passe"
                  texte="Veuillez saisir votre mot de passe."
                />
              ),
              className: 'fr-input-group--error',
            },
          },
        },
        identifiantSaisi(''),
      );

      expect(etatAuthentification.erreur).toStrictEqual({
        identifiant: {
          texteExplicatif: (
            <TexteExplicatif
              id="identifiant-connexion"
              texte="Veuillez saisir votre identifiant de connexion."
            />
          ),
          className: 'fr-input-group--error',
        },
        motDePasse: {
          texteExplicatif: (
            <TexteExplicatif
              id="mot-de-passe"
              texte="Veuillez saisir votre mot de passe."
            />
          ),
          className: 'fr-input-group--error',
        },
      });
    });
  });

  describe('Dans le cadre de la saisie du mot de passe', () => {
    it('le mot de passe est validé', () => {
      const etatAuthentification = reducteurAuthentification(
        initialiseReducteur(),
        motDePasseSaisi('mdp'),
      );

      expect(etatAuthentification.identifiant).toBe('');
      expect(etatAuthentification.motDePasse).toBe('mdp');
      expect(etatAuthentification.champsErreur).toStrictEqual(<></>);
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toBeUndefined();
    });

    it('le mot de passe est invalidé', () => {
      const etatAuthentification = reducteurAuthentification(
        initialiseReducteur(),
        motDePasseSaisi(''),
      );

      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toStrictEqual({
        motDePasse: {
          texteExplicatif: (
            <TexteExplicatif
              id="mot-de-passe"
              texte="Veuillez saisir votre mot de passe."
            />
          ),
          className: 'fr-input-group--error',
        },
      });
    });

    it("le mot de passe est validé lorsque l'utilisateur corrige sa saisie", () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: '',
          motDePasse: '',
          saisieValide: () => false,
          erreur: {
            motDePasse: {
              texteExplicatif: (
                <TexteExplicatif
                  id="mot-de-passe"
                  texte="Veuillez saisir votre mot de passe."
                />
              ),
              className: 'fr-input-group--error',
            },
          },
        },
        motDePasseSaisi('nouvelle-saisie'),
      );

      expect(etatAuthentification.identifiant).toBe('');
      expect(etatAuthentification.motDePasse).toBe('nouvelle-saisie');
      expect(etatAuthentification.champsErreur).toStrictEqual(<></>);
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toBeUndefined();
    });

    it('le mot de passe est validé même avec un identifiant invalide', () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: '',
          motDePasse: '',
          saisieValide: () => false,
          erreur: {
            motDePasse: {
              texteExplicatif: (
                <TexteExplicatif
                  id="mot-de-passe"
                  texte="Veuillez saisir votre mot de passe."
                />
              ),
              className: 'fr-input-group--error',
            },
            identifiant: {
              texteExplicatif: (
                <TexteExplicatif
                  id="identifiant-connexion"
                  texte="Veuillez saisir votre identifiant de connexion."
                />
              ),
              className: 'fr-input-group--error',
            },
          },
        },
        motDePasseSaisi('nouvelle-saisie'),
      );

      expect(etatAuthentification.identifiant).toBe('');
      expect(etatAuthentification.motDePasse).toBe('nouvelle-saisie');
      expect(etatAuthentification.champsErreur).toStrictEqual(<></>);
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toStrictEqual({
        identifiant: {
          texteExplicatif: (
            <TexteExplicatif
              id="identifiant-connexion"
              texte="Veuillez saisir votre identifiant de connexion."
            />
          ),
          className: 'fr-input-group--error',
        },
      });
    });

    it("la saisie est valide lorsque l'identifiant et le mot de passe sont saisis", () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: 'identifiant',
          motDePasse: '',
          saisieValide: () => false,
        },
        motDePasseSaisi('nouvelle-saisie'),
      );

      expect(etatAuthentification.saisieValide()).toBe(true);
    });
  });

  describe('Dans le cadre de la saisie invalidée', () => {
    it("l'identifiant et le mot de passe sont invalidés", () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: '',
          motDePasse: '',
          saisieValide: () => false,
        },
        saisieInvalidee(),
      );

      expect(etatAuthentification.identifiant).toBe('');
      expect(etatAuthentification.motDePasse).toBe('');
      expect(etatAuthentification.champsErreur).toStrictEqual(<></>);
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toStrictEqual({
        identifiant: {
          texteExplicatif: (
            <TexteExplicatif
              id="identifiant-connexion"
              texte="Veuillez saisir votre identifiant de connexion."
            />
          ),
          className: 'fr-input-group--error',
        },
        motDePasse: {
          texteExplicatif: (
            <TexteExplicatif
              id="mot-de-passe"
              texte="Veuillez saisir votre mot de passe."
            />
          ),
          className: 'fr-input-group--error',
        },
      });
    });

    it("seul l'identifiant est invalidé", () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: '',
          motDePasse: 'mdp',
          saisieValide: () => false,
        },
        saisieInvalidee(),
      );

      expect(etatAuthentification.identifiant).toBe('');
      expect(etatAuthentification.motDePasse).toBe('mdp');
      expect(etatAuthentification.champsErreur).toStrictEqual(<></>);
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toStrictEqual({
        identifiant: {
          texteExplicatif: (
            <TexteExplicatif
              id="identifiant-connexion"
              texte="Veuillez saisir votre identifiant de connexion."
            />
          ),
          className: 'fr-input-group--error',
        },
      });
    });

    it('seul le mot de passe est invalidé', () => {
      const etatAuthentification = reducteurAuthentification(
        {
          champsErreur: <></>,
          identifiant: 'identifiant',
          motDePasse: '',
          saisieValide: () => false,
        },
        saisieInvalidee(),
      );

      expect(etatAuthentification.identifiant).toBe('identifiant');
      expect(etatAuthentification.motDePasse).toBe('');
      expect(etatAuthentification.champsErreur).toStrictEqual(<></>);
      expect(etatAuthentification.saisieValide()).toBeFalsy();
      expect(etatAuthentification.erreur).toStrictEqual({
        motDePasse: {
          texteExplicatif: (
            <TexteExplicatif
              id="mot-de-passe"
              texte="Veuillez saisir votre mot de passe."
            />
          ),
          className: 'fr-input-group--error',
        },
      });
    });
  });
});
