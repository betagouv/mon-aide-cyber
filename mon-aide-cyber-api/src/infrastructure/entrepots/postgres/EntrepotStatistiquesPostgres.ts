import {
  EntrepotStatistiques,
  Statistiques,
} from '../../../statistiques/statistiques';
import knexfile from './knexfile';
import knex, { Knex } from 'knex';

type Count = { count: string };

export class EntrepotStatistiquesPostgres implements EntrepotStatistiques {
  protected readonly knex: Knex;

  constructor(configuration: Knex.Config = knexfile) {
    this.knex = knex(configuration);
  }

  async lis(): Promise<Statistiques> {
    const nombreAidants: Count = await this.knex
      .from('utilisateurs')
      .count({ count: '*' })
      .first();
    const nombreDiagnostics: Count = await this.knex
      .from('diagnostics')
      .count({ count: '*' })
      .first();
    return {
      identifiant: crypto.randomUUID(),
      nombreAidants: parseInt(nombreAidants.count),
      nombreDiagnostics: parseInt(nombreDiagnostics.count),
    };
  }
}
