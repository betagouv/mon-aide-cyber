export type Note = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | null;
export type TableauDeNotes = {
  [identifiantQuestion: string]: { [identifiantReponse: string]: Note };
};
