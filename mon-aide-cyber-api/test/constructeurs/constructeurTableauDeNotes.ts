import { ConstructeurDeTableau } from "./constructeur";
import { Note, TableauDeNotes } from "../../src/diagnostic/TableauDeNotes";

class ConstructeurDeTableauDeNotes extends ConstructeurDeTableau<TableauDeNotes> {
  avecDesNotes(
    notes: {
      [identifiantQuestion: string]: { [identifiantReponse: string]: Note };
    }[],
  ): ConstructeurDeTableauDeNotes {
    this.tableau.push(...notes);
    return this;
  }
}

export const unTableauDeNotes = () => new ConstructeurDeTableauDeNotes();
