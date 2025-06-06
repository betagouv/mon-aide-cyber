import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { EntiteAidee } from './commande';
import { EntrepotRelationRattrapage } from './EntrepotRelationRattrapagePostgres';

type ResultRattrapage = {
  nombreTotalDeRelations: number;
  nombreDeRelationsMisesAJour: number;
};

export const chiffreLesIdentifiantsDesEntitesAidesDansLesRelations = async (
  entrepotRelation: EntrepotRelationRattrapage,
  serviceDeChiffrement: ServiceDeChiffrement,
  entitesAidees: EntiteAidee[]
): Promise<ResultRattrapage> => {
  const lesTuplesEntites = entitesAidees.map((entite) => {
    return entrepotRelation.parIdentifiant(entite.id);
  });
  const tousLesTuplesEntitesAidees = await Promise.all(lesTuplesEntites);
  const resultat: ResultRattrapage = {
    nombreTotalDeRelations: tousLesTuplesEntitesAidees.length,
    nombreDeRelationsMisesAJour: 0,
  };

  const lesEntitesAideesPersistees = tousLesTuplesEntitesAidees.map(
    (entite) => {
      try {
        serviceDeChiffrement.dechiffre(entite.utilisateur.identifiant);
      } catch (__erreur) {
        entite.utilisateur.identifiant = serviceDeChiffrement.chiffre(
          entite.utilisateur.identifiant
        );
        resultat.nombreDeRelationsMisesAJour++;
        return entrepotRelation.persiste(entite);
      }
      return;
    }
  );
  await Promise.all(lesEntitesAideesPersistees);

  return resultat;
};
