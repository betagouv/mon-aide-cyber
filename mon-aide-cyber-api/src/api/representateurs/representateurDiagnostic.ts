import {
  Diagnostic,
  QuestionDiagnostic,
  QuestionsThematique,
} from '../../diagnostic/Diagnostic';
import { QuestionATiroir, ReponsePossible } from '../../diagnostic/Referentiel';
import {
  Action,
  Chemin,
  ConditionPerimetre,
  QuestionATranscrire,
  ReponseATranscrire,
  RepresentationDiagnostic,
  RepresentationQuestion,
  RepresentationReferentiel,
  RepresentationReponsePossible,
  Transcripteur,
} from './types';
import { RepresentationGroupee } from './RepresentationGroupee';

export const trouveQuestionATranscrire = (
  chemin: { chemin: Chemin; identifiantQuestion: string },
  transcripteur: Transcripteur
): QuestionATranscrire | undefined => {
  return trouveParmiLesQuestions(
    transcripteur.thematiques[chemin.chemin].groupes.flatMap(
      (q) => q.questions as QuestionATranscrire[]
    ),
    chemin.identifiantQuestion
  );
};
const trouveParmiLesQuestions = (
  questions: QuestionATranscrire[],
  identifiantQuestion: string
): QuestionATranscrire | undefined => {
  for (const question of questions) {
    if (question.identifiant === identifiantQuestion) {
      return question;
    }
    const questionsATranscrire = (
      question.reponses
        ?.reduce((accumulateur: ReponseATranscrire[], reponseCourante) => {
          if (reponseCourante.question !== undefined) {
            accumulateur.push(reponseCourante);
          }
          return accumulateur;
        }, [])
        .map((reponse) => reponse.question) as QuestionATranscrire[]
    )?.find((q) => q.identifiant === identifiantQuestion);
    if (questionsATranscrire !== undefined) {
      return questionsATranscrire;
    }
  }
  return undefined;
};
const questionTiroirATranscrire = (
  questions: QuestionATiroir[] | undefined,
  transcripteur: Transcripteur
): RepresentationQuestion[] => {
  return (
    questions?.map((question) => {
      const questionTiroirATranscrire: QuestionATranscrire | undefined =
        trouveQuestionATranscrire(
          {
            chemin: `contexte`,
            identifiantQuestion: question.identifiant,
          },
          transcripteur
        );
      if (questionTiroirATranscrire !== undefined) {
        const reponsesPossibles: RepresentationReponsePossible[] =
          trouveReponsesPossibles(question, transcripteur);
        return {
          type: question.type,
          identifiant: questionTiroirATranscrire.identifiant,
          reponsesPossibles,
          libelle: question.libelle,
        } as RepresentationQuestion;
      }
      const { poids, ...questionSansPoids } = { ...question };
      return {
        ...questionSansPoids,
      } as RepresentationQuestion;
    }) || []
  );
};

const estQuestionATiroir = (
  reponse: ReponsePossible | Omit<ReponsePossible, 'questions'>
): reponse is ReponsePossible => {
  return (
    'questions' in reponse &&
    reponse.questions !== undefined &&
    reponse.questions?.length > 0
  );
};
export const trouveReponsesPossibles = (
  question: QuestionDiagnostic | QuestionATiroir,
  transcripteur: Transcripteur
): RepresentationReponsePossible[] => {
  return question.reponsesPossibles.map((reponse) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { resultat, ...corpsDeReponse } = reponse;
    let representationReponsePossible: RepresentationReponsePossible = {
      ...corpsDeReponse,
    } as RepresentationReponsePossible;
    if (estQuestionATiroir(reponse)) {
      const representationQuestionATiroir = questionTiroirATranscrire(
        reponse.questions,
        transcripteur
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { questions, resultat, ...corpsDeReponse } = reponse;
      representationReponsePossible = {
        ...corpsDeReponse,
        questions: representationQuestionATiroir,
      };
    }
    return {
      ...representationReponsePossible,
    };
  });
};

export const extraisLesChampsDeLaQuestion = (question: QuestionDiagnostic) => {
  const autresReponses = {
    valeur: question.reponseDonnee.reponseUnique,
    reponses: question.reponseDonnee.reponsesMultiples.map((rep) => ({
      identifiant: rep.identifiant,
      reponses: [...rep.reponses],
    })),
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { reponseDonnee, poids, ...reste } = { ...question };
  return { autresReponses, reste };
};

export function representeLeDiagnosticPourLeClient(
  diagnostic: Diagnostic,
  transcripteur: Transcripteur
): RepresentationDiagnostic {
  const actions: Action[] = [];
  const representationGroupee = new RepresentationGroupee(transcripteur);

  const recupereLesQuestionsSuivantLesConditionsDePerimetre = (
    questionsThematique: QuestionsThematique
  ) => {
    const conditionVerifiee = (conditionPerimetre: ConditionPerimetre) =>
      Object.entries(conditionPerimetre).filter(
        ([thematique, conditions]) =>
          Object.entries(conditions).filter(
            ([question, reponse]) =>
              !!diagnostic.referentiel[thematique].questions.find(
                (qu) =>
                  qu.identifiant === question &&
                  qu.reponseDonnee.reponseUnique === reponse
              )
          ).length > 0
      ).length > 0;

    return questionsThematique.questions
      .map((q) => {
        const conditionPerimetre =
          transcripteur.conditionsPerimetre[q.identifiant];
        return conditionPerimetre && conditionVerifiee(conditionPerimetre)
          ? undefined
          : q;
      })
      .filter((q): q is QuestionDiagnostic => !!q);
  };

  const referentiel: RepresentationReferentiel = Object.entries(
    diagnostic.referentiel
  )
    .sort(([thematiqueA], [thematiqueB]) =>
      transcripteur.ordreThematiques &&
      transcripteur.ordreThematiques?.indexOf(thematiqueA) >
        transcripteur.ordreThematiques?.indexOf(thematiqueB)
        ? 1
        : -1
    )
    .reduce(
      (
        accumulateur: RepresentationReferentiel,
        [clef, questionsThematique]
      ) => {
        actions.push({
          [clef]: {
            action: 'repondre',
            ressource: {
              url: `/api/diagnostic/${diagnostic.identifiant}`,
              methode: 'PATCH',
            },
          },
        });
        return {
          ...accumulateur,
          [clef]: {
            actions: [
              {
                action: 'repondre',
                chemin: clef,
                ressource: {
                  url: `/api/diagnostic/${diagnostic.identifiant}`,
                  methode: 'PATCH',
                },
              },
            ],
            description: transcripteur.thematiques[clef].description,
            libelle: transcripteur.thematiques[clef].libelle,
            styles: {
              navigation: transcripteur.thematiques[clef].styles.navigation,
            },
            localisationIllustration:
              transcripteur.thematiques[clef].localisationIllustration,
            groupes: representationGroupee.represente(clef, {
              questions:
                recupereLesQuestionsSuivantLesConditionsDePerimetre(
                  questionsThematique
                ),
            }),
          },
        };
      },
      {}
    );

  return {
    actions,
    identifiant: diagnostic.identifiant,
    referentiel,
  };
}
