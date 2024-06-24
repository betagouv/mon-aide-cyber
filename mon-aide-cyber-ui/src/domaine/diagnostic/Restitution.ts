import { ReponseHATEOAS } from '../Lien.ts';

export type Restitution = ReponseHATEOAS & {
  autresMesures: string;
  contactsEtLiensUtiles: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
  ressources: string;
};
