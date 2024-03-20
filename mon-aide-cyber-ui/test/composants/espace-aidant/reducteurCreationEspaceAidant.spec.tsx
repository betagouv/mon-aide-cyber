import { describe, expect, it } from 'vitest';
import {
  motDePasseTemporaireSaisi,
  cguCliquees,
  EtatCreationEspaceAidant,
  creationEspaceAidantInvalidee,
  creationEspaceAidantTransmise,
  creationEspaceAidantValidee,
  initialiseReducteur,
  nouveauMotDePasseConfirme,
  nouveauMotDePasseSaisi,
  reducteurCreationEspaceAidant,
} from '../../../src/composants/espace-aidant/reducteurCreationEspaceAidant.tsx';
import { ChampsErreur, TexteExplicatif } from '../../../src/composants/erreurs/Erreurs.tsx';

describe("Réducteur de création de l'espace Aidant", () => {
  const etatInitialCreationEspaceAidant: EtatCreationEspaceAidant = initialiseReducteur();
  describe("Lors de la création de l'espace", () => {
    it('valide les CGU', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
          motDePasseTemporaire: 'mdp-temporaire',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
        },
        creationEspaceAidantValidee(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasseTemporaire: 'mdp-temporaire',
        nouveauMotDePasse: 'mdp',
        motDePasseConfirme: 'mdp',
        erreur: {},
        creationEspaceAidantATransmettre: true,
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
    });

    it('invalide les CGU si elles ne sont pas signées', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          motDePasseTemporaire: 'mdp-temporaire',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
        },
        creationEspaceAidantValidee(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: false,
        motDePasseTemporaire: 'mdp-temporaire',
        nouveauMotDePasse: 'mdp',
        motDePasseConfirme: 'mdp',
        erreur: {
          cguSignees: {
            className: 'fr-input-group--error',
            texteExplicatif: <TexteExplicatif id="cguSignees" texte="Veuillez accepter les CGU." />,
          },
        },
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });

    it('sur la confirmation, une erreur est montrée si les mots de passe ne correspondent pas', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-autre-mot-de-passe',
          saisieValide: () => false,
        },
        creationEspaceAidantValidee(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasseTemporaire: 'mot-de-passe-temporaire',
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
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });

    it('sur la confirmation, une erreur est montrée si le mot de passe temporaire est le même que le nouveau', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe',
          nouveauMotDePasse: 'mot-de-passe',
          motDePasseConfirme: 'mot-de-passe',
          saisieValide: () => false,
        },
        creationEspaceAidantValidee(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasseTemporaire: 'mot-de-passe',
        nouveauMotDePasse: 'mot-de-passe',
        motDePasseConfirme: 'mot-de-passe',
        erreur: {
          motDePasse: {
            className: 'fr-input-group--error',
            texteExplicatif: (
              <TexteExplicatif
                id="nouveauMotDePasse"
                texte="Votre nouveau mot de passe doit être différent du mot de passe temporaire."
              />
            ),
          },
        },
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });

    it('sur la confirmation, une erreur est montrée si les mots de passe ne sont pas saisis', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
          motDePasseTemporaire: '',
          nouveauMotDePasse: '',
          motDePasseConfirme: '',
          saisieValide: () => false,
        },
        creationEspaceAidantValidee(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasseTemporaire: '',
        nouveauMotDePasse: '',
        motDePasseConfirme: '',
        erreur: {
          motDePasse: {
            className: 'fr-input-group--error',
            texteExplicatif: <TexteExplicatif id="nouveauMotDePasse" texte="Vous devez saisir vos mots de passe." />,
          },
        },
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });
  });

  describe("Lorsque l'on clique sur la case à cocher des CGU", () => {
    it('Elles sont signées', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          erreur: {},
        },
        cguCliquees(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasseTemporaire: 'mot-de-passe-temporaire',
        nouveauMotDePasse: 'mdp',
        motDePasseConfirme: 'mdp',
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
    });

    it("La création de l'espace Aidant est validée", () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          erreur: {},
        },
        cguCliquees(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasseTemporaire: 'mot-de-passe-temporaire',
        nouveauMotDePasse: 'mdp',
        motDePasseConfirme: 'mdp',
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
    });

    it("Elles sont invalidées lorsque l'on reclique dessus", () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          erreur: {},
        },
        cguCliquees(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: false,
        motDePasseTemporaire: 'mot-de-passe-temporaire',
        nouveauMotDePasse: 'mdp',
        motDePasseConfirme: 'mdp',
        erreur: {
          cguSignees: {
            className: 'fr-input-group--error',
            texteExplicatif: <TexteExplicatif id="cguSignees" texte="Veuillez accepter les CGU." />,
          },
        },
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });

    it('Les erreurs précédentes sur les CGU sont vidées', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          erreur: {
            cguSignees: {
              className: 'fr-input-group--error',
              texteExplicatif: <></>,
            },
          },
        },
        cguCliquees(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasseTemporaire: 'mot-de-passe-temporaire',
        nouveauMotDePasse: 'mdp',
        motDePasseConfirme: 'mdp',
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
    });

    it('Si les mots de passe sont incorrects, la saisie est invalide', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          motDePasseConfirme: 'mdp',
          nouveauMotDePasse: 'mdp-autre',
          motDePasseTemporaire: ' ',
          cguSignees: false,
          saisieValide: () => false,
        },
        cguCliquees(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasseTemporaire: ' ',
        nouveauMotDePasse: 'mdp-autre',
        motDePasseConfirme: 'mdp',
        erreur: {},
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });
  });

  describe("Lorsque la création de l'espace Aidant a été transmise", () => {
    it('Supprime la notion creation espace Aidant à transmettre', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          creationEspaceAidantATransmettre: true,
          cguSignees: true,
        },
        creationEspaceAidantTransmise(),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasseTemporaire: 'mot-de-passe-temporaire',
        nouveauMotDePasse: 'mdp',
        motDePasseConfirme: 'mdp',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });
  });

  describe("Lorsque la création de l'espace Aidant a subi une erreur", () => {
    it('Marque la création comme invalide', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          creationEspaceAidantATransmettre: true,
          saisieValide: () => true,
        },
        creationEspaceAidantInvalidee(new Error('Une erreur est survenue')),
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: false,
        motDePasseTemporaire: '',
        nouveauMotDePasse: '',
        motDePasseConfirme: '',
        erreur: {},
        saisieValide: expect.any(Function),
        champsErreur: <ChampsErreur erreur={new Error('Une erreur est survenue')} />,
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });
  });

  describe("Lorsque l'on saisi les champs de mot de passe", () => {
    describe('Pour le nouveau mot de passe', () => {
      it("Prend en compte le nouveau mot de passe sans signifier d'erreur", () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            cguSignees: true,
            saisieValide: () => true,
          },
          nouveauMotDePasseSaisi('un-mot-de-passe'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: true,
          motDePasseTemporaire: '',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: '',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });

      it('Si les CGU ne sont pas signées, la saisie est invalide', () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            motDePasseTemporaire: 'mot-de-passe-temporaire',
            motDePasseConfirme: 'un-mot-de-passe',
            cguSignees: false,
            saisieValide: () => false,
          },
          nouveauMotDePasseSaisi('un-mot-de-passe'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: false,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });

      it('Si le nouveau mot de passe et sa confirmation ne contiennent que des espaces, la saisie est invalide', () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            motDePasseConfirme: '   ',
            motDePasseTemporaire: 'mot-de-passe-temporaire',
            cguSignees: true,
            saisieValide: () => false,
          },
          nouveauMotDePasseSaisi('   '),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: '   ',
          motDePasseConfirme: '   ',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });

      it("Si le mot de passe temporaire n'est pas saisi, la saisie est invalide", () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            motDePasseConfirme: 'mdp',
            motDePasseTemporaire: ' ',
            cguSignees: true,
            saisieValide: () => false,
          },
          nouveauMotDePasseSaisi('mdp'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: true,
          motDePasseTemporaire: ' ',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });
    });

    describe('Pour la saisie du mot de passe temporaire', () => {
      it('Si les CGU ne sont pas signées, la saisie est invalide', () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            nouveauMotDePasse: 'un-mot-de-passe',
            motDePasseConfirme: 'un-mot-de-passe',
            cguSignees: false,
            saisieValide: () => false,
          },
          motDePasseTemporaireSaisi('mot-de-passe-temporaire'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: false,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });

      it('Si le nouveau mot de passe et sa confirmation ne correspondent pas, la saisie est invalide', () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            nouveauMotDePasse: 'un-mot-de-passe',
            motDePasseConfirme: 'mot-de-passe-qui-ne-correspond-pas',
            cguSignees: true,
            saisieValide: () => false,
          },
          motDePasseTemporaireSaisi('mot-de-passe-temporaire'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'mot-de-passe-qui-ne-correspond-pas',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });

      it('Si le mot de passe temporaire est identique au nouveau mot de passe, la saisie est invalide', () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            nouveauMotDePasse: 'mot-de-passe',
            motDePasseConfirme: 'mot-de-passe',
            cguSignees: true,
            saisieValide: () => false,
          },
          motDePasseTemporaireSaisi('mot-de-passe'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe',
          nouveauMotDePasse: 'mot-de-passe',
          motDePasseConfirme: 'mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });

      it('Si le nouveau mot de passe et sa confirmation ne contiennent que des espaces, la saisie est invalide', () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            nouveauMotDePasse: '   ',
            motDePasseConfirme: '   ',
            cguSignees: true,
            saisieValide: () => false,
          },
          motDePasseTemporaireSaisi('mot-de-passe-temporaire'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: '   ',
          motDePasseConfirme: '   ',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });

      it('La saisie est valide', () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            nouveauMotDePasse: 'un-mot-de-passe',
            motDePasseConfirme: 'un-mot-de-passe',
            cguSignees: true,
            saisieValide: () => false,
          },
          motDePasseTemporaireSaisi('mot-de-passe-temporaire'),
        );

        expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
      });
    });

    describe('Pour la confirmation du mot de passe', () => {
      it('Si les CGU ne sont pas signées, la saisie est invalide', () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            motDePasseTemporaire: 'mot-de-passe-temporaire',
            nouveauMotDePasse: 'un-mot-de-passe',
            cguSignees: false,
            saisieValide: () => false,
          },
          nouveauMotDePasseConfirme('un-mot-de-passe'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: false,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });

      it("N'affiche plus d'erreur si la confirmation du mot de passe est valide", () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            motDePasseTemporaire: 'mot-de-passe-temporaire',
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

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
      });

      it("Si le mot de passe temporaire n'est pas saisi, la saisie est invalide", () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            nouveauMotDePasse: 'mdp',
            motDePasseTemporaire: ' ',
            cguSignees: true,
            saisieValide: () => false,
          },
          nouveauMotDePasseConfirme('mdp'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: true,
          motDePasseTemporaire: ' ',
          nouveauMotDePasse: 'mdp',
          motDePasseConfirme: 'mdp',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
      });

      it('Sur la confirmation, valide la création', () => {
        const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
          {
            ...etatInitialCreationEspaceAidant,
            cguSignees: true,
            motDePasseTemporaire: 'mot-de-passe-temporaire',
            nouveauMotDePasse: 'un-mot-de-passe',
            saisieValide: () => false,
          },
          nouveauMotDePasseConfirme('un-mot-de-passe'),
        );

        expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
          cguSignees: true,
          motDePasseTemporaire: 'mot-de-passe-temporaire',
          nouveauMotDePasse: 'un-mot-de-passe',
          motDePasseConfirme: 'un-mot-de-passe',
          erreur: {},
          saisieValide: expect.any(Function),
        });
        expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
      });
    });
  });
});
