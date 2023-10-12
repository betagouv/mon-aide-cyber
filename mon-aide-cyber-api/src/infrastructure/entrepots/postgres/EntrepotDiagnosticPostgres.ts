import {
  Diagnostic,
  EntrepotDiagnostic,
  QuestionDiagnostic,
  QuestionsThematique,
  ReponseDonnee,
  ReponsesMultiples,
  Thematique,
} from "../../../diagnostic/Diagnostic";
import { DTO, EntrepotPostgres } from "./EntrepotPostgres";

export class EntrepotDiagnosticPostgres
  extends EntrepotPostgres<Diagnostic>
  implements EntrepotDiagnostic
{
  typeAggregat(): string {
    return "diagnostic";
  }

  protected nomTable(): string {
    return "diagnostics";
  }

  protected deEntiteADTO<D = DiagnosticDTO>(entite: Diagnostic): D {
    const referentiel: { [thematique: Thematique]: QuestionsThematiqueDTO } =
      this.transcris(
        entite,
        <E = Set<string>, S = string[]>(reponses: E) =>
          Array.from(reponses as Set<string>) as S,
      );
    return { ...entite, referentiel } as D;
  }

  protected deDTOAEntite<D extends DTO = DiagnosticDTO>(dto: D): Diagnostic {
    const diagnosticDTO = dto as unknown as DiagnosticDTO;
    const referentiel = this.transcris(
      diagnosticDTO,
      <E = string[], S = Set<string>>(reponses: E) =>
        new Set(reponses as string[]) as S,
    );
    return { ...diagnosticDTO, referentiel: referentiel } as Diagnostic;
  }

  private transcris(
    entite: Diagnostic | DiagnosticDTO,
    transformeReponsesMultiples: <E, S>(reponses: E) => S,
  ) {
    return Object.entries(entite.referentiel).reduce(
      (reducteur, [thematique, questions]) => ({
        ...reducteur,
        [thematique as Thematique]: {
          questions: questions.questions.map(
            (question: QuestionDiagnostic | QuestionDiagnosticDTO) => ({
              ...question,
              reponseDonnee: {
                ...question.reponseDonnee,
                reponsesMultiples: question.reponseDonnee.reponsesMultiples.map(
                  (rep) => ({
                    ...rep,
                    reponses: transformeReponsesMultiples(rep.reponses),
                  }),
                ),
              },
            }),
          ),
        },
      }),
      {},
    );
  }
}

type ReponsesMultiplesDTO = Omit<ReponsesMultiples, "reponses"> & {
  reponses: string[];
};
type ReponseDonneeDTO = Omit<ReponseDonnee, "reponsesMultiples"> & {
  reponsesMultiples: ReponsesMultiplesDTO[];
};
type QuestionDiagnosticDTO = Omit<QuestionDiagnostic, "reponseDonnee"> & {
  reponseDonnee: ReponseDonneeDTO;
};
type QuestionsThematiqueDTO = Omit<QuestionsThematique, "questions"> & {
  questions: QuestionDiagnosticDTO[];
};
type ReferentielDiagnosticDTO = {
  [thematique: Thematique]: QuestionsThematiqueDTO;
};
type DiagnosticDTO = DTO &
  Omit<Diagnostic, "referentiel"> & {
    referentiel: ReferentielDiagnosticDTO;
  };
