import { Adaptateur } from '../../adaptateurs/Adaptateur';
import { Mesures } from '../../diagnostic/Mesures';
import { tableauRecommandations } from '../../diagnostic/donneesTableauRecommandations';

export class AdaptateurMesures implements Adaptateur<Mesures> {
  lis(): Promise<Mesures> {
    return Promise.resolve(tableauRecommandations);
  }
}
