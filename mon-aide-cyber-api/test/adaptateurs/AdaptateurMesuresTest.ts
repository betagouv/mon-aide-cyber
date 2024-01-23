import { Adaptateur } from '../../src/adaptateurs/Adaptateur';
import { ReferentielDeMesures } from '../../src/diagnostic/ReferentielDeMesures';
import { desMesures } from '../constructeurs/constructeurMesures';

export class AdaptateurMesuresTest implements Adaptateur<ReferentielDeMesures> {
  private mesures: ReferentielDeMesures = desMesures().construis();

  lis(): Promise<ReferentielDeMesures> {
    return Promise.resolve(this.mesures);
  }
}
