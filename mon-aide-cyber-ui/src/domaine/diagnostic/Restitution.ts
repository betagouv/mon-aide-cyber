import { ReponseHATEOAS } from '../Lien.ts';

export type Restitution = ReponseHATEOAS & {
  autresMesures: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
};
