import { Diagnostic } from './Diagnostic.ts';
import { ReponsePossible } from './Referentiel.ts';

enum TypeActionDiagnostic {
  DIAGNOSTIC_CHARGE = 'DIAGNOSTIC_CHARGE',
  THEMATIQUE_AFFICHEE = 'THEMATIQUE_AFFICHEE',
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
export const reducteurDiagnostic = (etat: EtatDiagnostic, action: ActionDiagnostic): EtatDiagnostic => {
  switch (action.type) {
    case TypeActionDiagnostic.THEMATIQUE_AFFICHEE:
      return { ...etat, thematiqueAffichee: action.clef };
    case TypeActionDiagnostic.DIAGNOSTIC_CHARGE:
      Object.entries(action.diagnostic.referentiel).forEach(([_, thematique]) => {
        const trieLesReponses = (reponsesPossibles: ReponsePossible[] | undefined): void => {
          reponsesPossibles?.sort((premiereReponse, secondeReponse) => premiereReponse.ordre - secondeReponse.ordre);
        };
        thematique.groupes.forEach((groupe) => {
          groupe.questions.forEach((question) => {
            trieLesReponses(question.reponsesPossibles);
            question.reponsesPossibles.forEach(
              (reponse) => reponse.questions?.forEach((question) => trieLesReponses(question.reponsesPossibles)),
            );
          });
        });
      });
      return {
        ...etat,
        diagnostic: action.diagnostic,
        thematiqueAffichee: 'contexte',
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
