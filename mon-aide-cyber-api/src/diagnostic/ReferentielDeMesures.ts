export type NiveauMesure = {
  titre: string;
  pourquoi: string;
  comment: string;
};
export type ReferentielDeMesure = {
  niveau1: NiveauMesure;
  niveau2?: NiveauMesure;
  priorisation: number;
};
export type ReferentielDeMesures = {
  [identifiantQuestion: string]: ReferentielDeMesure;
};
