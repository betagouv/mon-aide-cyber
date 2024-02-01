import { referentiel } from '../../diagnostic/donneesReferentiel';
import { Referentiel } from '../../diagnostic/Referentiel';
import { Adaptateur } from '../../adaptateurs/Adaptateur';

export class AdaptateurReferentielMAC implements Adaptateur<Referentiel> {
  lis = (): Promise<Referentiel> => Promise.resolve(referentiel);
}
