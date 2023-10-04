import { ConstructeurDeTableau } from "./constructeur";
import {
  Note,
  RegleDeCalcul,
  TableauDeNotes,
} from "../../src/diagnostic/TableauDeNotes";

class ConstructeurDeTableauDeNotes extends ConstructeurDeTableau<TableauDeNotes> {
  avecDesNotes(
    notes: {
      [identifiantQuestion: string]: {
        [identifiantReponse: string]: Note | RegleDeCalcul;
      };
    }[],
  ): ConstructeurDeTableauDeNotes {
    this.tableau.push(
      ...Object.entries(notes).flatMap(([__, notes]) => {
        return Object.entries(notes).map(
          ([identifiantQuestion, noteReponse]) => ({
            [identifiantQuestion]: { notation: noteReponse },
          }),
        );
      }),
    );
    return this;
  }
}

export const unTableauDeNotes = () => new ConstructeurDeTableauDeNotes();
