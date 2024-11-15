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
    await this.knex('aidants').truncate();
  }

  async nettoieUtilisateurs() {
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

  async nettoieDemandeAutoDiagnostic() {
    await this.knex('demandes-auto-diagnostic').truncate();
  }
}

const entrepotsPostgresPourLesTests = new EntrepotsPostgresPourLesTests();

export const nettoieLaBaseDeDonneesAidants = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await entrepotsPostgresPourLesTests.nettoieAidants();
  }
};

export const nettoieLaBaseDeDonneesUtilisateurs = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await entrepotsPostgresPourLesTests.nettoieUtilisateurs();
  }
};

export const nettoieLaBaseDeDonneesAides = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await entrepotsPostgresPourLesTests.nettoieAides();
  }
};

export const nettoieLaBaseDeDonneesJournal = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await entrepotsPostgresPourLesTests.nettoieJournal();
  }
};

export const nettoieLaBaseDeDonneesDiagnostics = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await entrepotsPostgresPourLesTests.nettoieDiagnostics();
  }
};

export const nettoieLaBaseDeDonneesRelations = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await entrepotsPostgresPourLesTests.nettoieRelations();
  }
};

export const nettoieLaBaseDeDonneesDemandeDevenirAidant = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await entrepotsPostgresPourLesTests.nettoieDemandeDevenirAidant();
  }
};

export const nettoieLaBaseDeDonneesDemandeAutoDiagnostic = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await entrepotsPostgresPourLesTests.nettoieDemandeAutoDiagnostic();
  }
};

export const nettoieLaBaseDeDonneesStatistiques = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieRelations();
    await new EntrepotsPostgresPourLesTests().nettoieAidants();
    await new EntrepotsPostgresPourLesTests().nettoieDiagnostics();
  }
};
