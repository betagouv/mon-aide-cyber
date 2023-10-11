import { Entrepots } from '../../../domaine/Entrepots';
import { Diagnostic, EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { Aggregat, AggregatNonTrouve } from '../../../domaine/Aggregat';
import { Entrepot } from '../../../domaine/Entrepot';
import { knex, Knex } from 'knex';
import knexfile from './knexfile';

abstract class EntrepotPostgres<T extends Aggregat> implements Entrepot<T> {
  private knex: Knex;

  constructor() {
    this.knex = knex(knexfile);
  }

  lis(identifiant: string): Promise<T> {
    return this.knex
      .from(this.nomTable())
      .where('id', identifiant)
      .first()
      .then((ligne: { id: string; donnees: object }) => ligne.donnees as T)
      .catch(() => {
        throw new AggregatNonTrouve(this.typeAggregat());
      });
  }

  async persiste(entite: T): Promise<void> {
    const diagnosticExistant = await this.knex
      .from(this.nomTable())
      .where('id', entite.identifiant)
      .first();
    if (!diagnosticExistant) {
      await this.knex(this.nomTable()).insert({
        id: entite.identifiant,
        donnees: entite,
      });
    } else {
      await this.knex(this.nomTable())
        .where('id', entite.identifiant)
        .update({ donnees: entite });
    }
  }

  async tous(): Promise<T[]> {
    return this.knex
      .from(this.nomTable())
      .then((lignes) => lignes.map((ligne) => ligne.donnees as T));
  }

  typeAggregat(): string {
    throw new Error('Non implémenté');
  }

  protected abstract nomTable(): string;
}

export class EntrepotDiagnosticPostgres
  extends EntrepotPostgres<Diagnostic>
  implements EntrepotDiagnostic
{
  typeAggregat(): string {
    return 'diagnostic';
  }

  protected nomTable(): string {
    return 'diagnostics';
  }
}

export class EntrepotsPostgres implements Entrepots {
  private readonly entrepotDiagnostic = new EntrepotDiagnosticPostgres();

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }
}
