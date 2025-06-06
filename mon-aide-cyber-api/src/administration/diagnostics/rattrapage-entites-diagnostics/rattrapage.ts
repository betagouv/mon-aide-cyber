import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { EntiteAidee } from './commande';
import { EntrepotRelationRattrapage } from './EntrepotRelationRattrapagePostgres';

export const chiffreLesIdentifiantsDesEntitesAidesDansLesRelations = async (
  entrepotRelation: EntrepotRelationRattrapage,
  serviceDeChiffrement: ServiceDeChiffrement,
  entitesAidees: EntiteAidee[]
): Promise<void> => {
  const lesTuplesEntites = entitesAidees.map((entite) => {
    return entrepotRelation.parIdentifiant(entite.id);
  });
  const tousLesTuplesEntitesAidees = await Promise.all(lesTuplesEntites);
  const lesEntitesAideesPersistees = tousLesTuplesEntitesAidees.map(
    (entite) => {
      try {
        serviceDeChiffrement.dechiffre(entite.utilisateur.identifiant);
      } catch (__erreur) {
        entite.utilisateur.identifiant = serviceDeChiffrement.chiffre(
          entite.utilisateur.identifiant
        );
        return entrepotRelation.persiste(entite);
      }
      return;
    }
  );
  await Promise.all(lesEntitesAideesPersistees);

  return Promise.resolve();
};
