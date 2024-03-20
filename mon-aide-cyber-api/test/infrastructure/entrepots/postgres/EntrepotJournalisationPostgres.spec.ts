import { afterEach, describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonneesJournal } from '../../../utilitaires/nettoyeurBDD';
import { Publication } from '../../../../src/journalisation/Publication';
import { faker } from '@faker-js/faker';
import crypto from 'crypto';
import configurationJournalisation from '../../../../src/infrastructure/entrepots/postgres/configurationJournalisation';
import { EntrepotJournalisationPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotJournalisationPostgres';
import { DTO } from '../../../../src/infrastructure/entrepots/postgres/EntrepotPostgres';

class ConstructeurPublication {
  private date = new Date();
  private donnees = {};
  private identifiant = crypto.randomUUID();
  private type = faker.string.alpha(10);

  construis(): Publication {
    return {
      date: this.date,
      donnees: this.donnees,
      identifiant: this.identifiant,
      type: this.type,
    };
  }
}

function unePublication() {
  return new ConstructeurPublication();
}

type PublicationDTO = DTO & {
  type: string;
  date: string;
  donnees: object;
};

class EntrepotJournalisationPostgresTests extends EntrepotJournalisationPostgres {
  protected deDTOAEntite(dto: PublicationDTO): Publication {
    return {
      donnees: dto.donnees,
      type: dto.type,
      date: new Date(dto.date),
      identifiant: dto.id,
    };
  }
}

describe('Entrepot Journalisation Postgres', () => {
  afterEach(async () => {
    await nettoieLaBaseDeDonneesJournal();
  });

  it('persiste une publication', async () => {
    const publication = unePublication().construis();

    await new EntrepotJournalisationPostgres(configurationJournalisation).persiste(publication);

    const entrepotJournalisationPostgresLecture = new EntrepotJournalisationPostgresTests(configurationJournalisation);

    expect(await entrepotJournalisationPostgresLecture.lis(publication.identifiant)).toStrictEqual(publication);
  });
});
