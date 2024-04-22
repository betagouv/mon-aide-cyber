import { EntrepotRelation } from '../EntrepotRelation';
import { EntrepotRelationPostgres } from './EntrepotRelationPostgres';
import { EntrepotRelationMemoire } from './EntrepotRelationMemoire';

export function fabriqueEntrepotRelations(): EntrepotRelation {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    return new EntrepotRelationPostgres();
  }
  return new EntrepotRelationMemoire();
}
