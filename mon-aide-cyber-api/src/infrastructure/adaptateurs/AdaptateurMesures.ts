import { Adaptateur } from '../../adaptateurs/Adaptateur';
import { ReferentielDeMesures } from '../../diagnostic/ReferentielDeMesures';
import { tableauMesures } from '../../diagnostic/donneesMesures';

export class AdaptateurMesures implements Adaptateur<ReferentielDeMesures> {
  lis(): Promise<ReferentielDeMesures> {
    return Promise.resolve(tableauMesures);
  }
}
