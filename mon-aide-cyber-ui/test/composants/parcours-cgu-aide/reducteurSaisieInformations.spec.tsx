import { beforeEach, describe, expect, it } from 'vitest';
import {
  adresseElectroniqueSaisie,
  EtatSaisieInformations,
  initialiseEtatSaisieInformations,
  reducteurSaisieInformations,
} from '../../../src/composants/parcours-cgu-aide/reducteurSaisieInformations.tsx';

describe('Parcours CGU Aidé', () => {
  let etatInitial: EtatSaisieInformations = {} as EtatSaisieInformations;

  beforeEach(() => {
    etatInitial = initialiseEtatSaisieInformations();
  });

  describe('Lorsque l’Aidé fait une demande d’aide', () => {
    describe('En ce qui concerne l’adresse électronique', () => {
      it('La Prend en compte', () => {
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
  });
});
