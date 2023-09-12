export type Recommandation = {
  niveau1: string;
  niveau2: string;
};
export type TableauDeRecommandations = {
  [identifiantQuestion: string]: Recommandation;
};
