import { Knex } from 'knex';
import crypto from 'crypto';
import { RepresentationDiagnostic } from '../EntrepotDiagnosticPostgres';

export async function up(knex: Knex): Promise<void | number[]> {
  return knex('diagnostics').then((lignes: { id: crypto.UUID; donnees: RepresentationDiagnostic }[]) => {
    const misesAJour = lignes.map((ligne) => {
      if (ligne.donnees.identifiant === 'b2f7fc0a-00c6-42bd-a8cc-0f5eeb6f5bd1') {
        ligne.donnees.dateCreation = '2023-11-20T12:00:00+01:00';
        ligne.donnees.dateDerniereModification = '2023-11-20T12:00:00+01:00';
      } else {
        ligne.donnees.dateCreation = new Date().toISOString();
        ligne.donnees.dateDerniereModification = new Date().toISOString();
      }
      return knex('diagnostics').where('id', ligne.id).update({
        donnees: ligne.donnees,
      });
    });
    return Promise.all(misesAJour);
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__: Knex): Promise<void> {}
