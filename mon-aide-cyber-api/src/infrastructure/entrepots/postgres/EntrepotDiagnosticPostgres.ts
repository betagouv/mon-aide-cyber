import {
  Diagnostic,
  EntrepotDiagnostic,
  QuestionDiagnostic,
  QuestionsThematique,
  ReponseDonnee,
  ReponseLibre,
  ReponseMultiple,
  ReponsesMultiples,
  Thematique,
} from '../../../diagnostic/Diagnostic';
import { DTO, EntrepotPostgres } from './EntrepotPostgres';

export type DiagnosticDTO = DTO & {
  donnees: object;
};
type TousTypesDeReponse =
  | string
  | ReponseLibre
  | ReponseMultiple
  | null
  | (string & ReponseLibre)
  | (string & RepresentationReponseMultiple)
  | (ReponseLibre & string)
  | (ReponseLibre & RepresentationReponseMultiple)
  | (ReponseLibre & null)
  | (ReponseMultiple & string)
  | (ReponseMultiple & ReponseLibre)
  | (ReponseMultiple & RepresentationReponseMultiple)
  | (ReponseMultiple & null)
  | (null & ReponseLibre)
  | (null & RepresentationReponseMultiple)
  | undefined;

type TypeReponseMultiple = ReponseMultiple & RepresentationReponseMultiple;

export class EntrepotDiagnosticPostgres
  extends EntrepotPostgres<Diagnostic, DiagnosticDTO>
  implements EntrepotDiagnostic
{
  typeAggregat(): string {
    return 'diagnostic';
  }

  protected nomTable(): string {
    return 'diagnostics';
  }

  protected deEntiteADTO(entite: Diagnostic): DiagnosticDTO {
    const referentiel: {
      [thematique: Thematique]: RepresentationQuestionsThematique;
    } = this.transcris(
      entite,
      <E = Set<string>, S = string[]>(reponses: E) =>
        Array.from(reponses as Set<string>) as S,
    );
    return {
      id: entite.identifiant,
      donnees: { ...entite, referentiel },
    } as DiagnosticDTO;
  }

  protected deDTOAEntite(dto: DiagnosticDTO): Diagnostic {
    const diagnosticDTO = dto.donnees as RepresentationDiagnostic;
    const referentiel = this.transcris(
      diagnosticDTO,
      <E = string[], S = Set<string>>(reponses: E) =>
        new Set(reponses as string[]) as S,
    );
    return { ...diagnosticDTO, referentiel: referentiel } as Diagnostic;
  }

  protected champsAMettreAJour(entiteDTO: DiagnosticDTO): { donnees: object } {
    return { donnees: entiteDTO.donnees };
  }

  private transcris(
    entite: Diagnostic | RepresentationDiagnostic,
    transformeReponsesMultiples: <E, S>(reponses: E) => S,
  ) {
    return Object.entries(entite.referentiel).reduce(
      (reducteur, [thematique, questions]) => ({
        ...reducteur,
        [thematique as Thematique]: {
          questions: questions.questions.map(
            (
              question: QuestionDiagnostic | RepresentationQuestionDiagnostic,
            ) => {
              const reponseTranscrite = this.transcrisLaReponse(
                question.reponseDonnee.reponse,
                transformeReponsesMultiples,
              );
              if (reponseTranscrite) {
                return {
                  ...question,
                  reponseDonnee: {
                    ...question.reponseDonnee,
                    reponsesMultiples:
                      question.reponseDonnee.reponsesMultiples.map((rep) => ({
                        ...rep,
                        reponses: transformeReponsesMultiples(rep.reponses),
                      })),
                    reponse: reponseTranscrite,
                  },
                };
              }
              return {
                ...question,
                reponseDonnee: {
                  ...question.reponseDonnee,
                  reponsesMultiples:
                    question.reponseDonnee.reponsesMultiples.map((rep) => ({
                      ...rep,
                      reponses: transformeReponsesMultiples(rep.reponses),
                    })),
                },
              };
            },
          ),
        },
      }),
      {},
    );
  }

  private transcrisLaReponse(
    reponse: TousTypesDeReponse,
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
    reponse: TousTypesDeReponse,
  ): reponse is TypeReponseMultiple {
    return (
      reponse !== undefined &&
      (reponse as TypeReponseMultiple).identifiant !== undefined &&
      (reponse as TypeReponseMultiple).reponses !== undefined &&
      (reponse as TypeReponseMultiple).reponses !== null
    );
  }
}

type RepresentationReponsesMultiples = Omit<ReponsesMultiples, 'reponses'> & {
  reponses: string[];
};
type RepresentationReponseMultiple = Omit<ReponseMultiple, 'reponses'> & {
  reponses: RepresentationReponsesMultiples[];
};
type ReponseDonneeDTO = Omit<ReponseDonnee, 'reponsesMultiples'> & {
  reponsesMultiples: RepresentationReponsesMultiples[];
  reponse: string | ReponseLibre | RepresentationReponseMultiple | null;
};
type RepresentationQuestionDiagnostic = Omit<
  QuestionDiagnostic,
  'reponseDonnee'
> & {
  reponseDonnee: ReponseDonneeDTO;
};
type RepresentationQuestionsThematique = Omit<
  QuestionsThematique,
  'questions'
> & {
  questions: RepresentationQuestionDiagnostic[];
};
type RepresentationReferentielDiagnostic = {
  [thematique: Thematique]: RepresentationQuestionsThematique;
};
type RepresentationDiagnostic = Omit<Diagnostic, 'referentiel'> & {
  referentiel: RepresentationReferentielDiagnostic;
};
