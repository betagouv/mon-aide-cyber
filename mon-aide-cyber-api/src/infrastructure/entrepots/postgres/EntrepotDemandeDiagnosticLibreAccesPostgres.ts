import { DTO, EntrepotEcriturePostgres } from './EntrepotPostgres';
import {
  DemandeDiagnosticLibreAcces,
  EntrepotDemandeDiagnosticLibreAcces,
} from '../../../diagnostic-libre-acces/CapteurSagaLanceDiagnosticLibreAcces';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

type DemandeDiagnosticLibreAccesDTO = DTO & {
  donnees: { dateSignatureCGU: string };
};

export class EntrepotDemandeDiagnosticLibreAccesPostgres
  extends EntrepotEcriturePostgres<
    DemandeDiagnosticLibreAcces,
    DemandeDiagnosticLibreAccesDTO
  >
  implements EntrepotDemandeDiagnosticLibreAcces
{
  protected champsAMettreAJour(
    entiteDTO: DemandeDiagnosticLibreAccesDTO
  ): Partial<DemandeDiagnosticLibreAccesDTO> {
    return { donnees: entiteDTO.donnees };
  }
  protected nomTable(): string {
    return 'demandes-auto-diagnostic';
  }
  protected deEntiteADTO(
    entite: DemandeDiagnosticLibreAcces
  ): DemandeDiagnosticLibreAccesDTO {
    return {
      donnees: { dateSignatureCGU: entite.dateSignatureCGU.toISOString() },
      id: entite.identifiant,
    };
  }
  protected deDTOAEntite(
    dto: DemandeDiagnosticLibreAccesDTO
  ): DemandeDiagnosticLibreAcces {
    return {
      dateSignatureCGU: FournisseurHorloge.enDate(dto.donnees.dateSignatureCGU),
      identifiant: dto.id,
    };
  }
}
