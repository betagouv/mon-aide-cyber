import { LettreSecteur } from '../../../src/api/recherche-entreprise/equivalenceSecteursActivite';

type APIEntreprise = {
  nom_complet: string;
  siege: { siret: string; departement: string; libelle_commune: string };
  complements: { est_association: boolean; est_service_public: boolean };
  section_activite_principale: LettreSecteur;
};
export type ReponseAPIRechercheEntreprise = {
  results: APIEntreprise[];
};
