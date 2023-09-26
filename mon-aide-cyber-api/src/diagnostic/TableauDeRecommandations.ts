export type NiveauDeRecommandation = {
  titre: string;
  pourquoi: string;
  comment: string;
};
export type ObjetDeRecommandation = {
  niveau1: NiveauDeRecommandation;
  niveau2?: NiveauDeRecommandation;
  priorisation: number;
};
export type TableauDeRecommandations = {
  [identifiantQuestion: string]: ObjetDeRecommandation;
};
