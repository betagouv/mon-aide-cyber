export type ObjetDeRecommandation = {
  niveau1: string;
  niveau2?: string;
  priorisation: number;
};
export type TableauDeRecommandations = {
  [identifiantQuestion: string]: ObjetDeRecommandation;
};
