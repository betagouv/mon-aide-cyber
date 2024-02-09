import { ReponseHATEOAS } from '../Actions.ts';

export type Restitution = ReponseHATEOAS & {
  autresMesures: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
};
