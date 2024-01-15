import { knex, Knex } from 'knex';
import knexfile from '../../src/infrastructure/entrepots/postgres/knexfile';

class EntrepotsPostgresPourLesTests {
  private knex: Knex;

  constructor() {
    this.knex = knex(knexfile);
  }
  async nettoieDiagnostics() {
    await this.knex('diagnostics').truncate();
  }

  async nettoieJournal() {
    await this.knex('journal_mac.evenements').truncate();
  }

  async nettoieAidants() {
    await this.knex('utilisateurs').truncate();
  }
}

export const nettoieLaBaseDeDonneesAidants = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieAidants();
  }
};

export const nettoieLaBaseDeDonneesJournal = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieJournal();
  }
};

export const nettoieLaBaseDeDonneesDiagnostics = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieDiagnostics();
  }
};
