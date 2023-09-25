import { ConstructeurDeTableau } from "./constructeur";
import { TableauDeNotes } from "../../src/diagnostic/TableauDeNotes";

class ConstructeurDeTableauDeNotes extends ConstructeurDeTableau<TableauDeNotes> {
  avecDesNotes(notes: TableauDeNotes[]): ConstructeurDeTableauDeNotes {
    this.tableau.push(...notes);
    return this;
  }
}

export const unTableauDeNotes = () => new ConstructeurDeTableauDeNotes();
