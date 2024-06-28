import { Diagnostic } from './Diagnostic.ts';
import { Referentiel, ReponsePossible } from './Referentiel.ts';

enum TypeActionDiagnostic {
  DIAGNOSTIC_CHARGE = 'DIAGNOSTIC_CHARGE',
  THEMATIQUE_AFFICHEE = 'THEMATIQUE_AFFICHEE',
  DIAGNOSTIC_MODIFIE = 'DIAGNOSTIC_MODIFIE',
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
      diagnostic: Diagnostic;
      type: TypeActionDiagnostic.DIAGNOSTIC_MODIFIE;
    }
  | {
      clef: string;
      type: TypeActionDiagnostic.THEMATIQUE_AFFICHEE;
    };
export const reducteurDiagnostic = (
  etat: EtatDiagnostic,
  action: ActionDiagnostic
): EtatDiagnostic => {
  const trieLesReponses = (referentiel: Referentiel) => {
    Object.entries(referentiel).forEach(([_, thematique]) => {
      const trieLesReponses = (
        reponsesPossibles: ReponsePossible[] | undefined
      ): void => {
        reponsesPossibles?.sort(
          (premiereReponse, secondeReponse) =>
            premiereReponse.ordre - secondeReponse.ordre
        );
      };
      thematique.groupes.forEach((groupe) => {
        groupe.questions.forEach((question) => {
          trieLesReponses(question.reponsesPossibles);
          question.reponsesPossibles.forEach((reponse) =>
            reponse.questions?.forEach((question) =>
              trieLesReponses(question.reponsesPossibles)
            )
          );
        });
      });
    });
  };

  switch (action.type) {
    case TypeActionDiagnostic.THEMATIQUE_AFFICHEE:
      return { ...etat, thematiqueAffichee: action.clef };
    case TypeActionDiagnostic.DIAGNOSTIC_MODIFIE:
      trieLesReponses(action.diagnostic.referentiel);
      return {
        ...etat,
        diagnostic: action.diagnostic,
      };
    case TypeActionDiagnostic.DIAGNOSTIC_CHARGE:
      trieLesReponses(action.diagnostic.referentiel);
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
    diagnostic,
  };
};

export const diagnosticModifie = (diagnostic: Diagnostic): ActionDiagnostic => {
  return {
    type: TypeActionDiagnostic.DIAGNOSTIC_MODIFIE,
    diagnostic,
  };
};

export const thematiqueAffichee = (clef: string): ActionDiagnostic => {
  return {
    type: TypeActionDiagnostic.THEMATIQUE_AFFICHEE,
    clef,
  };
};
