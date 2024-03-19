import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import {
  EntrepotEvenementJournal,
  Publication,
} from '../../../journalisation/Publication';

type PublicationDTO = DTO & {
  type: string;
  date: string;
  donnees: object;
};

export class EntrepotJournalisationPostgres
  extends EntrepotPostgres<Publication, PublicationDTO>
  implements EntrepotEvenementJournal
{
  protected deEntiteADTO(entite: Publication): PublicationDTO {
    return {
      donnees: entite.donnees,
      type: entite.type,
      date: entite.date.toISOString(),
      id: entite.identifiant,
    };
  }

  protected nomTable(): string {
    return 'journal_mac.evenements';
  }

  protected deDTOAEntite(__dto: PublicationDTO): Publication {
    throw new Error('non implémenté');
  }

  protected champsAMettreAJour(__dto: PublicationDTO): Partial<PublicationDTO> {
    throw new Error('non implémenté');
  }
}
