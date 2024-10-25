import { beforeEach, describe, expect, it } from 'vitest';
import {
  adresseElectroniqueSaisie,
  cguCliquees,
  EtatFormulaireSolliciterAidant,
  initialiseFormulaireSolliciterAidant,
  raisonSocialeSaisie,
  reducteurFormulaireSolliciterAidant,
} from '../../../../../../src/domaine/vitrine/ecran-annuaire/ecran-aidant/reducteurFormulaireSolliciterAidant';

describe("Formulaire de sollicitation d'un Aidant", () => {
  let etatInitial: EtatFormulaireSolliciterAidant =
    {} as EtatFormulaireSolliciterAidant;

  beforeEach(() => {
    etatInitial = initialiseFormulaireSolliciterAidant();
  });

  describe("L'adresse électronique est modifiée", () => {
    it('La prend en compte dans le formulaire', () => {
      const etat = reducteurFormulaireSolliciterAidant(
        etatInitial,
        adresseElectroniqueSaisie('jean.dupont@email.com')
      );

      expect(etat).toStrictEqual<EtatFormulaireSolliciterAidant>({
        cguValidees: false,
        email: 'jean.dupont@email.com',
        raisonSociale: '',
        pretPourEnvoi: false,
      });
    });

    it('Saisie un mail invalide', () => {
      const etat = reducteurFormulaireSolliciterAidant(
        etatInitial,
        adresseElectroniqueSaisie('jean.dupont-mauvais-format')
      );

      expect(etat).toStrictEqual<EtatFormulaireSolliciterAidant>({
        cguValidees: false,
        email: 'jean.dupont-mauvais-format',
        raisonSociale: '',
        pretPourEnvoi: false,
        erreurs: {
          adresseElectronique:
            'Veuillez saisir une adresse électronique valide.',
        },
      });
    });

    it('Corrige le mail', () => {
      const etat = reducteurFormulaireSolliciterAidant(
        {
          ...etatInitial,
          email: 'email-incorrect',
          erreurs: {
            adresseElectronique:
              'Veuillez saisir une adresse électronique valide.',
          },
        },
        adresseElectroniqueSaisie('jean.dupont@email.com')
      );

      expect(etat).toStrictEqual<EtatFormulaireSolliciterAidant>({
        cguValidees: false,
        email: 'jean.dupont@email.com',
        raisonSociale: '',
        pretPourEnvoi: false,
      });
    });

    it('Rend le formulaire valide', () => {
      const etat = reducteurFormulaireSolliciterAidant(
        {
          ...etatInitial,
          cguValidees: true,
        },
        adresseElectroniqueSaisie('jean.dupont@email.com')
      );

      expect(etat).toStrictEqual<EtatFormulaireSolliciterAidant>({
        cguValidees: true,
        email: 'jean.dupont@email.com',
        raisonSociale: '',
        pretPourEnvoi: true,
      });
    });
  });

  describe('Les CGUs sont modifiées', () => {
    it('Les prends en compte', () => {
      const etat = reducteurFormulaireSolliciterAidant(
        etatInitial,
        cguCliquees()
      );

      expect(etat).toStrictEqual({
        cguValidees: true,
        email: '',
        raisonSociale: '',
        pretPourEnvoi: false,
      });
    });

    it('Les invalides si déjà cochées auparavant', () => {
      const etat = reducteurFormulaireSolliciterAidant(
        { ...etatInitial, cguValidees: true },
        cguCliquees()
      );

      expect(etat).toStrictEqual({
        cguValidees: false,
        email: '',
        raisonSociale: '',
        pretPourEnvoi: false,
        erreurs: {
          cguValidees: 'Veuillez valider les CGU.',
        },
      });
    });
  });

  describe('La raison sociale est modifiée', () => {
    it('La prend en compte', () => {
      const etat = reducteurFormulaireSolliciterAidant(
        etatInitial,
        raisonSocialeSaisie('beta.gouv')
      );

      expect(etat).toStrictEqual<EtatFormulaireSolliciterAidant>({
        cguValidees: false,
        email: '',
        raisonSociale: 'beta.gouv',
        pretPourEnvoi: false,
      });
    });
  });
});
