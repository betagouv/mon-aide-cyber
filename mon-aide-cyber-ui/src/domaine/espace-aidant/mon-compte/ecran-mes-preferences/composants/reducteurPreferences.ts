import {
  Preferences,
  PreferencesAidant,
} from './FormulaireMesPreferences/FormulaireMesPreferences.types';

type PreferencesChangees = {
  typesEntites: boolean;
  secteursActivite: boolean;
  departements: boolean;
};

export type EtatPreferences = {
  preferences: Preferences;
  valeursInitiales: PreferencesAidant;
  preferencesChangees: PreferencesChangees;
  enCoursDeChargement: boolean;
};

enum TypeActionPreferences {
  PREFERENCES_CHARGE = 'PREFERENCES',
  PREFERENCES_CHARGE_EN_ERREUR = 'PREFERENCES_CHARGE_EN_ERREUR',
  PREFERENCES_COCHE = 'PREFERENCES_COCHE',
  PREFERENCES_COCHE_TOUT = 'PREFERENCES_COCHE_TOUT',
  PREFERENCES_DECOCHE_TOUT = 'PREFERENCES_DECOCHE_TOUT',
}

export type CibleActionPreference =
  | 'TYPE_ENTITE'
  | 'SECTEUR_GEOGRAPHIQUE'
  | 'SECTEUR_ACTIVITE';

type ActionPreferences =
  | {
      type: TypeActionPreferences.PREFERENCES_COCHE;
      saisie: string;
      cible: CibleActionPreference;
    }
  | {
      type: TypeActionPreferences.PREFERENCES_CHARGE;
      preferences: Preferences;
    }
  | {
      type: TypeActionPreferences.PREFERENCES_COCHE_TOUT;
      cible: CibleActionPreference;
    }
  | {
      type: TypeActionPreferences.PREFERENCES_DECOCHE_TOUT;
      cible: CibleActionPreference;
    };

export const typePreferenceParActionCible = {
  SECTEUR_ACTIVITE: 'secteursActivite',
  SECTEUR_GEOGRAPHIQUE: 'departements',
  TYPE_ENTITE: 'typesEntites',
};

const sontTableauxEgaux = (a: string[], b: string[]) =>
  a.every((element) => b.includes(element));

const aEteChange = (valeursInitiales: string[], saisie: string[]): boolean => {
  const estDeMemeLongueur = valeursInitiales.length === saisie.length;

  const estInitial = sontTableauxEgaux(valeursInitiales, saisie);
  return !estDeMemeLongueur || !estInitial;
};

