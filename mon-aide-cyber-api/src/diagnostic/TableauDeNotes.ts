type Operation = {
  operation: "moyenne";
};
type Bareme = {
  reponses: {
    [identifiantReponse: string]: Note;
  };
};
export type Note = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | null | undefined;
export type RegleDeCalcul = Operation & Bareme;
type Notation = {
  [identifiantReponse: string]: Note | RegleDeCalcul;
};
export type TableauDeNotes = {
  [identifiantQuestion: string]: {
    notation: Notation;
  };
};
