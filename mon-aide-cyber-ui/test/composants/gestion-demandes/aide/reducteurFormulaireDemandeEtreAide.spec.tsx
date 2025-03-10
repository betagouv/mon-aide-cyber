import { beforeEach, describe, expect, it } from 'vitest';
import {
  adresseElectroniqueSaisie,
  cguValidees,
  departementSaisi,
  emailUtilisateurSaisi,
  EtatFormulaireDemandeEtreAide,
  initialiseEtatFormulaireDemandeEtreAide,
  raisonSocialeSaisie,
  reducteurFormulaireDemandeEtreAide,
  relationUtilisateurCliquee,
} from '../../../../src/composants/gestion-demandes/etre-aide/reducteurFormulaireDemandeEtreAide.tsx';

import { Departement } from '../../../../src/domaine/gestion-demandes/departement.ts';
import { TexteExplicatif } from '../../../../src/composants/alertes/Erreurs.tsx';

describe('Parcours CGU Aidé', () => {
  let etatInitial: EtatFormulaireDemandeEtreAide =
    {} as EtatFormulaireDemandeEtreAide;

  beforeEach(() => {
    etatInitial = initialiseEtatFormulaireDemandeEtreAide([]);
  });

  describe('Lorsque l’Aidé fait une demande d’aide', () => {
    describe('En ce qui concerne l’adresse électronique', () => {
      it('La renseigne', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          etatInitial,
          adresseElectroniqueSaisie('jean.dupont@email.com')
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: false,
          departement: {} as Departement,
          email: 'jean.dupont@email.com',
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: '',
        });
      });

      it('Supprime l’erreur liée à l’adresse électronique lorsque l’utilisateur la corrige', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
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
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: '',
        });
      });

      it('Vide les erreurs', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: false,
          departement: {} as Departement,
          email: 'jean.dupont@email.com',
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: '',
        });
      });

      it("valide l'adresse électronique", () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          {
            ...etatInitial,
            cguValidees: true,
            departement: { nom: 'Finistère', code: '29' },
            departements: [{ nom: 'Finistère', code: '29' }],
            valeurSaisieDepartement: 'Finistère',
          },
          adresseElectroniqueSaisie('jean.dupont@mail.fr')
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: true,
          departement: { nom: 'Finistère', code: '29' },
          email: 'jean.dupont@mail.fr',
          pretPourEnvoi: true,
          departements: [{ nom: 'Finistère', code: '29' }],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: 'Finistère',
        });
      });

      it("invalide l'adresse électronique", () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
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
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: 'Finistère',
        });
      });
    });

    describe('En ce qui concerne le département', () => {
      it('Le saisi', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          {
            ...etatInitial,
            departements: [
              { nom: 'Finistère', code: '29' },
              { nom: 'Gironde', code: '33' },
            ],
          },
          departementSaisi('Finistère')
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: false,
          departement: { nom: 'Finistère', code: '29' },
          email: '',
          pretPourEnvoi: false,
          departements: [
            { nom: 'Finistère', code: '29' },
            { nom: 'Gironde', code: '33' },
          ],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: 'Finistère',
        });
      });

      it('Supprime l’erreur liée au département lorsque l’utilisateur le corrige', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
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
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: 'Finistère',
        });
      });

      it('Vide les erreurs', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: false,
          departement: { nom: 'Finistère', code: '29' },
          email: '',
          pretPourEnvoi: false,
          departements: [{ nom: 'Finistère', code: '29' }],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: 'Finistère',
        });
      });

      it('Accepte la saisie de l’utilisateur si ce dernier donne le nom du département en minuscule', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: true,
          departement: { nom: 'Gironde', code: '33' },
          email: 'jean.dupont@mail.fr',
          pretPourEnvoi: true,
          departements: [
            { nom: 'Creuse', code: '23' },
            { nom: 'Morbihan', code: '56' },
            { nom: 'Gironde', code: '33' },
          ],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: 'Gironde',
        });
      });

      it("S'assure que le département existe", () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
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
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: 'département inconnu',
        });
      });

      it('Valide la saisie de l’utilisateur si ce dernier donne le numéro de département', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: true,
          departement: { nom: 'Gironde', code: '33' },
          email: 'jean.dupont@mail.fr',
          pretPourEnvoi: true,
          departements: [
            { nom: 'Creuse', code: '23' },
            { nom: 'Morbihan', code: '56' },
            { nom: 'Gironde', code: '33' },
          ],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: 'Gironde',
        });
      });
    });

    describe('En ce qui concerne la raison sociale', () => {
      it('La prend en compte', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          etatInitial,
          raisonSocialeSaisie('beta.gouv')
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: false,
          departement: {} as Departement,
          email: '',
          raisonSociale: 'beta.gouv',
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: '',
        });
      });
    });

    describe('En ce qui concerne les CGU', () => {
      it('Les prend en compte', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          etatInitial,
          cguValidees()
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: true,
          departement: {} as Departement,
          email: '',
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: '',
        });
      });

      it('invalide les CGU précédemment validées', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          { ...etatInitial, cguValidees: true },
          cguValidees()
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
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
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: '',
        });
      });

      it('Supprime l’erreur liée à la validation des CGU lorsque l’utilisateur le corrige', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
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
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: '',
        });
      });

      it('Vide les erreurs', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
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

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: true,
          departement: {} as Departement,
          email: '',
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: undefined,
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
          relationUtilisateurSaisie: undefined,
        };

        const etat = reducteurFormulaireDemandeEtreAide(
          { ...etatFormulaire },
          cguValidees()
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          departement: { nom: 'Finistère', code: '29' },
          email: 'jean.dupont@email.com',
          cguValidees: true,
          pretPourEnvoi: true,
          departements: [],
          relationUtilisateurSaisie: undefined,
          valeurSaisieDepartement: '',
        });
      });
    });

    describe("En ce qui concerne la relation avec l'utilisateur (Aidant / Utilisateur inscrit)", () => {
      it('La demande est en relation avec un utilisateur', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          etatInitial,
          relationUtilisateurCliquee(true)
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: false,
          departement: {} as Departement,
          email: '',
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: '',
          valeurSaisieDepartement: '',
        });
      });

      it('Fournit le mail de l’utilisateur', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          { ...etatInitial },
          emailUtilisateurSaisi('jean.dupont@email.com')
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: false,
          departement: {} as Departement,
          email: '',
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: 'jean.dupont@email.com',
          valeurSaisieDepartement: '',
        });
      });

      it('La demande n’est pas en relation avec un utilisateur', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          etatInitial,
          relationUtilisateurCliquee(false)
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: false,
          departement: {} as Departement,
          email: '',
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: 'Non',
          valeurSaisieDepartement: '',
        });
      });

      it('Valide le mail de l’utilisateur fourni', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          {
            ...etatInitial,
            cguValidees: true,
            departement: { nom: 'Gironde', code: '33' },
            email: 'jean.dujardin@beta-gouv.com',
          },
          emailUtilisateurSaisi('un-mauvais-mail')
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: true,
          departement: { nom: 'Gironde', code: '33' },
          email: 'jean.dujardin@beta-gouv.com',
          erreur: {
            relationUtilisateurSaisie: {
              texteExplicatif: (
                <TexteExplicatif
                  id="relation-utilisateur-saisie"
                  texte="Veuillez saisir un Email valide."
                />
              ),
              className: 'fr-input-group--error',
            },
          },
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: '',
          valeurSaisieDepartement: '',
        });
      });

      it('Vide les erreurs', () => {
        const etat = reducteurFormulaireDemandeEtreAide(
          {
            ...etatInitial,
            email: '',
            erreur: {
              relationUtilisateurSaisie: {
                texteExplicatif: <>CGU pas validées</>,
                className: 'fr-input-group--error',
              },
            },
          },
          emailUtilisateurSaisi('jean.dupont@email.com')
        );

        expect(etat).toStrictEqual<EtatFormulaireDemandeEtreAide>({
          cguValidees: false,
          departement: {} as Departement,
          email: '',
          pretPourEnvoi: false,
          departements: [],
          relationUtilisateurSaisie: 'jean.dupont@email.com',
          valeurSaisieDepartement: '',
        });
      });
    });
  });
});
