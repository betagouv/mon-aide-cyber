import { Diagnostique } from "./Diagnostique.ts";

enum TypeActionDiagnostique {
  DIAGNOSTIQUE_CHARGE = "DIAGNOSTIQUE_CHARGE",
}

type EtatDiagnostique = {
  diagnostique: Diagnostique | undefined;
};
type ActionDiagnostique = {
  diagnostique: Diagnostique;
  type: TypeActionDiagnostique.DIAGNOSTIQUE_CHARGE;
};
export const reducteurDiagnostique = (
  etat: EtatDiagnostique,
  action: ActionDiagnostique,
): EtatDiagnostique => {
  switch (action.type) {
    case TypeActionDiagnostique.DIAGNOSTIQUE_CHARGE:
      action.diagnostique.referentiel.contexte.questions.forEach((question) => {
        const reponsesTriees = question.reponsesPossibles.sort(
          (premiereQuestion, secondeQuestion) =>
            premiereQuestion.ordre - secondeQuestion.ordre,
        );
        return { ...question, reponsesPossibles: reponsesTriees };
      });
      return { ...etat, diagnostique: action.diagnostique };
  }
};
export const diagnostiqueCharge = (diagnostique: Diagnostique) => {
  return {
    type: TypeActionDiagnostique.DIAGNOSTIQUE_CHARGE,
    diagnostique: diagnostique,
  };
};
