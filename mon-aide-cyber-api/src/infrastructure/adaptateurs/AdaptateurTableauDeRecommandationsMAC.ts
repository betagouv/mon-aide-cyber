import { Adaptateur } from "../../adaptateurs/Adaptateur";
import { TableauDeRecommandations } from "../../diagnostic/TableauDeRecommandations";
import { tableauRecommandations } from "../../diagnostic/donneesTableauRecommandations";

export class AdaptateurTableauDeRecommandationsMAC
  implements Adaptateur<TableauDeRecommandations>
{
  lis(): Promise<TableauDeRecommandations> {
    return Promise.resolve(tableauRecommandations);
  }
}
