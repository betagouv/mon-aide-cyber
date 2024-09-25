import {
  cochePreference,
  cocheToutesLesPreferences,
  decocheToutesLesPreferences,
  initialiseFormulairePreferences,
  reducteurPreferences,
} from './../../../../../../src/domaine/espace-aidant/mon-compte/ecran-mes-preferences/composants/reducteurPreferences';
import { describe, expect } from 'vitest';

describe("Formulaire de changement des préférences de l'aidant", () => {
  const etatInitial = initialiseFormulairePreferences();

  describe("Lorsque l'on change les préférences", () => {
    describe("Pour les types d'entité", () => {
      it('Coche', () => {
        const etatFormulaire = reducteurPreferences(
          etatInitial,
          cochePreference('Agriculture', 'TYPE_ENTITE')
        );

        expect(etatFormulaire).toStrictEqual({
          ...etatInitial,
          preferencesChangees: {
            typesEntites: true,
            secteursActivite: false,
            departements: false,
          },
          preferences: {
            ...etatInitial.preferences,
            preferencesAidant: {
              ...etatInitial.preferences.preferencesAidant,
              typesEntites: ['Agriculture'],
            },
          },
        });
      });

      it('Décoche', () => {
        const etatFormulaireInitial = {
          ...etatInitial,
          valeursInitiales: {
            ...etatInitial.valeursInitiales,
            typesEntites: ['Agriculture', 'Bourse', 'Informatique'],
          },
          preferences: {
            ...etatInitial.preferences,
            preferencesAidant: {
              ...etatInitial.preferences.preferencesAidant,
              typesEntites: ['Agriculture', 'Bourse', 'Informatique'],
            },
          },
        };
        const etatFormulaire = reducteurPreferences(
          etatFormulaireInitial,
          cochePreference('Agriculture', 'TYPE_ENTITE')
        );

        expect(etatFormulaire).toStrictEqual({
          ...etatFormulaireInitial,
          preferencesChangees: {
            typesEntites: true,
            secteursActivite: false,
            departements: false,
          },
          preferences: {
            ...etatFormulaireInitial.preferences,
            preferencesAidant: {
              ...etatFormulaireInitial.preferences.preferencesAidant,
              typesEntites: ['Bourse', 'Informatique'],
            },
          },
        });
      });

      it('Coche pour retour etat initial', () => {
        const etatFormulaireInitial = {
          ...etatInitial,
          valeursInitiales: {
            ...etatInitial.valeursInitiales,
            typesEntites: ['Agriculture', 'Bourse'],
          },
          preferences: {
            ...etatInitial.preferences,
            preferencesAidant: {
              ...etatInitial.preferences.preferencesAidant,
              typesEntites: ['Agriculture', 'Bourse', 'Informatique'],
            },
          },
        };

        const etatFormulaire = reducteurPreferences(
          etatFormulaireInitial,
          cochePreference('Informatique', 'TYPE_ENTITE')
        );

        expect(etatFormulaire).toStrictEqual({
          ...etatFormulaireInitial,
          preferencesChangees: {
            typesEntites: false,
            secteursActivite: false,
            departements: false,
          },
          preferences: {
            ...etatFormulaireInitial.preferences,
            preferencesAidant: {
              ...etatFormulaireInitial.preferences.preferencesAidant,
              typesEntites: ['Agriculture', 'Bourse'],
            },
          },
        });
      });
    });

    describe("Pour les secteurs d'activité", () => {
      it("Coche un secteur d'activité", () => {
        const etatFormulaire = reducteurPreferences(
          etatInitial,
          cochePreference('Agriculture', 'SECTEUR_ACTIVITE')
        );

        expect(etatFormulaire).toStrictEqual({
          ...etatInitial,
          preferencesChangees: {
            typesEntites: false,
            secteursActivite: true,
            departements: false,
          },
          preferences: {
            ...etatInitial.preferences,
            preferencesAidant: {
              ...etatInitial.preferences.preferencesAidant,
              secteursActivite: ['Agriculture'],
            },
          },
        });
      });

      it("Décoche un secteur d'activité", () => {
        const etatFormulaireInitial = {
          ...etatInitial,
          preferences: {
            ...etatInitial.preferences,
            preferencesAidant: {
              ...etatInitial.preferences.preferencesAidant,
              secteursActivite: ['Agriculture', 'Bourse', 'Informatique'],
            },
          },
        };
        const etatFormulaire = reducteurPreferences(
          etatFormulaireInitial,
          cochePreference('Agriculture', 'SECTEUR_ACTIVITE')
        );

        expect(etatFormulaire).toStrictEqual({
          ...etatFormulaireInitial,
          preferencesChangees: {
            typesEntites: false,
            secteursActivite: true,
            departements: false,
          },
          preferences: {
            ...etatFormulaireInitial.preferences,
            preferencesAidant: {
              ...etatFormulaireInitial.preferences.preferencesAidant,
              secteursActivite: ['Bourse', 'Informatique'],
            },
          },
        });
      });

      it("Coche tous les secteurs d'activité", () => {
        const secteursActiviteReference = [
          'Administration',
          'Industrie',
          'Transports',
        ];

        const etatFormulaire = reducteurPreferences(
          {
            ...etatInitial,
            preferences: {
              ...etatInitial.preferences,
              referentiel: {
                ...etatInitial.preferences.referentiel,
                secteursActivite: secteursActiviteReference,
              },
            },
          },
          cocheToutesLesPreferences('SECTEUR_ACTIVITE')
        );

        expect(
          etatFormulaire.preferences.preferencesAidant.secteursActivite
        ).toStrictEqual(secteursActiviteReference);
        expect(etatFormulaire.preferencesChangees.secteursActivite).toBe(true);
      });

      it("Décoche tous les secteurs d'activité", () => {
        const secteursActiviteReference = [
          'Administration',
          'Informatique',
          'Transport',
        ];

        const etatFormulaire = reducteurPreferences(
          {
            ...etatInitial,
            valeursInitiales: {
              ...etatInitial.valeursInitiales,
              secteursActivite: secteursActiviteReference,
            },
            preferences: {
              ...etatInitial.preferences,
              preferencesAidant: {
                ...etatInitial.preferences.preferencesAidant,
                secteursActivite: secteursActiviteReference,
              },
            },
          },
          decocheToutesLesPreferences('SECTEUR_ACTIVITE')
        );

        expect(
          etatFormulaire.preferences.preferencesAidant.secteursActivite
        ).toStrictEqual([]);
        expect(etatFormulaire.preferencesChangees.secteursActivite).toBe(true);
      });

      it('Coche pour retour etat initial', () => {
        const etatFormulaireInitial = {
          ...etatInitial,
          valeursInitiales: {
            ...etatInitial.valeursInitiales,
            secteursActivite: ['Agriculture', 'Bourse'],
          },
          preferences: {
            ...etatInitial.preferences,
            preferencesAidant: {
              ...etatInitial.preferences.preferencesAidant,
              secteursActivite: ['Agriculture', 'Bourse', 'Informatique'],
            },
          },
        };

        const etatFormulaire = reducteurPreferences(
          etatFormulaireInitial,
          cochePreference('Informatique', 'SECTEUR_ACTIVITE')
        );

        expect(etatFormulaire).toStrictEqual({
          ...etatFormulaireInitial,
          preferencesChangees: {
            typesEntites: false,
            secteursActivite: false,
            departements: false,
          },
          preferences: {
            ...etatFormulaireInitial.preferences,
            preferencesAidant: {
              ...etatFormulaireInitial.preferences.preferencesAidant,
              secteursActivite: ['Agriculture', 'Bourse'],
            },
          },
        });
      });
    });

    describe('Pour les secteurs géographique', () => {
      it('Coche un secteur géographique', () => {
        const etatFormulaire = reducteurPreferences(
          etatInitial,
          cochePreference('33', 'SECTEUR_GEOGRAPHIQUE')
        );

        expect(etatFormulaire).toStrictEqual({
          ...etatInitial,
          preferencesChangees: {
            typesEntites: false,
            secteursActivite: false,
            departements: true,
          },
          preferences: {
            ...etatInitial.preferences,
            preferencesAidant: {
              ...etatInitial.preferences.preferencesAidant,
              departements: ['33'],
            },
          },
        });
      });

      it('Décoche un secteur géographique', () => {
        const etatFormulaireInitial = {
          ...etatInitial,
          preferences: {
            ...etatInitial.preferences,
            preferencesAidant: {
              ...etatInitial.preferences.preferencesAidant,
              departements: ['33', '47', '29'],
            },
          },
        };

        const etatFormulaire = reducteurPreferences(
          etatFormulaireInitial,
          cochePreference('33', 'SECTEUR_GEOGRAPHIQUE')
        );

        expect(etatFormulaire).toStrictEqual({
          ...etatFormulaireInitial,
          preferencesChangees: {
            typesEntites: false,
            secteursActivite: false,
            departements: true,
          },
          preferences: {
            ...etatFormulaireInitial.preferences,
            preferencesAidant: {
              ...etatFormulaireInitial.preferences.preferencesAidant,
              departements: ['47', '29'],
            },
          },
        });
      });

      // it('Coche tous les secteurs géographiques', () => {});
    });
  });
});
