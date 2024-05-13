enum TypeActionAutoCompletion {
  TOUCHE_CLAVIER_APPUYEE = 'TOUCHE_CLAVIER_APPUYEE',
  FOCUS_EN_COURS = 'FOCUS_EN_COURS',
  SUGGESTIONS_INITIALES_CHARGEES = 'SUGGESTIONS_INITIALES_CHARGEES',
  VALEUR_SAISIE = 'VALEUR_SAISIE',
  SUGGESTION_CHOISIE = 'SUGGESTION_CHOISIE',
  CLICK_EN_DEHORS = 'CLICK_EN_DEHORS',
  BASCULE_AFFICHAGE_VALEURS = 'BASCULE_AFFICHAGE_VALEURS',
}

export type EtatAutoCompletion<T> = {
  elementNavigationCourant?: { valeur: T; index: number };
  nom: string;
  valeurSaisie: T | string;
  suggestionsInitiales: T[];
  suggestions: T[];
  navigationClavierReinitialisee: boolean;
  suggestionsVisibles: 'visible' | 'invisible';
  clefsFiltrage?: (keyof T)[];
};

type ActionAutoCompletion<T> =
  | {
      type: TypeActionAutoCompletion.TOUCHE_CLAVIER_APPUYEE;
      touche: string;
    }
  | {
      type: TypeActionAutoCompletion.SUGGESTIONS_INITIALES_CHARGEES;
      proprietes: {
        suggestionsInitiales: T[];
        valeur?: string;
      };
    }
  | {
      type: TypeActionAutoCompletion.VALEUR_SAISIE;
      valeur: string;
      execute: (valeur: T | string) => void;
    }
  | {
      type: TypeActionAutoCompletion.SUGGESTION_CHOISIE;
      valeur: T;
      execute: (valeur: T) => void;
    }
  | {
      type: TypeActionAutoCompletion.FOCUS_EN_COURS;
      valeurs: T[];
    }
  | {
      type: TypeActionAutoCompletion.CLICK_EN_DEHORS;
    }
  | {
      type: TypeActionAutoCompletion.BASCULE_AFFICHAGE_VALEURS;
    };

