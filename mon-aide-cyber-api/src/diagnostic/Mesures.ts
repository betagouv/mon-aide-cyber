export type NiveauMesure = {
  titre: string;
  pourquoi: string;
  comment: string;
};
export type ObjetMesure = {
  niveau1: NiveauMesure;
  niveau2?: NiveauMesure;
  priorisation: number;
};
export type Mesures = {
  [identifiantQuestion: string]: ObjetMesure;
};