export const reducteurPreferences = (
  etat: EtatPreferences,
  action: ActionPreferences
): EtatPreferences => {
  switch (action.type) {
    case TypeActionPreferences.PREFERENCES_CHARGE:
      return {
        ...etat,
        valeursInitiales: {
          typesEntites: action.preferences.preferencesAidant.typesEntites || [],
          secteursActivite:
            action.preferences.preferencesAidant.secteursActivite || [],
          departements: action.preferences.preferencesAidant.departements || [],
        },
        preferences: action.preferences,
        enCoursDeChargement: false,
      };
    case TypeActionPreferences.PREFERENCES_COCHE: {
      let preferencesAGarder: string[] = [];

      const clef = typePreferenceParActionCible[action.cible];

      const preferencesChangees = {
        typesEntites: etat.preferencesChangees.typesEntites,
        secteursActivite: etat.preferencesChangees.secteursActivite,
        departements: etat.preferencesChangees.departements,
      };

      if (action.cible === 'SECTEUR_ACTIVITE') {
        preferencesAGarder = [
          ...ajouteOuRetireDeLaListeSiExiste(
            etat.preferences.preferencesAidant.secteursActivite || [],
            action.saisie
          ),
        ];
        preferencesChangees.secteursActivite = aEteChange(
          etat.valeursInitiales.secteursActivite,
          preferencesAGarder
        );
      } else if (action.cible === 'SECTEUR_GEOGRAPHIQUE') {
        preferencesAGarder = [
          ...ajouteOuRetireDeLaListeSiExiste(
            etat.preferences.preferencesAidant.departements || [],
            action.saisie
          ),
        ];
        preferencesChangees.departements = aEteChange(
          etat.valeursInitiales.departements,
          preferencesAGarder
        );
      } else {
        preferencesAGarder = [
          ...ajouteOuRetireDeLaListeSiExiste(
            etat.preferences.preferencesAidant.typesEntites || [],
            action.saisie
          ),
        ];
        preferencesChangees.typesEntites = aEteChange(
          etat.valeursInitiales.typesEntites,
          preferencesAGarder
        );
      }

      return {
        ...etat,
        preferencesChangees: {
          ...preferencesChangees,
        },
        preferences: {
          ...etat.preferences,
          preferencesAidant: {
            ...etat.preferences.preferencesAidant,
            [clef]: [...preferencesAGarder],
          },
        },
      };
    }
    case TypeActionPreferences.PREFERENCES_DECOCHE_TOUT: {
      const preferencesChangees = {
        typesEntites: etat.preferencesChangees.typesEntites,
        secteursActivite: etat.preferencesChangees.secteursActivite,
        departements: etat.preferencesChangees.departements,
      };

      preferencesChangees.secteursActivite = aEteChange(
        etat.valeursInitiales.secteursActivite,
        []
      );

      return {
        ...etat,
        preferencesChangees: {
          ...preferencesChangees,
        },
        preferences: {
          ...etat.preferences,
          preferencesAidant: {
            ...etat.preferences.preferencesAidant,
            secteursActivite: [],
          },
        },
      };
    }
    case TypeActionPreferences.PREFERENCES_COCHE_TOUT: {
      const preferencesChangees = {
        typesEntites: etat.preferencesChangees.typesEntites,
        secteursActivite: etat.preferencesChangees.secteursActivite,
        departements: etat.preferencesChangees.departements,
      };

      preferencesChangees.secteursActivite = aEteChange(
        etat.valeursInitiales.secteursActivite,
        etat.preferences.referentiel.secteursActivite
      );

      return {
        ...etat,
        preferencesChangees: {
          ...preferencesChangees,
        },
        preferences: {
          ...etat.preferences,
          preferencesAidant: {
            ...etat.preferences.preferencesAidant,
            secteursActivite: [
              ...etat.preferences.referentiel.secteursActivite,
            ],
          },
        },
      };
    }
  }
};

export const initialiseFormulairePreferences = (): EtatPreferences => ({
  preferencesChangees: {
    typesEntites: false,
    secteursActivite: false,
    departements: false,
  },
  valeursInitiales: {
    typesEntites: [],
    secteursActivite: [],
    departements: [],
  },
  preferences: {
    preferencesAidant: {
      typesEntites: [],
      secteursActivite: [],
      departements: [],
    },
    referentiel: {
      typesEntites: [],
      secteursActivite: [],
      departements: [],
    },
  },
  enCoursDeChargement: true,
});

export const cochePreference = (
  saisie: string,
  cible: CibleActionPreference
): ActionPreferences => ({
  type: TypeActionPreferences.PREFERENCES_COCHE,
  saisie,
  cible,
});

export const chargePreferences = (
  preferences: Preferences
): ActionPreferences => ({
  type: TypeActionPreferences.PREFERENCES_CHARGE,
  preferences,
});

export const cocheToutesLesPreferences = (
  cible: CibleActionPreference
): ActionPreferences => ({
  type: TypeActionPreferences.PREFERENCES_COCHE_TOUT,
  cible,
});

export const decocheToutesLesPreferences = (
  cible: CibleActionPreference
): ActionPreferences => ({
  type: TypeActionPreferences.PREFERENCES_DECOCHE_TOUT,
  cible,
});

function ajouteOuRetireDeLaListeSiExiste(
  secteurAGarder: string[],
  saisie: string
) {
  const index = secteurAGarder.indexOf(saisie);

  return index >= 0
    ? secteurAGarder.filter((x) => x !== saisie)
    : [...secteurAGarder, saisie];
}
