export type Recommandation = {
  niveau1: string;
  niveau2?: string;
  priorisation: number;
};
export type TableauDeRecommandations = {
  [identifiantQuestion: string]: Recommandation;
};
