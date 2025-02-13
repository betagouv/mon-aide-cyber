import { beforeEach, describe, expect, it } from 'vitest';
import knexfile from '../../../src/infrastructure/entrepots/postgres/knexfile';
import knex from 'knex';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { EntrepotDemandeAideLecturePostgres } from '../../../src/infrastructure/entrepots/postgres/EntrepotDemandeAideLecturePostgres';
import { DemandeAideSimple } from '../../../src/gestion-demandes/aide/DemandeAide';
import { nettoieLaBaseDeDonneesAides } from '../../utilitaires/nettoyeurBDD';

describe('Entrepot de lecture des demandes d’Aide', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesAides();
  });
  it('Récupère toutes les demandes', async () => {
    const dateDemande = FournisseurHorloge.maintenant();
    await knex(knexfile)
      .insert({
        id: crypto.randomUUID(),
        donnees: {
          dateSignatureCGU: dateDemande.toISOString(),
        },
      })
      .into('aides');

    const aides = await new EntrepotDemandeAideLecturePostgres().tous();

    expect(aides).toStrictEqual<DemandeAideSimple[]>([
      {
        identifiant: expect.any(String),
        dateSignatureCGU: dateDemande,
      },
    ]);
  });
});
