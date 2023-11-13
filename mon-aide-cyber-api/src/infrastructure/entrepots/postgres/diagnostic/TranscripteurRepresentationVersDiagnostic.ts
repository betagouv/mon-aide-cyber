import {
  DiagnosticDTO,
  RepresentationReponseMultipleDTO,
} from './EntrepotDiagnosticPostgres';
import {
  Diagnostic,
  ReponseLibre,
  Thematique,
} from '../../../../diagnostic/Diagnostic';
import { Transcripteur } from '../Transcripteur';

export class TranscripteurRepresentationVersDiagnostic
  implements Transcripteur<DiagnosticDTO, Diagnostic>
{
  transcris(dto: DiagnosticDTO): Diagnostic {
    const referentiel = Object.entries(dto.donnees.referentiel).reduce(
      (reducteur, [thematique, questions]) => ({
        ...reducteur,
        [thematique as Thematique]: {
          questions: questions.questions.map((question) => {
            const reponse = question.reponseDonnee;
            const reponseTranscrite = this.transcrisLaReponse(
              reponse.reponse,
              <E = string[], S = Set<string>>(reponses: E) =>
                new Set(reponses as string[]) as S,
            );
            if (reponseTranscrite) {
              return {
                ...question,
                reponseDonnee: {
                  reponseUnique: null,
                  reponse: reponseTranscrite,
                },
              };
            }
            const reponses =
              reponse.reponsesMultiples?.map((rep) => ({
                ...rep,
                reponses: (<E = string[], S = Set<string>>(reponses: E) =>
                  new Set(reponses as string[]) as S)(rep.reponses),
              })) || [];
            return {
              ...question,
              reponseDonnee: {
                reponseUnique: null,
                ...(reponses.length > 0 && {
                  reponse: {
                    identifiant: reponse.reponseUnique,
                    reponses,
                  },
                }),
              },
            };
          }),
        },
      }),
      {},
    );
    return { ...dto.donnees, referentiel: referentiel };
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
  ): reponse is RepresentationReponseMultipleDTO {
    return (
      reponse !== undefined &&
      reponse !== null &&
      (reponse as RepresentationReponseMultipleDTO).identifiant !== undefined &&
      (reponse as RepresentationReponseMultipleDTO).reponses !== undefined &&
      (reponse as RepresentationReponseMultipleDTO).reponses !== null
    );
  }
}

type TypesDeReponse =
  | string
  | null
  | ReponseLibre
  | RepresentationReponseMultipleDTO
  | undefined;
