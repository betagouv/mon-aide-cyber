import { Adaptateur } from '../../src/adaptateurs/Adaptateur';
import { Mesures } from '../../src/diagnostic/Mesures';
import { desMesures } from '../constructeurs/constructeurMesures';

export class AdaptateurMesuresTest implements Adaptateur<Mesures> {
  private mesures: Mesures = desMesures().construis();

  lis(): Promise<Mesures> {
    return Promise.resolve(this.mesures);
  }
}
