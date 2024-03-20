import {
  Diagnostic,
  EntrepotDiagnostic,
  QuestionDiagnostic,
  QuestionsThematique,
  ReponseDonnee,
  ReponsesMultiples,
  Thematique,
} from '../../../diagnostic/Diagnostic';
import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

export type DiagnosticDTO = DTO & {
  donnees: object;
};
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
      <E = Set<string>, S = string[]>(reponses: E) => Array.from(reponses as Set<string>) as S,
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
      <E = string[], S = Set<string>>(reponses: E) => new Set(reponses as string[]) as S,
    );
    return {
      ...diagnosticDTO,
      dateCreation: FournisseurHorloge.enDate(diagnosticDTO.dateCreation),
      dateDerniereModification: FournisseurHorloge.enDate(diagnosticDTO.dateDerniereModification),
      referentiel: referentiel,
    } as Diagnostic;
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
          questions: questions.questions.map((question: QuestionDiagnostic | RepresentationQuestionDiagnostic) => ({
            ...question,
            reponseDonnee: {
              ...question.reponseDonnee,
              reponsesMultiples: question.reponseDonnee.reponsesMultiples.map((rep) => ({
                ...rep,
                reponses: transformeReponsesMultiples(rep.reponses),
              })),
            },
          })),
        },
      }),
      {},
    );
  }
}

type RepresentationReponsesMultiples = Omit<ReponsesMultiples, 'reponses'> & {
  reponses: string[];
};
type ReponseDonneeDTO = Omit<ReponseDonnee, 'reponsesMultiples'> & {
  reponsesMultiples: RepresentationReponsesMultiples[];
};
type RepresentationQuestionDiagnostic = Omit<QuestionDiagnostic, 'reponseDonnee'> & {
  reponseDonnee: ReponseDonneeDTO;
};
type RepresentationQuestionsThematique = Omit<QuestionsThematique, 'questions'> & {
  questions: RepresentationQuestionDiagnostic[];
};
type RepresentationReferentielDiagnostic = {
  [thematique: Thematique]: RepresentationQuestionsThematique;
};
export type RepresentationDiagnostic = Omit<Diagnostic, 'referentiel' | 'dateCreation' | 'dateDerniereModification'> & {
  dateCreation: string;
  dateDerniereModification: string;
  referentiel: RepresentationReferentielDiagnostic;
};
