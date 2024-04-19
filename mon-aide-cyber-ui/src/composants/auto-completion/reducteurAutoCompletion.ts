enum TypeActionAutoCompletion {
  TOUCHE_CLAVIER_APPUYEE = 'TOUCHE_CLAVIER_APPUYEE',
  FOCUS_EN_COURS = 'FOCUS_EN_COURS',
  VALEURS_CHARGEES = 'VALEURS_CHARGEES',
  VALEUR_SAISIE = 'VALEUR_SAISIE',
  OPTION_CHOISIE = 'OPTION_CHOISIE',
}
export type EtatAutoCompletion = {
  nom: string;
  valeur: any;
  valeurs: (string | object)[];
  valeursFiltrees: (string | object)[];
  visibilite: 'visible' | 'invisible';
};

export type ActionAutoCompletion =
  | {
      type: TypeActionAutoCompletion.TOUCHE_CLAVIER_APPUYEE;
      touche: string;
    }
  | {
      type: TypeActionAutoCompletion.VALEURS_CHARGEES;
      proprietes: {
        valeurs: (string | object)[];
        valeur?: string;
      };
    }
  | {
      type: TypeActionAutoCompletion.VALEUR_SAISIE;
      valeur: string;
      execute: (valeur: string) => void;
    }
  | {
      type: TypeActionAutoCompletion.OPTION_CHOISIE;
      valeur: string;
      execute: (valeur: string) => void;
    }
  | {
      type: TypeActionAutoCompletion.FOCUS_EN_COURS;
      valeurs: (string | object)[];
    };

const estUneChaineDeCaractere = (valeur: string | object): valeur is string =>
  typeof valeur === 'string';

const valeurAffichee = (
  valeursFiltrees: (string | object)[],
  valeurSaisie: string,
): string => {
  if (valeursFiltrees.length === 1) {
    if (
      estUneChaineDeCaractere(valeursFiltrees[0]) &&
      valeursFiltrees[0].toLowerCase() === valeurSaisie.toLowerCase()
    ) {
      return valeursFiltrees[0];
    }
    return Object.values(valeursFiltrees[0]).find(
      (val) => val.toLowerCase() === valeurSaisie.toLowerCase(),
    );
  }
  return valeurSaisie;
};

export const reducteurAutoCompletion = (
  etat: EtatAutoCompletion,
  action: ActionAutoCompletion,
): EtatAutoCompletion => {
  switch (action.type) {
    case TypeActionAutoCompletion.OPTION_CHOISIE: {
      action.execute(action.valeur);
      return {
        ...etat,
        valeur: action.valeur,
        valeursFiltrees: [],
        visibilite: 'invisible',
      };
    }
    case TypeActionAutoCompletion.VALEUR_SAISIE: {
      const valeurSaisie = action.valeur;
      const valeursFiltrees = etat.valeurs.filter((val) => {
        if (estUneChaineDeCaractere(val)) {
          return val.toLowerCase().includes(valeurSaisie.toLowerCase());
        }
        const filter = Object.values(val).filter((val) =>
          val.toLowerCase().includes(valeurSaisie.toLowerCase()),
        );
        return filter.length > 0;
      });
      action.execute(valeurSaisie);
      const valeur = valeurAffichee(valeursFiltrees, valeurSaisie);
      return {
        ...etat,
        valeur,
        valeursFiltrees,
        visibilite: 'visible',
      };
    }
    case TypeActionAutoCompletion.VALEURS_CHARGEES: {
      return {
        ...etat,
        valeurs: action.proprietes.valeurs,
        valeursFiltrees: action.proprietes.valeurs,
      };
    }
    case TypeActionAutoCompletion.FOCUS_EN_COURS: {
      return { ...etat, valeurs: action.valeurs };
    }
    case TypeActionAutoCompletion.TOUCHE_CLAVIER_APPUYEE: {
      if (action.touche === 'Tab') {
        return { ...etat, valeurs: [], visibilite: 'invisible' };
      }
      return { ...etat };
    }
  }
};

export const initialiseEtatAutoCompletion = (
  nom: string,
  valeur: any,
): EtatAutoCompletion => ({
  nom,
  valeur,
  valeurs: [],
  valeursFiltrees: [],
  visibilite: 'invisible',
});

export const toucheClavierAppuyee = (touche: string): ActionAutoCompletion => ({
  type: TypeActionAutoCompletion.TOUCHE_CLAVIER_APPUYEE,
  touche,
});

export const focusEnCours = (
  valeurs: (string | object)[],
): ActionAutoCompletion => ({
  type: TypeActionAutoCompletion.FOCUS_EN_COURS,
  valeurs,
});

export const valeursChargees = (proprietes: {
  valeurs: (string | object)[];
}): ActionAutoCompletion => ({
  type: TypeActionAutoCompletion.VALEURS_CHARGEES,
  proprietes,
});

export const valeurSaisie = (
  valeur: string,
  execute: (valeur: string) => void,
): ActionAutoCompletion => ({
  type: TypeActionAutoCompletion.VALEUR_SAISIE,
  valeur,
  execute,
});

export const optionChoisie = (
  valeur: string,
  execute: (valeur: string) => void,
): ActionAutoCompletion => ({
  type: TypeActionAutoCompletion.OPTION_CHOISIE,
  valeur,
  execute,
});
