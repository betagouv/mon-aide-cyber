import { Entrepots } from "../../../domaine/Entrepots";
import { Diagnostic, EntrepotDiagnostic } from "../../../diagnostic/Diagnostic";
import { Aggregat } from "../../../domaine/Aggregat";
import { Entrepot } from "../../../domaine/Entrepot";
import Knex from "knex";
import knexfile from "./knexfile";

abstract class EntrepotPostgres<T extends Aggregat> implements Entrepot<T> {
  private knex: any;

  constructor() {
    this.knex = Knex(knexfile);
  }

  lis(identifiant: string): Promise<T> {
    return this.knex
      .from(this.nomTable())
      .where("id", identifiant)
      .first()
      .then((ligne: { id: string; donnees: object }) => ligne.donnees as T);
  }

  async persiste(entite: T): Promise<void> {
    return await this.knex(this.nomTable()).insert({
      id: entite.identifiant,
      donnees: entite,
    });
  }

  tous(): Promise<T[]> {
    return Promise.resolve([]);
  }

  typeAggregat(): string {
    throw new Error("Non implémenté");
  }

  protected abstract nomTable(): string;
}

export class EntrepotDiagnosticPostgres
  extends EntrepotPostgres<Diagnostic>
  implements EntrepotDiagnostic
{
  typeAggregat(): string {
    return "Diagnostic";
  }

  protected nomTable(): string {
    return "diagnostics";
  }
}

export class EntrepotsPostgres implements Entrepots {
  private readonly entrepotDiagnostic = new EntrepotDiagnosticPostgres();

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }
}
