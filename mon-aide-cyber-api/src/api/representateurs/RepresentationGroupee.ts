import { QuestionsThematique } from '../../diagnostic/Diagnostic';
import { RepresentationGroupes, Transcripteur } from './types';
import {
  extraisLesChampsDeLaQuestion,
  trouveQuestionATranscrire,
  trouveReponsesPossibles,
} from './representateurDiagnostic';

export class RepresentationGroupee {
  constructor(
    private readonly transcripteur: Transcripteur,
    private numeroQuestion: number = 1,
  ) {}

  represente(
    clef: string,
    questionsThematique: QuestionsThematique,
  ): RepresentationGroupes {
    const representations: RepresentationGroupes =
      this.transcripteur.thematiques[clef].groupes
        .filter(
          (groupe) =>
            groupe.questions.filter(
              (q) =>
                questionsThematique.questions.find(
                  (qu) => q.identifiant === qu.identifiant,
                ) !== undefined,
            ).length > 0,
        )
        .map((groupe) => {
          const questions = groupe.questions.map((questionATranscrire) => {
            const question = questionsThematique.questions.find(
              (questionDiagnostic) =>
                questionDiagnostic.identifiant ===
                questionATranscrire.identifiant,
            );
            const reponsesPossibles = trouveReponsesPossibles(
              question!,
              this.transcripteur,
              questionATranscrire,
            );
            const { autresReponses, reste } = extraisLesChampsDeLaQuestion(
              question!,
            );
            return {
              ...reste,
              reponseDonnee: autresReponses,
              reponsesPossibles,
              type: questionATranscrire?.type || question!.type,
              ...(questionATranscrire['info-bulles'] && {
                'info-bulles': this.transcripteur.generateurInfoBulle(
                  questionATranscrire['info-bulles'],
                ),
              }),
            };
          });
          return { numero: this.numeroQuestion++, questions };
        });

    representations.push(
      ...this.questionsThematiqueNonRepresentees(
        representations,
        questionsThematique,
        clef,
      ),
    );

    return representations;
  }

  private questionsThematiqueNonRepresentees(
    representations: RepresentationGroupes,
    questionsThematique: QuestionsThematique,
    clef: string,
  ) {
    const tousLesIdentifiants = representations.flatMap((representation) =>
      representation.questions.map((question) => question.identifiant),
    );
    const questionsNonRepresentees = questionsThematique.questions.filter(
      (question) => !tousLesIdentifiants.includes(question.identifiant),
    );

    return questionsNonRepresentees.map((question) => {
      const questionATranscrire = trouveQuestionATranscrire(
        {
          chemin: clef,
          identifiantQuestion: question.identifiant,
        },
        this.transcripteur,
      );
      const reponsesPossibles = trouveReponsesPossibles(
        question,
        this.transcripteur,
        questionATranscrire,
      );
      const { autresReponses, reste } = extraisLesChampsDeLaQuestion(question);
      return {
        numero: this.numeroQuestion++,
        questions: [
          {
            ...reste,
            reponseDonnee: autresReponses,
            reponsesPossibles,
            type: questionATranscrire?.type || question.type,
          },
        ],
      };
    });
  }
}
