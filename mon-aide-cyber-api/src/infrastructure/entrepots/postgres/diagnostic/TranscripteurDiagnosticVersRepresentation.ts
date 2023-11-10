import { Transcripteur } from '../Transcripteur';
import {
  Diagnostic,
  QuestionDiagnostic,
  ReponseLibre,
  ReponseMultiple,
  Thematique,
} from '../../../../diagnostic/Diagnostic';
import {
  DiagnosticDTO,
  RepresentationQuestionsThematiqueDTO,
} from './EntrepotDiagnosticPostgres';

export class TranscripteurDiagnosticVersRepresentation
  implements Transcripteur<Diagnostic, DiagnosticDTO>
{
  transcris(entite: Diagnostic): DiagnosticDTO {
    const referentiel: {
      [thematique: Thematique]: RepresentationQuestionsThematiqueDTO;
    } = Object.entries(entite.referentiel).reduce(
      (reducteur, [thematique, questions]) => ({
        ...reducteur,
        [thematique as Thematique]: {
          questions: questions.questions.map((question: QuestionDiagnostic) => {
            const reponseTranscrite = this.transcrisLaReponse(
              question.reponseDonnee.reponse,
              <E = Set<string>, S = string[]>(reponses: E) =>
                Array.from(reponses as Set<string>) as S,
            );
            if (reponseTranscrite) {
              return {
                ...question,
                reponseDonnee: {
                  ...question.reponseDonnee,
                  reponsesMultiples:
                    question.reponseDonnee.reponsesMultiples.map((rep) => ({
                      ...rep,
                      reponses: (<E = Set<string>, S = string[]>(reponses: E) =>
                        Array.from(reponses as Set<string>) as S)(rep.reponses),
                    })),
                  reponse: reponseTranscrite,
                },
              };
            }
            return {
              ...question,
              reponseDonnee: {
                ...question.reponseDonnee,
                reponsesMultiples: question.reponseDonnee.reponsesMultiples.map(
                  (rep) => ({
                    ...rep,
                    reponses: (<E = Set<string>, S = string[]>(reponses: E) =>
                      Array.from(reponses as Set<string>) as S)(rep.reponses),
                  }),
                ),
              },
            };
          }),
        },
      }),
      {},
    );
    return {
      id: entite.identifiant,
      donnees: { ...entite, referentiel },
    } as DiagnosticDTO;
  }

  private transcrisLaReponse(
    reponse: TypesDeReponse,
    transformeReponsesMultiples: <E, S>(reponses: E) => S,
  ) {
    if (this.estReponseMultiple(reponse)) {
      return {
        identifiant: reponse.identifiant,
        reponses: reponse.reponses.map((rep) => ({
          ...rep,
          reponses: transformeReponsesMultiples(rep.reponses),
        })),
      };
    }
    return reponse;
  }

  private estReponseMultiple(
    reponse: TypesDeReponse,
  ): reponse is ReponseMultiple {
    return (
      reponse !== null &&
      reponse !== undefined &&
      (reponse as ReponseMultiple).identifiant !== undefined &&
      (reponse as ReponseMultiple).reponses !== undefined &&
      (reponse as ReponseMultiple).reponses !== null
    );
  }
}

type TypesDeReponse =
  | string
  | ReponseLibre
  | ReponseMultiple
  | null
  | undefined;
