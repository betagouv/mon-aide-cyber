import { Entrepots } from '../domaine/Entrepots';
import { EntrepotsMemoire } from '../infrastructure/entrepots/memoire/EntrepotsMemoire';
import { EntrepotsMAC } from '../infrastructure/entrepots/postgres/EntrepotsMAC';

export const fabriqueEntrepots = (): Entrepots => {
  if (process.env.URL_SERVEUR_BASE_DONNEES) {
    return new EntrepotsMAC();
  }
  return new EntrepotsMemoire();
};
