import { beforeEach, describe, expect, it } from 'vitest';
import {
  adresseElectroniqueSaisie,
  cguValidees,
  departementSaisi,
  EtatSaisieInformations,
  initialiseEtatSaisieInformations,
  raisonSocialeSaisie,
  reducteurSaisieInformations,
} from '../../../src/composants/parcours-cgu-aide/reducteurSaisieInformations.tsx';
import { TexteExplicatif } from '../../../src/composants/alertes/Erreurs.tsx';

describe('Parcours CGU Aidé', () => {
  let etatInitial: EtatSaisieInformations = {} as EtatSaisieInformations;

  beforeEach(() => {
    etatInitial = initialiseEtatSaisieInformations();
  });

  describe('Lorsque l’Aidé fait une demande d’aide', () => {
    describe('En ce qui concerne l’adresse électronique', () => {
      it('La prend en compte', () => {
        const etat = reducteurSaisieInformations(
          etatInitial,
          adresseElectroniqueSaisie('jean.dupont@email.com'),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: '',
          email: 'jean.dupont@email.com',
          pretPourEnvoi: false,
        });
      });

      it('Supprime l’erreur liée à l’adresse électronique lorsque l’utilisateur la corrige', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'email-incorrect',
            erreur: {
              cguValidees: {
                texteExplicatif: <>CGU pas validées</>,
                className: 'fr-input-group--error',
              },
              adresseElectronique: {
                texteExplicatif: <>Une erreur</>,
                className: 'fr-input-group--error',
              },
            },
          },
          adresseElectroniqueSaisie('jean.dupont@email.com'),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: '',
          email: 'jean.dupont@email.com',
          erreur: {
            cguValidees: {
              texteExplicatif: <>CGU pas validées</>,
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
        });
      });

      it('Vide les erreurs', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'email-incorrect',
            erreur: {
              adresseElectronique: {
                texteExplicatif: <>Une erreur</>,
                className: 'fr-input-group--error',
              },
            },
          },
          adresseElectroniqueSaisie('jean.dupont@email.com'),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: '',
          email: 'jean.dupont@email.com',
          pretPourEnvoi: false,
        });
      });
    });

    describe('En ce qui concerne le département', () => {
      it('Le prend en compte', () => {
        const etat = reducteurSaisieInformations(
          etatInitial,
          departementSaisi('Finistère'),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: 'Finistère',
          email: '',
          pretPourEnvoi: false,
        });
      });

      it('Supprime l’erreur liée au département lorsque l’utilisateur le corrige', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            departement: '',
            erreur: {
              cguValidees: {
                texteExplicatif: <>CGU pas validées</>,
                className: 'fr-input-group--error',
              },
              departement: {
                texteExplicatif: <>Veuillez saisir un département.</>,
                className: 'fr-input-group--error',
              },
            },
          },
          departementSaisi('Finistère'),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: 'Finistère',
          email: '',
          erreur: {
            cguValidees: {
              texteExplicatif: <>CGU pas validées</>,
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
        });
      });

      it('Vide les erreurs', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: '',
            erreur: {
              departement: {
                texteExplicatif: <>Veuillez saisir un département.</>,
                className: 'fr-input-group--error',
              },
            },
          },
          departementSaisi('Finistère'),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: 'Finistère',
          email: '',
          pretPourEnvoi: false,
        });
      });
    });

    describe('En ce qui concerne la raison sociale', () => {
      it('La prend en compte', () => {
        const etat = reducteurSaisieInformations(
          etatInitial,
          raisonSocialeSaisie('beta.gouv'),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: '',
          email: '',
          raisonSociale: 'beta.gouv',
          pretPourEnvoi: false,
        });
      });
    });

    describe('En ce qui concerne les CGU', () => {
      it('Les prend en compte', () => {
        const etat = reducteurSaisieInformations(etatInitial, cguValidees());

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: '',
          email: '',
          pretPourEnvoi: false,
        });
      });

      it('invalide les CGU précédemment validées', () => {
        const etat = reducteurSaisieInformations(
          { ...etatInitial, cguValidees: true },
          cguValidees(),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: '',
          email: '',
          erreur: {
            cguValidees: {
              texteExplicatif: (
                <TexteExplicatif
                  id="cguValidees"
                  texte="Veuillez valider les CGU."
                />
              ),
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
        });
      });

      it('Supprime l’erreur liée à la validation des CGU lorsque l’utilisateur le corrige', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            departement: '',
            erreur: {
              cguValidees: {
                texteExplicatif: <>CGU pas validées</>,
                className: 'fr-input-group--error',
              },
              departement: {
                texteExplicatif: <>Veuillez saisir un département.</>,
                className: 'fr-input-group--error',
              },
            },
          },
          cguValidees(),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: '',
          email: '',
          erreur: {
            departement: {
              texteExplicatif: <>Veuillez saisir un département.</>,
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
        });
      });

      it('Vide les erreurs', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: '',
            erreur: {
              cguValidees: {
                texteExplicatif: <>CGU pas validées</>,
                className: 'fr-input-group--error',
              },
            },
          },
          cguValidees(),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: '',
          email: '',
          pretPourEnvoi: false,
        });
      });
    });
  });
});
