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
  derniereThematique: boolean;
  onClick: (thematique: string) => void;
};
export const reducteurThematiqueSuivante = (
  etat: EtatBouton,
  action: ActionBouton,
): EtatBouton => {
  switch (action.type) {
    case TypeActionBouton.CHARGE: {
      const indiceThematiqueCourante = action.thematiques.indexOf(
        action.thematiqueCourante,
      );
      const dernierIndiceThematique = action.thematiques.length - 1;
      return {
        ...etat,
        thematiqueCourante: action.thematiqueCourante,
        thematiques: action.thematiques,
        derniereThematique:
          dernierIndiceThematique === indiceThematiqueCourante,
      };
    }
    case TypeActionBouton.CLIQUE: {
      const indiceThematiqueCourante = etat.thematiques.indexOf(
        etat.thematiqueCourante,
      );
      const dernierIndiceThematique = etat.thematiques.length - 1;
      let thematiqueCourante = etat.thematiqueCourante;
      if (indiceThematiqueCourante < dernierIndiceThematique) {
        thematiqueCourante = etat.thematiques[indiceThematiqueCourante + 1];
      }
      etat.onClick(thematiqueCourante);
      return {
        ...etat,
        thematiqueCourante,
        derniereThematique:
          indiceThematiqueCourante === dernierIndiceThematique,
      };
    }
  }
};
export const etapeChargee = (
  thematiqueCourante: string,
  thematiques: string[],
): ActionBouton => {
  return {
    type: TypeActionBouton.CHARGE,
    thematiqueCourante,
    thematiques,
  };
};
export const etapeSuivanteCliquee = (): ActionBouton => {
  return {
    type: TypeActionBouton.CLIQUE,
  };
};
