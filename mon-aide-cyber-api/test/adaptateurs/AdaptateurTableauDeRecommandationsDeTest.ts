import { Adaptateur } from "../../src/adaptateurs/Adaptateur";
import { TableauDeRecommandations } from "../../src/diagnostic/TableauDeRecommandations";
import { unTableauDeRecommandations } from "../constructeurs/constructeurTableauDeRecommandations";

export class AdaptateurTableauDeRecommandationsDeTest
  implements Adaptateur<TableauDeRecommandations>
{
  private tableauDeRecommandations: TableauDeRecommandations =
    unTableauDeRecommandations().construis();
  lis(): Promise<TableauDeRecommandations> {
    return Promise.resolve(this.tableauDeRecommandations);
  }
}
