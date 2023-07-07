import { AdaptateurReferentiel } from "../../adaptateurs/AdaptateurReferentiel";
import { referentiel } from "../../diagnostic/donneesReferentiel";

export class AdaptateurReferentielMAC implements AdaptateurReferentiel {
  lis = (): Promise<object> => Promise.resolve({ referentiel });
}
