import { Diagnostic } from "./Diagnostic.ts";

enum TypeActionDiagnostic {
  DIAGNOSTIC_CHARGE = "DIAGNOSTIC_CHARGE",
}

type EtatDiagnostic = {
  diagnostic: Diagnostic | undefined;
};
type ActionDiagnostic = {
  diagnostic: Diagnostic;
  type: TypeActionDiagnostic.DIAGNOSTIC_CHARGE;
};
export const reducteurDiagnostic = (
  etat: EtatDiagnostic,
  action: ActionDiagnostic,
): EtatDiagnostic => {
  switch (action.type) {
    case TypeActionDiagnostic.DIAGNOSTIC_CHARGE:
      action.diagnostic.referentiel.contexte.questions.forEach((question) => {
        const reponsesTriees = question.reponsesPossibles.sort(
          (premiereQuestion, secondeQuestion) =>
            premiereQuestion.ordre - secondeQuestion.ordre,
        );
        return { ...question, reponsesPossibles: reponsesTriees };
      });
      return { ...etat, diagnostic: action.diagnostic };
  }
};
export const diagnosticCharge = (diagnostic: Diagnostic) => {
  return {
    type: TypeActionDiagnostic.DIAGNOSTIC_CHARGE,
    diagnostic: diagnostic,
  };
};
