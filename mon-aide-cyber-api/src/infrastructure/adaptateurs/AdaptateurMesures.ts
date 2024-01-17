import { Adaptateur } from '../../adaptateurs/Adaptateur';
import { Mesures } from '../../diagnostic/Mesures';
import { tableauMesures } from '../../diagnostic/donneesMesures';

export class AdaptateurMesures implements Adaptateur<Mesures> {
  lis(): Promise<Mesures> {
    return Promise.resolve(tableauMesures);
  }
}
