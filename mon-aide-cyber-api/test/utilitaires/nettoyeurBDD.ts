import { knex, Knex } from "knex";
import knexfile from "../../src/infrastructure/entrepots/postgres/knexfile";

class EntrepotsPostgresPourLesTests {
  async nettoieLaBase() {
    await new EntrepotsDiagnosticPostgresPourLesTests().nettoie();
  }
}

class EntrepotsDiagnosticPostgresPourLesTests {
  private knex: Knex;

  constructor() {
    this.knex = knex(knexfile);
  }

  async nettoie() {
    await this.knex("diagnostics").truncate();
  }
}

export const nettoieLaBaseDeDonnees = async () => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    await new EntrepotsPostgresPourLesTests().nettoieLaBase();
  }
};
