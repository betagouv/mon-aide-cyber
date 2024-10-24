import { beforeEach, describe, expect, it } from 'vitest';
import {
  adresseElectroniqueSaisie,
  cguValidees,
  departementSaisi,
  EtatSaisieInformations,
  initialiseEtatSaisieInformations,
  raisonSocialeSaisie,
  reducteurSaisieInformations,
  relationAidantCliquee,
} from '../../../../src/composants/gestion-demandes/etre-aide/reducteurSaisieInformations.tsx';

import { Departement } from '../../../../src/domaine/gestion-demandes/departement.ts';
import { TexteExplicatif } from '../../../../src/composants/alertes/Erreurs.tsx';

describe('Parcours CGU Aidé', () => {
  let etatInitial: EtatSaisieInformations = {} as EtatSaisieInformations;

  beforeEach(() => {
    etatInitial = initialiseEtatSaisieInformations([]);
  });

  describe('Lorsque l’Aidé fait une demande d’aide', () => {
    describe('En ce qui concerne l’adresse électronique', () => {
      it('La renseigne', () => {
        const etat = reducteurSaisieInformations(
          etatInitial,
          adresseElectroniqueSaisie('jean.dupont@email.com')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: {} as Departement,
          email: 'jean.dupont@email.com',
          pretPourEnvoi: false,
          departements: [],
          relationAidantSaisie: false,
          valeurSaisieDepartement: '',
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
          adresseElectroniqueSaisie('jean.dupont@email.com')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: {} as Departement,
          email: 'jean.dupont@email.com',
          erreur: {
            cguValidees: {
              texteExplicatif: <>CGU pas validées</>,
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
          departements: [],
          relationAidantSaisie: false,
          valeurSaisieDepartement: '',
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
          adresseElectroniqueSaisie('jean.dupont@email.com')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: {} as Departement,
          email: 'jean.dupont@email.com',
          pretPourEnvoi: false,
          departements: [],
          relationAidantSaisie: false,
          valeurSaisieDepartement: '',
        });
      });

      it("valide l'adresse électronique", () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            cguValidees: true,
            departement: { nom: 'Finistère', code: '29' },
            departements: [{ nom: 'Finistère', code: '29' }],
            valeurSaisieDepartement: 'Finistère',
          },
          adresseElectroniqueSaisie('jean.dupont@mail.fr')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: { nom: 'Finistère', code: '29' },
          email: 'jean.dupont@mail.fr',
          pretPourEnvoi: true,
          departements: [{ nom: 'Finistère', code: '29' }],
          relationAidantSaisie: false,
          valeurSaisieDepartement: 'Finistère',
        });
      });

      it("invalide l'adresse électronique", () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'jean.dupont-incorrect',
            cguValidees: true,
            departement: { nom: 'Finistère', code: '29' },
            departements: [{ nom: 'Finistère', code: '29' }],
            valeurSaisieDepartement: 'Finistère',
          },
          adresseElectroniqueSaisie('jean.dupont-incorrect')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: { nom: 'Finistère', code: '29' },
          email: 'jean.dupont-incorrect',
          erreur: {
            adresseElectronique: {
              texteExplicatif: (
                <TexteExplicatif
                  id="adresse-electronique"
                  texte="Veuillez saisir une adresse électronique valide."
                />
              ),
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
          departements: [{ nom: 'Finistère', code: '29' }],
          relationAidantSaisie: false,
          valeurSaisieDepartement: 'Finistère',
        });
      });
    });

    describe('En ce qui concerne le département', () => {
      it('Le saisi', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            departements: [
              { nom: 'Finistère', code: '29' },
              { nom: 'Gironde', code: '33' },
            ],
          },
          departementSaisi('Finistère')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: { nom: 'Finistère', code: '29' },
          email: '',
          pretPourEnvoi: false,
          departements: [
            { nom: 'Finistère', code: '29' },
            { nom: 'Gironde', code: '33' },
          ],
          relationAidantSaisie: false,
          valeurSaisieDepartement: 'Finistère',
        });
      });

      it('Supprime l’erreur liée au département lorsque l’utilisateur le corrige', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            departement: {} as Departement,
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
            departements: [{ nom: 'Finistère', code: '29' }],
          },
          departementSaisi('Finistère')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: { nom: 'Finistère', code: '29' },
          email: '',
          erreur: {
            cguValidees: {
              texteExplicatif: <>CGU pas validées</>,
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
          departements: [{ nom: 'Finistère', code: '29' }],
          relationAidantSaisie: false,
          valeurSaisieDepartement: 'Finistère',
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
            departements: [{ nom: 'Finistère', code: '29' }],
          },
          departementSaisi('Finistère')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: { nom: 'Finistère', code: '29' },
          email: '',
          pretPourEnvoi: false,
          departements: [{ nom: 'Finistère', code: '29' }],
          relationAidantSaisie: false,
          valeurSaisieDepartement: 'Finistère',
        });
      });

      it('Accepte la saisie de l’utilisateur si ce dernier donne le nom du département en minuscule', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'jean.dupont@mail.fr',
            cguValidees: true,
            departements: [
              { nom: 'Creuse', code: '23' },
              { nom: 'Morbihan', code: '56' },
              { nom: 'Gironde', code: '33' },
            ],
          },
          departementSaisi('girOnde')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: { nom: 'Gironde', code: '33' },
          email: 'jean.dupont@mail.fr',
          pretPourEnvoi: true,
          departements: [
            { nom: 'Creuse', code: '23' },
            { nom: 'Morbihan', code: '56' },
            { nom: 'Gironde', code: '33' },
          ],
          relationAidantSaisie: false,
          valeurSaisieDepartement: 'Gironde',
        });
      });

      it("S'assure que le département existe", () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'jean.dupont@mail.fr',
            cguValidees: true,
            departements: [
              { nom: 'Creuse', code: '23' },
              { nom: 'Morbihan', code: '56' },
            ],
          },
          departementSaisi('département inconnu')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: {} as Departement,
          email: 'jean.dupont@mail.fr',
          erreur: {
            departement: {
              texteExplicatif: (
                <TexteExplicatif
                  id="departement"
                  texte="Veuillez saisir un département valide."
                />
              ),
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
          departements: [
            { nom: 'Creuse', code: '23' },
            { nom: 'Morbihan', code: '56' },
          ],
          relationAidantSaisie: false,
          valeurSaisieDepartement: 'département inconnu',
        });
      });

      it('Valide la saisie de l’utilisateur si ce dernier donne le numéro de département', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'jean.dupont@mail.fr',
            cguValidees: true,
            departement: {} as Departement,
            departements: [
              { nom: 'Creuse', code: '23' },
              { nom: 'Morbihan', code: '56' },
              { nom: 'Gironde', code: '33' },
            ],
            valeurSaisieDepartement: '33',
          },
          departementSaisi('33')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: { nom: 'Gironde', code: '33' },
          email: 'jean.dupont@mail.fr',
          pretPourEnvoi: true,
          departements: [
            { nom: 'Creuse', code: '23' },
            { nom: 'Morbihan', code: '56' },
            { nom: 'Gironde', code: '33' },
          ],
          relationAidantSaisie: false,
          valeurSaisieDepartement: 'Gironde',
        });
      });
    });

    describe('En ce qui concerne la raison sociale', () => {
      it('La prend en compte', () => {
        const etat = reducteurSaisieInformations(
          etatInitial,
          raisonSocialeSaisie('beta.gouv')
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: {} as Departement,
          email: '',
          raisonSociale: 'beta.gouv',
          pretPourEnvoi: false,
          departements: [],
          relationAidantSaisie: false,
          valeurSaisieDepartement: '',
        });
      });
    });

    describe('En ce qui concerne les CGU', () => {
      it('Les prend en compte', () => {
        const etat = reducteurSaisieInformations(etatInitial, cguValidees());

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: {} as Departement,
          email: '',
          pretPourEnvoi: false,
          departements: [],
          relationAidantSaisie: false,
          valeurSaisieDepartement: '',
        });
      });

      it('invalide les CGU précédemment validées', () => {
        const etat = reducteurSaisieInformations(
          { ...etatInitial, cguValidees: true },
          cguValidees()
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: {} as Departement,
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
          departements: [],
          relationAidantSaisie: false,
          valeurSaisieDepartement: '',
        });
      });

      it('Supprime l’erreur liée à la validation des CGU lorsque l’utilisateur le corrige', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            departement: {} as Departement,
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
          cguValidees()
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: {} as Departement,
          email: '',
          erreur: {
            departement: {
              texteExplicatif: <>Veuillez saisir un département.</>,
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
          departements: [],
          relationAidantSaisie: false,
          valeurSaisieDepartement: '',
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
          cguValidees()
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: {} as Departement,
          email: '',
          pretPourEnvoi: false,
          departements: [],
          relationAidantSaisie: false,
          valeurSaisieDepartement: '',
        });
      });

      it("Vérifie que le formulaire est OK à l'envoi", () => {
        const etatFormulaire = {
          ...etatInitial,
          departement: { nom: 'Finistère', code: '29' },
          email: 'jean.dupont@email.com',
          cguValidees: false,
          pretPourEnvoi: false,
          departements: [],
          relationAidantSaisie: false,
        };

        const etat = reducteurSaisieInformations(
          { ...etatFormulaire },
          cguValidees()
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          departement: { nom: 'Finistère', code: '29' },
          email: 'jean.dupont@email.com',
          cguValidees: true,
          pretPourEnvoi: true,
          departements: [],
          relationAidantSaisie: false,
          valeurSaisieDepartement: '',
        });
      });
    });

    describe("En ce qui concerne la relation avec l'Aidant", () => {
      it('La prend en compte', () => {
        const etat = reducteurSaisieInformations(
          etatInitial,
          relationAidantCliquee()
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: {} as Departement,
          email: '',
          pretPourEnvoi: false,
          departements: [],
          relationAidantSaisie: true,
          valeurSaisieDepartement: '',
        });
      });
    });
  });
});
