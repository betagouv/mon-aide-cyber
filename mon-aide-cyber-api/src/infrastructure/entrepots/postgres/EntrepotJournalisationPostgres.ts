import { DTO, EntrepotPostgres } from './EntrepotPostgres';
import {
  EntrepotEvenementJournal,
  Publication,
} from '../../../journalisation/Publication';
import crypto from 'crypto';

type PublicationDTO = DTO & {
  type: string;
  date: string;
  donnees: object;
};

const UUID_REGEX = new RegExp(
  '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
  'i'
);

export class EntrepotJournalisationPostgres
  extends EntrepotPostgres<Publication, PublicationDTO>
  implements EntrepotEvenementJournal
{
  protected deEntiteADTO(entite: Publication): PublicationDTO {
    return {
      donnees: Object.entries(entite.donnees).reduce(
        (prev, [clef, donnee]) => ({
          ...prev,
          [clef]: UUID_REGEX.test(donnee)
            ? crypto.createHash('sha256').update(donnee).digest('hex')
            : donnee,
        }),
        {}
      ),
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