export const reducteurAutoCompletion = <T extends object | string>() => {
  const basculeVisibilite = (suggestionsVisibles: 'visible' | 'invisible') =>
    suggestionsVisibles === 'visible' ? 'invisible' : 'visible';
  return (
    etat: EtatAutoCompletion<T>,
    action: ActionAutoCompletion<T>
  ): EtatAutoCompletion<T> => {
    const estUneChaineDeCaractere = (valeur: T | string): valeur is string =>
      typeof valeur === 'string';

    const valeurAffichee = (
      valeursFiltrees: T[],
      valeurSaisie: string
    ): string | T => {
      if (valeursFiltrees.length === 1) {
        const valeurFiltree = valeursFiltrees[0];
        if (
          estUneChaineDeCaractere(valeurFiltree) &&
          valeurFiltree.toLowerCase() === valeurSaisie.toLowerCase()
        ) {
          return valeurFiltree;
        }
        const valeurTrouvee =
          !estUneChaineDeCaractere(valeurFiltree) &&
          Object.values(valeurFiltree).find(
            (val) => String(val).toLowerCase() === valeurSaisie.toLowerCase()
          );
        return valeurTrouvee ? valeurFiltree : valeurSaisie;
      }
      return valeurSaisie;
    };

    const chaineDeCaractereStrictementEgaleALaValeurSaisie = (
      valeurFiltree: T,
      valeurSaisie: string
    ) =>
      estUneChaineDeCaractere(valeurFiltree) &&
      valeurFiltree.toLowerCase() === valeurSaisie.toLowerCase();

    function objetDontUnChampAUneValeurStrictementEgalALaValeurSaisie(
      valeurFiltree: T,
      valeurSaisie: string
    ) {
      return (
        !estUneChaineDeCaractere(valeurFiltree) &&
        Object.values(valeurFiltree).filter(
          (val) => String(val).toLowerCase() === valeurSaisie.toLowerCase()
        ).length > 0
      );
    }

    switch (action.type) {
      case TypeActionAutoCompletion.BASCULE_AFFICHAGE_VALEURS:
        return {
          ...etat,
          suggestions: etat.suggestionsInitiales,
          suggestionsVisibles: basculeVisibilite(etat.suggestionsVisibles),
        };
      case TypeActionAutoCompletion.CLICK_EN_DEHORS:
        return {
          ...etat,
          suggestionsVisibles: 'invisible',
        };
      case TypeActionAutoCompletion.SUGGESTION_CHOISIE: {
        const valeurSaisie = action.valeur;
        action.execute(valeurSaisie);
        return {
          ...etat,
          valeurSaisie,
          suggestions: [],
          suggestionsVisibles: 'invisible',
        };
      }
      case TypeActionAutoCompletion.VALEUR_SAISIE: {
        const valeur = action.valeur;
        const suggestions = etat.suggestionsInitiales.filter((val) => {
          if (estUneChaineDeCaractere(val)) {
            return val.toLowerCase().startsWith(valeur.toLowerCase());
          }
          if (etat.clefsFiltrage) {
            return (
              Object.values(etat.clefsFiltrage).filter((clef: keyof T) =>
                String(val[clef])
                  .toLowerCase()
                  .startsWith(valeur.toLowerCase())
              ).length > 0
            );
          }
          return (
            Object.values(val).filter((val) =>
              String(val).toLowerCase().startsWith(valeur.toLowerCase())
            ).length > 0
          );
        });

        if (
          suggestions.length === 1 &&
          (chaineDeCaractereStrictementEgaleALaValeurSaisie(
            suggestions[0],
            valeur
          ) ||
            objetDontUnChampAUneValeurStrictementEgalALaValeurSaisie(
              suggestions[0],
              valeur
            ))
        ) {
          action.execute(suggestions[0]);
        } else {
          action.execute(valeur);
        }
        const valeurSaisie = valeurAffichee(suggestions, valeur);
        return {
          ...etat,
          navigationClavierReinitialisee: true,
          valeurSaisie,
          suggestions,
          suggestionsVisibles: 'visible',
        };
      }
      case TypeActionAutoCompletion.SUGGESTIONS_INITIALES_CHARGEES: {
        return {
          ...etat,
          suggestionsInitiales: action.proprietes.suggestionsInitiales,
          suggestions: action.proprietes.suggestionsInitiales,
        };
      }
      case TypeActionAutoCompletion.FOCUS_EN_COURS: {
        return { ...etat, suggestionsInitiales: action.valeurs };
      }
      case TypeActionAutoCompletion.TOUCHE_CLAVIER_APPUYEE: {
        const navigationClavier = () => {
          const valeurs =
            etat.suggestions.length > 0
              ? etat.suggestions
              : etat.suggestionsInitiales;
          return {
            valeurs,
            indexSuivant: (indexSuivant: number) => {
              const elementSuivant = valeurs[indexSuivant];
              return {
                ...etat,
                elementNavigationCourant: {
                  valeur: elementSuivant,
                  index: indexSuivant,
                },
                navigationClavierReinitialisee: false,
              };
            },
          };
        };
        if (action.touche === 'Tab') {
          return {
            ...etat,
            suggestionsInitiales: [],
            suggestionsVisibles: 'invisible',
          };
        }
        const navigation = navigationClavier();
        if (action.touche === 'ArrowDown') {
          const borne = 0;
          return navigation.indexSuivant(
            etat.elementNavigationCourant &&
              etat.elementNavigationCourant.index >= 0 &&
              etat.elementNavigationCourant.index + 1 !==
                navigation.valeurs.length &&
              !etat.navigationClavierReinitialisee
              ? etat.elementNavigationCourant.index + 1
              : borne
          );
        }
        if (action.touche === 'ArrowUp') {
          const borne = etat.navigationClavierReinitialisee
            ? 0
            : navigation.valeurs.length - 1;
          const indexSuivant =
            etat.elementNavigationCourant &&
            etat.elementNavigationCourant.index &&
            !etat.navigationClavierReinitialisee
              ? etat.elementNavigationCourant.index - 1
              : borne;
          return navigation.indexSuivant(indexSuivant);
        }
        return { ...etat };
      }
    }
  };
};

export const initialiseEtatAutoCompletion =
  <T>() =>
  (
    nom: string,
    valeurSaisie: T | string,
    clefsFiltrage?: (keyof T)[]
  ): EtatAutoCompletion<T> => ({
    nom,
    valeurSaisie,
    suggestionsInitiales: [],
    suggestions: [],
    navigationClavierReinitialisee: false,
    suggestionsVisibles: 'invisible',
    ...(clefsFiltrage && { clefsFiltrage: clefsFiltrage }),
  });

export const toucheClavierAppuyee = <T>(
  touche: string
): ActionAutoCompletion<T> => ({
  type: TypeActionAutoCompletion.TOUCHE_CLAVIER_APPUYEE,
  touche,
});

export const focusEnCours = <T>(valeurs: T[]): ActionAutoCompletion<T> => ({
  type: TypeActionAutoCompletion.FOCUS_EN_COURS,
  valeurs,
});

export const suggestionsInitialesChargees = <T>(proprietes: {
  suggestionsInitiales: T[];
}): ActionAutoCompletion<T> => ({
  type: TypeActionAutoCompletion.SUGGESTIONS_INITIALES_CHARGEES,
  proprietes,
});

export const valeurSaisie = <T>(
  valeur: string,
  execute: (valeur: T | string) => void
): ActionAutoCompletion<T> => ({
  type: TypeActionAutoCompletion.VALEUR_SAISIE,
  valeur,
  execute,
});

export const suggestionChoisie = <T>(
  valeur: T,
  execute: (valeur: T) => void
): ActionAutoCompletion<T> => ({
  type: TypeActionAutoCompletion.SUGGESTION_CHOISIE,
  valeur,
  execute,
});

export const surClickEnDehors = <T>(): ActionAutoCompletion<T> => ({
  type: TypeActionAutoCompletion.CLICK_EN_DEHORS,
});

export const basculeAffichageValeurs = <T>(): ActionAutoCompletion<T> => ({
  type: TypeActionAutoCompletion.BASCULE_AFFICHAGE_VALEURS,
});
