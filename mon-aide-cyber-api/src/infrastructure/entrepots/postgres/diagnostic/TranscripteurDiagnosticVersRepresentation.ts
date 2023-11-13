import { Transcripteur } from '../Transcripteur';
import {
  Diagnostic,
  estReponseMultiple,
  QuestionDiagnostic,
  Thematique,
  TypesDeReponseDonnee,
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
                  reponse: reponseTranscrite,
                },
              };
            }
            return {
              ...question,
              reponseDonnee: {
                ...question.reponseDonnee,
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
    reponse: TypesDeReponseDonnee,
    transformeReponsesMultiples: <E, S>(reponses: E) => S,
  ) {
    if (estReponseMultiple(reponse)) {
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
}
