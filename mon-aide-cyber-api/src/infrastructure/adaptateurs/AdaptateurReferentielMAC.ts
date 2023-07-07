import { AdaptateurReferentiel } from "../../adaptateurs/AdaptateurReferentiel";
import { referentiel } from "../../diagnostique/donneesReferentiel";

export class AdaptateurReferentielMAC implements AdaptateurReferentiel {
  lis = (): Promise<object> => Promise.resolve({ referentiel });
}
