import { Adaptateur } from "../../adaptateurs/Adaptateur";
import { TableauDeNotes } from "../../diagnostic/TableauDeNotes";
import { tableauDeNotes } from "../../diagnostic/donneesTableauNotes";

export class AdaptateurTableauDeNotesMAC implements Adaptateur<TableauDeNotes> {
  lis(): Promise<TableauDeNotes> {
    return Promise.resolve(tableauDeNotes);
  }
}
