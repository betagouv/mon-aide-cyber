import { Adaptateur } from "../../src/adaptateurs/Adaptateur";
import { TableauDeNotes } from "../../src/diagnostic/TableauDeNotes";
import { unTableauDeNotes } from "../constructeurs/constructeurTableauDeNotes";

export class AdaptateurTableauDeNotesDeTest
  implements Adaptateur<TableauDeNotes>
{
  private tableauDeNotes: TableauDeNotes = unTableauDeNotes().construis();
  lis(): Promise<TableauDeNotes> {
    return Promise.resolve(this.tableauDeNotes);
  }

  ajoute(tableauDeNotes: TableauDeNotes) {
    this.tableauDeNotes = tableauDeNotes;
  }
}
