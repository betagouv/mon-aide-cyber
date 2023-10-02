import { describe, expect, it, afterEach } from "vitest";
import { EntrepotDiagnosticPostgres } from "../../../../src/infrastructure/entrepots/postgres/EntrepotsPostgres";
import { unDiagnostic } from "../../../constructeurs/constructeurDiagnostic";
import Knex from "knex";
import knexfile from "../../../../src/infrastructure/entrepots/postgres/knexfile";

class EntrepotsDiagnosticPostgresPourLesTests {
  private knex: any;
  constructor() {
    this.knex = Knex(knexfile);
  }
  async nettoie() {
    await this.knex("diagnostics").truncate();
  }
}

class EntrepotsPostgresPourLesTests {
  async nettoieLaBase() {
    await new EntrepotsDiagnosticPostgresPourLesTests().nettoie();
  }
}

describe("Entrepot Diagnostic Postgres", () => {
  afterEach(async () => {
    await new EntrepotsPostgresPourLesTests().nettoieLaBase();
  });
  it("persiste un diagnostic", async () => {
    const diagnostic = unDiagnostic().construis();

    await new EntrepotDiagnosticPostgres().persiste(diagnostic);

    const entrepotDiagnosticPostgresLecture =
      await new EntrepotDiagnosticPostgres();
    expect(
      await entrepotDiagnosticPostgresLecture.lis(diagnostic.identifiant),
    ).toStrictEqual(diagnostic);
  });
});
