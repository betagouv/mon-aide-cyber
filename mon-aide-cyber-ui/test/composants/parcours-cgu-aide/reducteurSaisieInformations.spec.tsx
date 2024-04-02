import { beforeEach, describe, expect, it } from 'vitest';
import {
  adresseElectroniqueSaisie,
  cguValidees,
  demandeTerminee,
  departementSaisi,
  departementSelectionne,
  EtatSaisieInformations,
  initialiseEtatSaisieInformations,
  raisonSocialeSaisie,
  reducteurSaisieInformations,
} from '../../../src/composants/parcours-cgu-aide/reducteurSaisieInformations.tsx';
import { TexteExplicatif } from '../../../src/composants/alertes/Erreurs.tsx';

describe('Parcours CGU Aidé', () => {
  let etatInitial: EtatSaisieInformations = {} as EtatSaisieInformations;

  beforeEach(() => {
    etatInitial = initialiseEtatSaisieInformations([]);
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
          departements: [],
          departementsFiltres: [],
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
          departements: [],
          departementsFiltres: [],
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
          departements: [],
          departementsFiltres: [],
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
          departements: [],
          departementsFiltres: [],
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
            departements: [{ nom: 'Finistère', code: '29' }],
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
          departements: [{ nom: 'Finistère', code: '29' }],
          departementsFiltres: [{ nom: 'Finistère', code: '29' }],
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
          departementSaisi('Finistère'),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: 'Finistère',
          email: '',
          pretPourEnvoi: false,
          departements: [{ nom: 'Finistère', code: '29' }],
          departementsFiltres: [{ nom: 'Finistère', code: '29' }],
        });
      });

      it('Filtre les départements', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            departement: '',
            departements: [
              { nom: 'Finistère', code: '29' },
              { nom: 'Pyrénées-Atlantiques', code: '64' },
              { nom: 'Hautes-Pyrénées', code: '65' },
            ],
          },
          departementSaisi('pyr'),
        );

        expect(etat.departementsFiltres).toStrictEqual([
          { nom: 'Pyrénées-Atlantiques', code: '64' },
          { nom: 'Hautes-Pyrénées', code: '65' },
        ]);
      });

      it('Sélectionne le département', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            departement: '',
            departements: [
              { nom: 'Finistère', code: '29' },
              { nom: 'Pyrénées-Atlantiques', code: '64' },
              { nom: 'Hautes-Pyrénées', code: '65' },
            ],
            departementsFiltres: [
              { nom: 'Pyrénées-Atlantiques', code: '64' },
              { nom: 'Hautes-Pyrénées', code: '65' },
            ],
          },
          departementSelectionne('Pyrénées-Atlantiques'),
        );

        expect(etat.departementsFiltres).toStrictEqual([]);
        expect(etat.departement).toStrictEqual('Pyrénées-Atlantiques');
      });

      it('Filtre les départements par leur numéro', () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            departement: '',
            departements: [
              { nom: 'Finistère', code: '29' },
              { nom: 'Pyrénées-Atlantiques', code: '64' },
              { nom: 'Hautes-Pyrénées', code: '65' },
            ],
          },
          departementSaisi('29'),
        );

        expect(etat.departementsFiltres).toStrictEqual([
          { nom: 'Finistère', code: '29' },
        ]);
      });

      it('Supprime l’erreur liée au département lorsque l’utilisateur en sélectionne un', () => {
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
            departements: [{ nom: 'Finistère', code: '29' }],
          },
          departementSelectionne('Finistère'),
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
          departements: [{ nom: 'Finistère', code: '29' }],
          departementsFiltres: [],
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
          departements: [],
          departementsFiltres: [],
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
          departements: [],
          departementsFiltres: [],
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
          departements: [],
          departementsFiltres: [],
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
          departements: [],
          departementsFiltres: [],
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
          departements: [],
          departementsFiltres: [],
        });
      });
    });
  });

  describe('En ce qui concerne la validation des informations', () => {
    describe("Pour l'adresse électronique", () => {
      it("valide l'adresse électronique", () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'jean.dupont@mail.fr',
            cguValidees: true,
            departement: 'Finistère',
            departements: [{ nom: 'Finistère', code: '29' }],
          },
          demandeTerminee(),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: 'Finistère',
          email: 'jean.dupont@mail.fr',
          pretPourEnvoi: true,
          departements: [{ nom: 'Finistère', code: '29' }],
          departementsFiltres: [],
        });
      });

      it("invalide l'adresse électronique", () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'jean.dupont-incorrect',
            cguValidees: true,
            departement: 'Finistère',
            departements: [{ nom: 'Finistère', code: '29' }],
          },
          demandeTerminee(),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: 'Finistère',
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
          departementsFiltres: [],
        });
      });
    });

    describe('Pour le département', () => {
      it("S'assure que le département est présent", () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'jean.dupont@mail.fr',
            cguValidees: true,
            departement: '',
          },
          demandeTerminee(),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: '',
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
          departements: [],
          departementsFiltres: [],
        });
      });

      it("S'assure que le département existe", () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'jean.dupont@mail.fr',
            cguValidees: true,
            departement: 'département inconnu',
            departements: [
              { nom: 'Creuse', code: '23' },
              { nom: 'Morbihan', code: '56' },
            ],
          },
          demandeTerminee(),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: true,
          departement: 'département inconnu',
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
          departementsFiltres: [],
        });
      });
    });

    describe('Pour les CGU', () => {
      it("s'assure que les CGU sont signées", () => {
        const etat = reducteurSaisieInformations(
          {
            ...etatInitial,
            email: 'jean.dupont@mail.fr',
            cguValidees: false,
            departement: 'Finistère',
            departements: [{ nom: 'Finistère', code: '29' }],
          },
          demandeTerminee(),
        );

        expect(etat).toStrictEqual<EtatSaisieInformations>({
          cguValidees: false,
          departement: 'Finistère',
          email: 'jean.dupont@mail.fr',
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
          departements: [{ nom: 'Finistère', code: '29' }],
          departementsFiltres: [],
        });
      });
    });

    it("vide les erreurs lorsque les informations sont prêtes pour l'envoi", () => {
      const etat = reducteurSaisieInformations(
        {
          ...etatInitial,
          email: 'jean.dupont@mail.fr',
          cguValidees: true,
          erreur: {
            departement: {
              texteExplicatif: <>CGU pas validées</>,
              className: 'fr-input-group--error',
            },
            adresseElectronique: {
              texteExplicatif: <>Une erreur</>,
              className: 'fr-input-group--error',
            },
          },
          departement: 'Finistère',
          departements: [{ nom: 'Finistère', code: '29' }],
          pretPourEnvoi: false,
        },
        demandeTerminee(),
      );

      expect(etat).toStrictEqual<EtatSaisieInformations>({
        cguValidees: true,
        departement: 'Finistère',
        email: 'jean.dupont@mail.fr',
        pretPourEnvoi: true,
        departements: [{ nom: 'Finistère', code: '29' }],
        departementsFiltres: [],
      });
    });
  });
});
