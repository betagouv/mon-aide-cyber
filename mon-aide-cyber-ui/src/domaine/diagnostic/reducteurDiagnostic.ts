import { Diagnostic } from "./Diagnostic.ts";

enum TypeActionDiagnostic {
  DIAGNOSTIC_CHARGE = "DIAGNOSTIC_CHARGE",
  THEMATIQUE_AFFICHEE = "THEMATIQUE_AFFICHEE",
}

type EtatDiagnostic = {
  diagnostic: Diagnostic | undefined;
  thematiqueAffichee: string | undefined;
};
type ActionDiagnostic =
  | {
      diagnostic: Diagnostic;
      type: TypeActionDiagnostic.DIAGNOSTIC_CHARGE;
    }
  | {
      clef: string;
      type: TypeActionDiagnostic.THEMATIQUE_AFFICHEE;
    };
export const reducteurDiagnostic = (
  etat: EtatDiagnostic,
  action: ActionDiagnostic,
): EtatDiagnostic => {
  switch (action.type) {
    case TypeActionDiagnostic.THEMATIQUE_AFFICHEE:
      return { ...etat, thematiqueAffichee: action.clef };
    case TypeActionDiagnostic.DIAGNOSTIC_CHARGE:
      action.diagnostic.referentiel.contexte.questions.forEach((question) => {
        const reponsesTriees = question.reponsesPossibles.sort(
          (premiereQuestion, secondeQuestion) =>
            premiereQuestion.ordre - secondeQuestion.ordre,
        );
        return {
          ...question,
          reponsesPossibles: reponsesTriees,
        };
      });
      return {
        ...etat,
        diagnostic: action.diagnostic,
        thematiqueAffichee: "contexte",
      };
  }
};
export const diagnosticCharge = (diagnostic: Diagnostic): ActionDiagnostic => {
  return {
    type: TypeActionDiagnostic.DIAGNOSTIC_CHARGE,
    diagnostic: diagnostic,
  };
};

export const thematiqueAffichee = (clef: string): ActionDiagnostic => {
  return {
    type: TypeActionDiagnostic.THEMATIQUE_AFFICHEE,
    clef,
  };
};
