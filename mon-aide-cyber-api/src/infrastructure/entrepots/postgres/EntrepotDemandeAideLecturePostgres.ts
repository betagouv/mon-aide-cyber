import { DTO, EntrepotLecturePostgres } from './EntrepotPostgres';
import {
  DemandeAideSimple,
  EntrepotDemandeAideLecture,
} from '../../../gestion-demandes/aide/DemandeAide';
import { FournisseurHorloge } from '../../horloge/FournisseurHorloge';

type DemandeAideSimpleDTO = DTO & {
  donnees: { dateSignatureCGU: string };
};

export class EntrepotDemandeAideLecturePostgres
  extends EntrepotLecturePostgres<DemandeAideSimple, DemandeAideSimpleDTO>
  implements EntrepotDemandeAideLecture
{
  protected nomTable(): string {
    return 'aides';
  }

  protected deDTOAEntite(dto: DemandeAideSimpleDTO): DemandeAideSimple {
    return {
      identifiant: dto.id,
      dateSignatureCGU: FournisseurHorloge.enDate(dto.donnees.dateSignatureCGU),
    };
  }
}
