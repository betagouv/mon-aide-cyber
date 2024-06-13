enum TypeActionBouton {
  CLIQUE = 'CLIQUE',
  CHARGE = 'CHARGE',
}

export type ActionBouton =
  | {
      type: TypeActionBouton.CLIQUE;
    }
  | {
      type: TypeActionBouton.CHARGE;
      thematiqueCourante: string;
      thematiques: string[];
    };
export type EtatBouton = {
  thematiqueCourante: string;
  thematiques: string[];
  borneThematique: boolean;
  onClick: (thematique: string) => void;
};
export const reducteurBoutonThematiqueSuivante = (
  etat: EtatBouton,
  action: ActionBouton
): EtatBouton => {
  function indices(thematiques: string[], thematiqueCourante: string) {
    return {
      indiceThematiqueCourante: thematiques.indexOf(thematiqueCourante),
      dernierIndiceThematique: thematiques.length - 1,
    };
  }

  switch (action.type) {
    case TypeActionBouton.CHARGE: {
      const { indiceThematiqueCourante, dernierIndiceThematique } = indices(
        action.thematiques,
        action.thematiqueCourante
      );
      return {
        ...etat,
        thematiqueCourante: action.thematiqueCourante,
        thematiques: action.thematiques,
        borneThematique: dernierIndiceThematique === indiceThematiqueCourante,
      };
    }
    case TypeActionBouton.CLIQUE: {
      const { indiceThematiqueCourante, dernierIndiceThematique } = indices(
        etat.thematiques,
        etat.thematiqueCourante
      );
      let thematiqueCourante = etat.thematiqueCourante;
      if (indiceThematiqueCourante < dernierIndiceThematique) {
        thematiqueCourante = etat.thematiques[indiceThematiqueCourante + 1];
      }
      etat.onClick(thematiqueCourante);
      return {
        ...etat,
        thematiqueCourante,
        borneThematique: indiceThematiqueCourante === dernierIndiceThematique,
      };
    }
  }
};

export const reducteurBoutonThematiquePrecedente = (
  etat: EtatBouton,
  action: ActionBouton
): EtatBouton => {
  const indice = (thematiques: string[], thematiqueCour: string) => {
    const indiceThematiqueCourante = thematiques.indexOf(thematiqueCour);
    return { indiceThematiqueCourante, premierIndiceThematique: 0 };
  };

  switch (action.type) {
    case TypeActionBouton.CLIQUE: {
      const { indiceThematiqueCourante, premierIndiceThematique } = indice(
        etat.thematiques,
        etat.thematiqueCourante
      );
      let thematiqueCourante = etat.thematiqueCourante;
      if (premierIndiceThematique < indiceThematiqueCourante) {
        thematiqueCourante = etat.thematiques[indiceThematiqueCourante - 1];
      }
      etat.onClick(thematiqueCourante);
      return {
        ...etat,
        thematiqueCourante,
        borneThematique: indiceThematiqueCourante === premierIndiceThematique,
      };
    }
    case TypeActionBouton.CHARGE: {
      const { indiceThematiqueCourante, premierIndiceThematique } = indice(
        action.thematiques,
        action.thematiqueCourante
      );
      return {
        ...etat,
        thematiqueCourante: action.thematiqueCourante,
        thematiques: action.thematiques,
        borneThematique: premierIndiceThematique === indiceThematiqueCourante,
      };
    }
  }
};
export const thematiqueChargee = (
  thematiqueCourante: string,
  thematiques: string[]
): ActionBouton => {
  return {
    type: TypeActionBouton.CHARGE,
    thematiqueCourante,
    thematiques,
  };
};
export const boutonThematiqueCliquee = (): ActionBouton => {
  return {
    type: TypeActionBouton.CLIQUE,
  };
};
