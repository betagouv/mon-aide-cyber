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
      .from('aidants')
      .count({ count: '*' })
      .first();
    const nombreDiagnostics: Count = await this.knex
      .raw(
        `SELECT COUNT(avec_departements)
         FROM (SELECT id, jsonb_path_query(donnees -> 'referentiel' -> 'contexte', '$.questions[*]\\?(@.identifiant == "contexte-departement-tom-siege-social").reponseDonnee\\?(@.reponseUnique != null)')
               FROM diagnostics d) AS avec_departements
         WHERE avec_departements.id::text IN (SELECT donnees -> 'objet' ->> 'identifiant' FROM relations as id);
        `
      )
      .then(({ rows }: { rows: Count[] }) => {
        return rows[0] !== undefined ? rows[0] : { count: '0' };
      });
    return {
      identifiant: crypto.randomUUID(),
      nombreAidants: parseInt(nombreAidants.count),
      nombreDiagnostics: parseInt(nombreDiagnostics.count),
    };
  }
}
