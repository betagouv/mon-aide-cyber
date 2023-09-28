import { Entrepots } from '../domaine/Entrepots';
import { EntrepotsMemoire } from '../infrastructure/entrepots/memoire/EntrepotsMemoire';
import { EntrepotsPostgres } from '../infrastructure/entrepots/postgres/EntrepotsPostgres';

export const fabriqueEntrepots = (): Entrepots => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    return new EntrepotsPostgres();
  }
  return new EntrepotsMemoire();
};
