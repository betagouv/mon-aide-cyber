type Operation = {
  operation: "moyenne";
};
type Bareme = {
  reponses: {
    [identifiantReponse: string]: Note;
  };
};
export type Note = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | null;
export type RegleDeCalcul = Operation & Bareme;
export type TableauDeNotes = {
  [identifiantQuestion: string]: {
    [identifiantReponse: string]: Note | RegleDeCalcul;
  };
};
