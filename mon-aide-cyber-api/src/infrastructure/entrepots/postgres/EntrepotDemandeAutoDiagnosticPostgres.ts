import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import {
  DemandeAutoDiagnostic,
  EntrepotDemandeAutoDiagnostic,
} from '../../../auto-diagnostic/CapteurSagaLanceAutoDiagnostic';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

type DemandeAutoDiagnosticDTO = DTO & {
  donnees: { dateSignatureCGU: string };
};

export class EntrepotDemandeAutoDiagnosticPostgres
  extends EntrepotPostgres<DemandeAutoDiagnostic, DemandeAutoDiagnosticDTO>
  implements EntrepotDemandeAutoDiagnostic
{
  protected champsAMettreAJour(
    entiteDTO: DemandeAutoDiagnosticDTO
  ): Partial<DemandeAutoDiagnosticDTO> {
    return { donnees: entiteDTO.donnees };
  }
  protected nomTable(): string {
    return 'demandes-auto-diagnostic';
  }
  protected deEntiteADTO(
    entite: DemandeAutoDiagnostic
  ): DemandeAutoDiagnosticDTO {
    return {
      donnees: { dateSignatureCGU: entite.dateSignatureCGU.toISOString() },
      id: entite.identifiant,
    };
  }
  protected deDTOAEntite(dto: DemandeAutoDiagnosticDTO): DemandeAutoDiagnostic {
    return {
      dateSignatureCGU: FournisseurHorloge.enDate(dto.donnees.dateSignatureCGU),
      identifiant: dto.id,
    };
  }
}
