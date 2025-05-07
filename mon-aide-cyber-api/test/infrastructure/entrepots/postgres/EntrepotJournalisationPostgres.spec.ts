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

  avecLesDonnees(donnees: object): ConstructeurPublication {
    this.donnees = donnees;
    return this;
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
  const entrepotJournalisation = new EntrepotJournalisationPostgres(
    configurationJournalisation
  );
  const entrepotLecture = new EntrepotJournalisationPostgresTests(
    configurationJournalisation
  );

  afterEach(async () => {
    await nettoieLaBaseDeDonneesJournal();
  });

  it('persiste une publication', async () => {
    const publication = unePublication().construis();

    await entrepotJournalisation.persiste(publication);

    expect(await entrepotLecture.lis(publication.identifiant)).toStrictEqual(
      publication
    );
  });

  it('hashe les UUID présents dans le payload', async () => {
    const publication = unePublication()
      .avecLesDonnees({
        id1: '85319266-9752-409f-86c6-0dd0fb9bf91f',
        tableau: ['1', '2', '3'],
        objet1: {
          id2: '53a40fb9-1440-4086-bd13-d37c67240442',
          objet2: { id3: 'bb8475d2-1a69-4e8c-b636-84892f1013f9' },
          chaine: 'une-chaine',
          tableau: ['1', '2', '3'],
        },
      })
      .construis();

    await entrepotJournalisation.persiste(publication);

    expect(
      await entrepotLecture.lis(publication.identifiant)
    ).toStrictEqual<Publication>({
      identifiant: publication.identifiant,
      date: publication.date,
      type: publication.type,
      donnees: {
        id1: '84a0fec36f5c4ad7b30387ac267fdaff25c4fca87b9ad473d80f8608e8860a14',
        tableau: ['1', '2', '3'],
        objet1: {
          id2: 'caa61c8f3be62e7a8d0c1b53f815731be6b283d35d1d9387dae26cec156652b3',
          objet2: {
            id3: '01bc91195b06c8307528aab19e64839b807b993869a3b71a48786165ebe28b80',
          },
          chaine: 'une-chaine',
          tableau: ['1', '2', '3'],
        },
      },
    });
  });
});
