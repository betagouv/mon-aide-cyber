import { AdaptateurReferentiel } from "../../adaptateurs/AdaptateurReferentiel";
import { referentiel } from "../../diagnostic/donneesReferentiel";
import { Referentiel } from "../../diagnostic/Referentiel";

export class AdaptateurReferentielMAC implements AdaptateurReferentiel {
  lis = (): Promise<Referentiel> => Promise.resolve(referentiel);
}
