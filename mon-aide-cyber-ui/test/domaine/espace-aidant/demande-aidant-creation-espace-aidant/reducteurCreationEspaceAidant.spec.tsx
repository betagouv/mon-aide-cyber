import { describe, expect, it } from 'vitest';
import {
  ChampsErreur,
  TexteExplicatif,
} from '../../../../src/composants/alertes/Erreurs.tsx';
import {
  cguCliquees,
  creationEspaceAidantInvalidee,
  creationEspaceAidantTransmise,
  creationEspaceAidantValidee,
  EtatCreationEspaceAidant,
  initialiseReducteur,
  reducteurCreationEspaceAidant,
} from '../../../../src/domaine/espace-aidant/demande-aidant-creation-espace-aidant/reducteurCreationEspaceAidant.tsx';

describe("Réducteur de création de l'espace Aidant", () => {
  const etatInitialCreationEspaceAidant: EtatCreationEspaceAidant =
    initialiseReducteur();
  describe("Lors de la création de l'espace", () => {
    it('valide les CGU', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
        },
        creationEspaceAidantValidee({
          nouveauMotDePasse: 'mdp',
          confirmationNouveauMotDePasse: 'mdp',
          valide: true,
        })
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        motDePasse: {
          nouveauMotDePasse: 'mdp',
          confirmationNouveauMotDePasse: 'mdp',
          valide: true,
        },
        erreur: {},
        creationEspaceAidantATransmettre: true,
        saisieValide: expect.any(Function),
        demandeTransmise: false,
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
    });

    it('invalide les CGU si elles ne sont pas signées', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
        },
        creationEspaceAidantValidee({
          nouveauMotDePasse: 'mdp',
          confirmationNouveauMotDePasse: 'mdp',
          valide: true,
        })
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
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
        motDePasse: {
          nouveauMotDePasse: 'mdp',
          confirmationNouveauMotDePasse: 'mdp',
          valide: true,
        },
        saisieValide: expect.any(Function),
        demandeTransmise: false,
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });

    it("sur la confirmation, la saisie est invalide si le mot de passe n'est pas valide", () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
          saisieValide: () => false,
        },
        creationEspaceAidantValidee({
          nouveauMotDePasse: 'mot-de-passe',
          confirmationNouveauMotDePasse: 'mot-de-passe',
          valide: false,
        })
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        erreur: {},
        motDePasse: {
          nouveauMotDePasse: 'mot-de-passe',
          confirmationNouveauMotDePasse: 'mot-de-passe',
          valide: false,
        },
        demandeTransmise: false,
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
          motDePasse: {
            nouveauMotDePasse: 'mdp',
            confirmationNouveauMotDePasse: 'mdp',
            valide: true,
          },
          erreur: {},
        },
        cguCliquees()
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        erreur: {},
        motDePasse: {
          nouveauMotDePasse: 'mdp',
          confirmationNouveauMotDePasse: 'mdp',
          valide: true,
        },
        demandeTransmise: false,
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
    });

    it("Elles sont invalidées lorsque l'on reclique dessus", () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
          erreur: {},
        },
        cguCliquees()
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
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
        demandeTransmise: false,
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });

    it('Les erreurs précédentes sur les CGU sont vidées', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          erreur: {
            cguSignees: {
              className: 'fr-input-group--error',
              texteExplicatif: <></>,
            },
          },
          motDePasse: {
            nouveauMotDePasse: 'mdp',
            confirmationNouveauMotDePasse: 'mdp',
            valide: true,
          },
        },
        cguCliquees()
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        erreur: {},
        motDePasse: {
          nouveauMotDePasse: 'mdp',
          confirmationNouveauMotDePasse: 'mdp',
          valide: true,
        },
        demandeTransmise: false,
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(true);
    });

    it('Si les mots de passe sont incorrects, la saisie est invalide', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: false,
          motDePasse: {
            nouveauMotDePasse: 'mdp',
            confirmationNouveauMotDePasse: 'incorrect',
            valide: false,
          },
          saisieValide: () => false,
        },
        cguCliquees()
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        erreur: {},
        motDePasse: {
          nouveauMotDePasse: 'mdp',
          confirmationNouveauMotDePasse: 'incorrect',
          valide: false,
        },
        demandeTransmise: false,
        saisieValide: expect.any(Function),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });
  });

  describe("Lorsque la création de l'espace Aidant a été transmise", () => {
    it('Supprime la notion creation espace Aidant à transmettre et le mot de passe', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          creationEspaceAidantATransmettre: true,
          cguSignees: true,
          motDePasse: {
            nouveauMotDePasse: 'mdp',
            confirmationNouveauMotDePasse: 'mdp',
            valide: true,
          },
        },
        creationEspaceAidantTransmise()
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: true,
        erreur: {},
        saisieValide: expect.any(Function),
        demandeTransmise: true,
      });
    });
  });

  describe("Lorsque la création de l'espace Aidant a subi une erreur", () => {
    it('Marque la création comme invalide', () => {
      const etatCreationEspaceAidant = reducteurCreationEspaceAidant(
        {
          ...etatInitialCreationEspaceAidant,
          cguSignees: true,
          creationEspaceAidantATransmettre: true,
          motDePasse: {
            nouveauMotDePasse: 'mdp',
            confirmationNouveauMotDePasse: 'mdp',
            valide: true,
          },
          saisieValide: () => true,
        },
        creationEspaceAidantInvalidee(new Error('Une erreur est survenue'))
      );

      expect(etatCreationEspaceAidant).toStrictEqual<EtatCreationEspaceAidant>({
        cguSignees: false,
        erreur: {},
        saisieValide: expect.any(Function),
        demandeTransmise: false,
        champsErreur: (
          <ChampsErreur erreur={new Error('Une erreur est survenue')} />
        ),
      });
      expect(etatCreationEspaceAidant.saisieValide()).toBe(false);
    });
  });
});
