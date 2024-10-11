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

  async nettoieAides() {
    await this.knex('aides').truncate();
  }

  async nettoieRelations() {
    await this.knex('relations').truncate();
  }

  async nettoieDemandeDevenirAidant() {
    await this.knex('demandes-devenir-aidant').truncate();
  }
}

export const nettoieLaBaseDeDonneesAidants = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieAidants();
  }
};

export const nettoieLaBaseDeDonneesAides = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieAides();
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

export const nettoieLaBaseDeDonneesRelations = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieRelations();
  }
};

export const nettoieLaBaseDeDonneesDemandeDevenirAidant = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieDemandeDevenirAidant();
  }
};

export const nettoieLaBaseDeDonneesStatistiques = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieRelations();
    await new EntrepotsPostgresPourLesTests().nettoieAidants();
    await new EntrepotsPostgresPourLesTests().nettoieDiagnostics();
  }
};
