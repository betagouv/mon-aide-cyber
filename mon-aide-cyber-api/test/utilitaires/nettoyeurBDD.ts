import { knex, Knex } from 'knex';
import knexfile from '../../src/infrastructure/entrepots/postgres/knexfile';

class EntrepotsPostgresPourLesTests {
  private knex: Knex;

  constructor() {
    this.knex = knex(knexfile);
  }

  async nettoie() {
    await this.knex('diagnostics').truncate();
    await this.knex('journal_mac.evenements').truncate();
    await this.knex('utilisateurs').truncate();
  }
}

export const nettoieLaBaseDeDonnees = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoie();
  }
};
