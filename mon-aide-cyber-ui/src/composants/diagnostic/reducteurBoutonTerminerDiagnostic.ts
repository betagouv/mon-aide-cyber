enum TypeActionBouton {
  CHARGE = 'CHARGE',
}
export type EtatBoutonTerminerDiagnostic = {
  thematiques: string[];
  derniereThematique: boolean;
};

export type ActionBoutonTerminerDiagnostic = {
  type: TypeActionBouton.CHARGE;
  thematiqueCourante: string;
  thematiques: string[];
};

export const reducteurBoutonTerminerDiagnostic = (
  etatBouton: EtatBoutonTerminerDiagnostic,
  action: ActionBoutonTerminerDiagnostic
): EtatBoutonTerminerDiagnostic => {
  switch (action.type) {
    case TypeActionBouton.CHARGE: {
      return {
        ...etatBouton,
        thematiques: action.thematiques,
        derniereThematique:
          action.thematiques.indexOf(action.thematiqueCourante) ===
          action.thematiques.length - 1,
      };
    }
  }
};

export const thematiqueChargee = (
  thematiqueCourante: string,
  thematiques: string[]
): ActionBoutonTerminerDiagnostic => {
  return {
    type: TypeActionBouton.CHARGE,
    thematiqueCourante,
    thematiques,
  };
};
