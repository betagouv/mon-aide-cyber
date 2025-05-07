import { DTO, EntrepotEcriturePostgres } from './EntrepotPostgres';
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

const estUnObjet = (objet: object): objet is object => {
  return typeof objet === 'object' && !Array.isArray(objet);
};

export class EntrepotJournalisationPostgres
  extends EntrepotEcriturePostgres<Publication, PublicationDTO>
  implements EntrepotEvenementJournal
{
  protected deEntiteADTO(entite: Publication): PublicationDTO {
    const genereLesHashe = (donnee: object): object => {
      return Object.entries(donnee).reduce((precedent: any, [clef, valeur]) => {
        if (estUnObjet(valeur)) {
          precedent[clef] = genereLesHashe(valeur);
        } else {
          precedent[clef] = UUID_REGEX.test(valeur)
            ? crypto.createHash('sha256').update(valeur).digest('hex')
            : valeur;
        }
        return precedent;
      }, {});
    };

    const donnees = Object.entries(entite.donnees).reduce(
      (prev, [clef, donnee]) => {
        let objet = undefined;
        if (estUnObjet(donnee)) {
          objet = genereLesHashe(donnee);
        }
        const resultat = UUID_REGEX.test(donnee)
          ? crypto.createHash('sha256').update(donnee).digest('hex')
          : objet
            ? objet
            : donnee;
        return {
          ...prev,
          [clef]: resultat,
        };
      },
      {}
    );
    return {
      donnees: donnees,
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
