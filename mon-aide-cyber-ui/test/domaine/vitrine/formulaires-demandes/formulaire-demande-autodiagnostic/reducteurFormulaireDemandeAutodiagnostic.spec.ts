import { beforeEach, describe, expect, it } from 'vitest';
import {
  adresseElectroniqueSaisie,
  EtatFormulaireDemandeAutodiagnostic,
  initialiseFormulaireDemandeAutodiagnostic,
  reducteurFormulaireDemandeAutodiagnostic,
} from '../../../../../src/domaine/vitrine/formulaires-demandes/auto-diagnostic/formulaire-demande-autodiagnostic/reducteurFormulaireDemandeAutodiagnostic';
import {
  cguCliquees,
  reducteurFormulaireSolliciterAidant,
} from '../../../../../src/domaine/vitrine/ecran-annuaire/ecran-aidant/reducteurFormulaireSolliciterAidant';

describe("Formulaire de demande d'autodiagnostic", () => {
  let etatInitial: EtatFormulaireDemandeAutodiagnostic =
    {} as EtatFormulaireDemandeAutodiagnostic;

  beforeEach(() => {
    etatInitial = initialiseFormulaireDemandeAutodiagnostic();
  });

  describe("L'adresse électronique est modifiée", () => {
    it('La prend en compte dans le formulaire', () => {
      const etat = reducteurFormulaireDemandeAutodiagnostic(
        etatInitial,
        adresseElectroniqueSaisie('jean.dupont@email.com')
      );

      expect(etat).toStrictEqual<EtatFormulaireDemandeAutodiagnostic>({
        cguValidees: false,
        email: 'jean.dupont@email.com',
        pretPourEnvoi: false,
      });
    });

    it('Saisie un mail invalide', () => {
      const etat = reducteurFormulaireDemandeAutodiagnostic(
        etatInitial,
        adresseElectroniqueSaisie('jean.dupont-mauvais-format')
      );

      expect(etat).toStrictEqual<EtatFormulaireDemandeAutodiagnostic>({
        cguValidees: false,
        email: 'jean.dupont-mauvais-format',
        pretPourEnvoi: false,
        erreurs: {
          adresseElectronique:
            'Veuillez saisir une adresse électronique valide.',
        },
      });
    });

    it('Corrige le mail', () => {
      const etat = reducteurFormulaireDemandeAutodiagnostic(
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

      expect(etat).toStrictEqual<EtatFormulaireDemandeAutodiagnostic>({
        cguValidees: false,
        email: 'jean.dupont@email.com',
        pretPourEnvoi: false,
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
        pretPourEnvoi: false,
        erreurs: {
          cguValidees: 'Veuillez valider les CGU.',
        },
      });
    });
  });
});
