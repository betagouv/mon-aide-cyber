import { describe, expect, it } from 'vitest';
import {
  cguCliquees,
  EtatDemande,
  initialiseFormulaire,
  pixelDeSuiviClique,
  reducteurDevenirAidant,
  saisieDepartement,
  saisieMail,
  saisieNom,
  saisiPrenom,
} from '../../../../src/domaine/gestion-demandes/devenir-aidant/formulaire-devenir-aidant/reducteurDevenirAidant';

describe('Formulaire devenir Aidant', () => {
  const etatInitial = initialiseFormulaire(undefined);

  describe('Lorsque une demande devenir Aidant est faite', () => {
    describe('En ce qui concerne la saisie du prénom', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDevenirAidant(
          etatInitial,
          saisiPrenom('Jean')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: 'Jean',
          nom: '',
          mail: '',
          departement: '',
          pretPourEnvoi: false,
          pixelDeSuiviAutorise: false,
        });
      });

      it('Vérifie la validité du formulaire', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            cguValidees: true,
            prenom: 'Jean',
            nom: 'DUPONT',
            mail: 'email',
            departement: { nom: 'Ain', code: '01' },
            pretPourEnvoi: true,
          },
          saisiPrenom('')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: true,
          prenom: '',
          nom: 'DUPONT',
          mail: 'email',
          departement: { nom: 'Ain', code: '01' },
          erreurs: {
            prenom: 'Veuillez saisir un prénom valide',
          },
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });

      it('Supprime l’erreur liée à la saisie du prénom lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            erreurs: {
              prenom: 'Erreur prénom',
            },
          },
          saisiPrenom('Jean')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: 'Jean',
          nom: '',
          mail: '',
          departement: '',
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });
    });

    describe('En ce qui concerne la saisie du nom', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDevenirAidant(
          etatInitial,
          saisieNom('Dujardin')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: '',
          nom: 'Dujardin',
          mail: '',
          departement: '',
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });

      it('Vérifie la validité du formulaire', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            cguValidees: true,
            prenom: 'Jean',
            nom: 'DUPONT',
            mail: 'email',
            departement: { nom: 'Ain', code: '01' },
            pretPourEnvoi: true,
          },
          saisieNom('')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: true,
          prenom: 'Jean',
          nom: '',
          mail: 'email',
          departement: { nom: 'Ain', code: '01' },
          erreurs: {
            nom: 'Veuillez saisir un nom valide',
          },
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });

      it('Supprime l’erreur liée à la saisie du nom lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            erreurs: {
              nom: 'Erreur nom',
            },
          },
          saisieNom('Dujardin')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: '',
          nom: 'Dujardin',
          mail: '',
          departement: '',
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });
    });

    describe('En ce qui concerne la saisie du mail', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDevenirAidant(
          etatInitial,
          saisieMail('email@email.com')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: '',
          nom: '',
          mail: 'email@email.com',
          departement: '',
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });

      it('Vérifie la validité du formulaire', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            cguValidees: true,
            prenom: 'Jean',
            nom: 'DUPONT',
            mail: 'email',
            departement: { nom: 'Ain', code: '01' },
            pretPourEnvoi: true,
          },
          saisieMail('')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: true,
          prenom: 'Jean',
          nom: 'DUPONT',
          mail: '',
          departement: { nom: 'Ain', code: '01' },
          erreurs: {
            mail: 'Veuillez saisir un mail valide',
          },
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });

      it('Supprime l’erreur liée à la saisie du mail lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            erreurs: {
              mail: 'Erreur mail',
            },
          },
          saisieMail('email@email.com')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: '',
          nom: '',
          mail: 'email@email.com',
          departement: '',
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });
    });

    describe('En ce qui concerne la saisie du département', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
          },
          saisieDepartement({ nom: 'Ain', code: '01' })
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: '',
          nom: '',
          mail: '',
          departement: { nom: 'Ain', code: '01' },
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });

      it('Vérifie la validité du formulaire', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            cguValidees: true,
            prenom: 'Jean',
            nom: 'DUPONT',
            mail: 'email',
            departement: { nom: 'Ain', code: '01' },
            pretPourEnvoi: true,
          },
          saisieDepartement('')
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: true,
          prenom: 'Jean',
          nom: 'DUPONT',
          mail: 'email',
          departement: '',
          erreurs: {
            departement: 'Veuillez sélectionner un département dans la liste',
          },
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });

      it('Supprime l’erreur liée à la saisie du département lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            erreurs: {
              departement: 'Erreur département',
            },
          },
          saisieDepartement({ nom: 'Ain', code: '01' })
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: '',
          nom: '',
          mail: '',
          departement: { nom: 'Ain', code: '01' },
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });
    });

    describe('En ce qui concerne la validation des CGU', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDevenirAidant(etatInitial, cguCliquees());

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: true,
          prenom: '',
          nom: '',
          mail: '',
          departement: '',
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });

      it('Vérifie la validité du formulaire', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            cguValidees: true,
            prenom: 'Jean',
            nom: 'DUPONT',
            mail: 'email',
            departement: { nom: 'Ain', code: '01' },
            pretPourEnvoi: true,
          },
          cguCliquees()
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: 'Jean',
          nom: 'DUPONT',
          mail: 'email',
          departement: { nom: 'Ain', code: '01' },
          erreurs: {
            cguValidees: 'Veuillez valider les CGU.',
          },
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });

      it('Supprime l’erreur liée aux CGU lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            erreurs: {
              cguValidees: 'Erreur CGU',
            },
          },
          cguCliquees()
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: true,
          prenom: '',
          nom: '',
          mail: '',
          departement: '',
          pixelDeSuiviAutorise: false,
          pretPourEnvoi: false,
        });
      });
    });

    describe('En ce qui concern le pixel de suivi', () => {
      it('Le suivi est autorisé', () => {
        const etatDemande = reducteurDevenirAidant(
          {
            ...etatInitial,
            cguValidees: true,
            prenom: 'Jean',
            nom: 'DUPONT',
            mail: 'email',
            departement: { nom: 'Ain', code: '01' },
            pretPourEnvoi: true,
          },
          pixelDeSuiviClique()
        );

        expect(etatDemande).toStrictEqual<EtatDemande>({
          cguValidees: true,
          pixelDeSuiviAutorise: true,
          prenom: 'Jean',
          nom: 'DUPONT',
          mail: 'email',
          departement: { nom: 'Ain', code: '01' },
          pretPourEnvoi: true,
        });
      });

      it('La saisie est invalide tant que les CGU ne sont pas validées', () => {
        const etatValidationCGU = reducteurDevenirAidant(
          {
            ...etatInitial,
            prenom: 'Jean',
            nom: 'DUPONT',
            mail: 'email',
            departement: { nom: 'Ain', code: '01' },
            cguValidees: false,
          },
          pixelDeSuiviClique()
        );

        expect(etatValidationCGU).toStrictEqual<EtatDemande>({
          cguValidees: false,
          prenom: 'Jean',
          nom: 'DUPONT',
          mail: 'email',
          departement: { nom: 'Ain', code: '01' },
          pixelDeSuiviAutorise: true,
          pretPourEnvoi: false,
        });
      });
    });
  });
});
