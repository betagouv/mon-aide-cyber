import { describe, expect } from 'vitest';
import {
  cguValidees,
  confirmation,
  initialiseDemande,
  reducteurDemandeDevenirAidant,
  saisieDepartement,
  saisieMail,
  saisieNom,
  saisiPrenom,
  valideDemande,
} from '../../../../src/composants/gestion-demandes/devenir-aidant/reducteurDevenirAidant.tsx';
import { TexteExplicatif } from '../../../../src/composants/alertes/Erreurs.tsx';

describe('Parcours devenir Aidant', () => {
  const etatInitial = initialiseDemande();

  describe('Lorsque une demande devenir Aidant est faite', () => {
    describe('En ce qui concerne la saisie du prénom', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          etatInitial,
          saisiPrenom('Jean')
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: false,
          prenom: 'Jean',
          nom: '',
          mail: '',
          departementSaisi: '',
          departementsProposes: [],
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });

      it('Supprime l’erreur liée à la saisie du prénom lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          {
            ...etatInitial,
            erreurs: {
              prenom: {
                texteExplicatif: <>Erreur prénom</>,
                className: 'fr-input-group--error',
              },
            },
          },
          saisiPrenom('Jean')
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: false,
          prenom: 'Jean',
          nom: '',
          mail: '',
          departementSaisi: '',
          departementsProposes: [],
          erreurs: {},
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });
    });

    describe('En ce qui concerne la saisie du nom', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          etatInitial,
          saisieNom('Dujardin')
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: false,
          prenom: '',
          nom: 'Dujardin',
          mail: '',
          departementSaisi: '',
          departementsProposes: [],
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });

      it('Supprime l’erreur liée à la saisie du nom lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          {
            ...etatInitial,
            erreurs: {
              nom: {
                texteExplicatif: <>Erreur nom</>,
                className: 'fr-input-group--error',
              },
            },
          },
          saisieNom('Dujardin')
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: false,
          prenom: '',
          nom: 'Dujardin',
          mail: '',
          departementSaisi: '',
          departementsProposes: [],
          erreurs: {},
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });
    });

    describe('En ce qui concerne la saisie du mail', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          etatInitial,
          saisieMail('email@email.com')
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: false,
          prenom: '',
          nom: '',
          mail: 'email@email.com',
          departementSaisi: '',
          departementsProposes: [],
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });

      it('Supprime l’erreur liée à la saisie du mail lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          {
            ...etatInitial,
            erreurs: {
              mail: {
                texteExplicatif: <>Erreur mail</>,
                className: 'fr-input-group--error',
              },
            },
          },
          saisieMail('email@email.com')
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: false,
          prenom: '',
          nom: '',
          mail: 'email@email.com',
          departementSaisi: '',
          departementsProposes: [],
          erreurs: {},
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });
    });

    describe('En ce qui concerne la saisie du département', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          {
            ...etatInitial,
            departementsProposes: [{ nom: 'Ain', code: '01' }],
          },
          saisieDepartement({ nom: 'Ain', code: '01' })
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: false,
          prenom: '',
          nom: '',
          mail: '',
          departementSaisi: { nom: 'Ain', code: '01' },
          departementsProposes: [{ nom: 'Ain', code: '01' }],
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });

      it('Supprime l’erreur liée à la saisie du département lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          {
            ...etatInitial,
            departementsProposes: [{ nom: 'Ain', code: '01' }],
            erreurs: {
              departement: {
                texteExplicatif: <>Erreur mail</>,
                className: 'fr-input-group--error',
              },
            },
          },
          saisieDepartement({ nom: 'Ain', code: '01' })
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: false,
          prenom: '',
          nom: '',
          mail: '',
          departementSaisi: { nom: 'Ain', code: '01' },
          departementsProposes: [{ nom: 'Ain', code: '01' }],
          erreurs: {},
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });
    });

    describe('En ce qui concerne la validation des CGU', () => {
      it('La prend en compte', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          etatInitial,
          cguValidees()
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: true,
          prenom: '',
          nom: '',
          mail: '',
          departementSaisi: '',
          departementsProposes: [],
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });

      it('Supprime l’erreur liée aux CGU lorsque l’utilisateur la corrige', () => {
        const etatDemande = reducteurDemandeDevenirAidant(
          {
            ...etatInitial,
            erreurs: {
              cguValidees: {
                texteExplicatif: <>Erreur CGU</>,
                className: 'fr-input-group--error',
              },
            },
          },
          cguValidees()
        );

        expect(etatDemande).toStrictEqual({
          cguValidees: true,
          prenom: '',
          nom: '',
          mail: '',
          departementSaisi: '',
          departementsProposes: [],
          erreurs: {},
          pretPourEnvoi: false,
          envoiReussi: false,
        });
      });
    });
  });

  describe('En ce qui concerne la validation de la demande', () => {
    it('Valide la demande', () => {
      const etatDemande = reducteurDemandeDevenirAidant(
        {
          ...etatInitial,
          cguValidees: true,
          prenom: 'Jean',
          nom: 'Dujardin',
          departementsProposes: [{ nom: 'Ain', code: '01' }],
          departementSaisi: { nom: 'Ain', code: '01' },
          mail: 'email@email.com',
        },
        valideDemande()
      );

      expect(etatDemande).toStrictEqual({
        cguValidees: true,
        prenom: 'Jean',
        nom: 'Dujardin',
        mail: 'email@email.com',
        departementSaisi: { nom: 'Ain', code: '01' },
        departementsProposes: [{ nom: 'Ain', code: '01' }],
        pretPourEnvoi: true,
        envoiReussi: false,
      });
    });

    it('Invalide l’adresse électronique', () => {
      const etatDemande = reducteurDemandeDevenirAidant(
        {
          ...etatInitial,
          cguValidees: true,
          prenom: 'Jean',
          nom: 'Dujardin',
          departementsProposes: [{ nom: 'Ain', code: '01' }],
          departementSaisi: { nom: 'Ain', code: '01' },
          mail: 'email-invalide.com',
        },
        valideDemande()
      );

      expect(etatDemande).toStrictEqual({
        cguValidees: true,
        prenom: 'Jean',
        nom: 'Dujardin',
        mail: 'email-invalide.com',
        departementSaisi: { nom: 'Ain', code: '01' },
        departementsProposes: [{ nom: 'Ain', code: '01' }],
        erreurs: {
          mail: {
            texteExplicatif: (
              <TexteExplicatif
                id="mail"
                texte="Veuillez saisir un mail valide"
              />
            ),
            className: 'fr-input-group--error',
          },
        },
        pretPourEnvoi: false,
        envoiReussi: false,
      });
    });

    it('Invalide le département', () => {
      const etatDemande = reducteurDemandeDevenirAidant(
        {
          ...etatInitial,
          cguValidees: true,
          prenom: 'Jean',
          nom: 'Dujardin',
          departementsProposes: [{ nom: 'Ain', code: '01' }],
          departementSaisi: 'inconnu',
          mail: 'email@email.com',
        },
        valideDemande()
      );

      expect(etatDemande).toStrictEqual({
        cguValidees: true,
        prenom: 'Jean',
        nom: 'Dujardin',
        mail: 'email@email.com',
        departementSaisi: 'inconnu',
        departementsProposes: [{ nom: 'Ain', code: '01' }],
        erreurs: {
          departement: {
            texteExplicatif: (
              <TexteExplicatif
                id="departement"
                texte="Veuillez sélectionner un département dans la liste"
              />
            ),
            className: 'fr-input-group--error',
          },
        },
        pretPourEnvoi: false,
        envoiReussi: false,
      });
    });
  });

  describe('Lorsque la demande est envoyée', () => {
    it('Repositionne l’attribut prePourEnvoi à false', () => {
      const etatDemande = reducteurDemandeDevenirAidant(
        {
          ...etatInitial,
          cguValidees: true,
          prenom: 'Jean',
          nom: 'Dujardin',
          departementsProposes: [{ nom: 'Ain', code: '01' }],
          departementSaisi: { nom: 'Ain', code: '01' },
          mail: 'email@email.com',
          pretPourEnvoi: true,
        },
        confirmation()
      );

      expect(etatDemande).toStrictEqual({
        cguValidees: true,
        prenom: 'Jean',
        nom: 'Dujardin',
        mail: 'email@email.com',
        departementSaisi: { nom: 'Ain', code: '01' },
        departementsProposes: [{ nom: 'Ain', code: '01' }],
        pretPourEnvoi: false,
        envoiReussi: true,
      });
    });
  });
});
