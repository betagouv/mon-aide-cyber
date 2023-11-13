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
} from '../../../../diagnostic/Diagnostic';
import { DTO, EntrepotPostgres } from '../EntrepotPostgres';

import { TranscripteurRepresentationVersDiagnostic } from './TranscripteurRepresentationVersDiagnostic';
import { TranscripteurDiagnosticVersRepresentation } from './TranscripteurDiagnosticVersRepresentation';

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
    return new TranscripteurDiagnosticVersRepresentation().transcris(entite);
  }

  protected deDTOAEntite(dto: DiagnosticDTO): Diagnostic {
    return new TranscripteurRepresentationVersDiagnostic().transcris(dto);
  }
  protected champsAMettreAJour(entiteDTO: DiagnosticDTO): {
    donnees: RepresentationDiagnosticDTO;
  } {
    return { donnees: entiteDTO.donnees };
  }
}
export type DiagnosticDTO = DTO & {
  donnees: RepresentationDiagnosticDTO;
};

export type RepresentationReponsesMultiplesDTO = Omit<
  ReponsesMultiples,
  'reponses'
> & {
  reponses: string[];
};
export type RepresentationReponseMultipleDTO = Omit<
  ReponseMultiple,
  'reponses'
> & {
  reponses: RepresentationReponsesMultiplesDTO[];
};
type ReponseDonneeDTO = ReponseDonnee & {
  reponsesMultiples?: RepresentationReponsesMultiplesDTO[];
  reponse?:
    | string
    | ReponseLibre
    | RepresentationReponseMultipleDTO
    | null
    | undefined;
};
export type RepresentationQuestionDiagnosticDTO = Omit<
  QuestionDiagnostic,
  'reponseDonnee'
> & {
  reponseDonnee: ReponseDonneeDTO;
};
export type RepresentationQuestionsThematiqueDTO = Omit<
  QuestionsThematique,
  'questions'
> & {
  questions: RepresentationQuestionDiagnosticDTO[];
};
export type RepresentationReferentielDiagnosticDTO = {
  [thematique: Thematique]: RepresentationQuestionsThematiqueDTO;
};
type RepresentationDiagnosticDTO = Omit<Diagnostic, 'referentiel'> & {
  referentiel: RepresentationReferentielDiagnosticDTO;
};
