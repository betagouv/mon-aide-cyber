import { AdaptateurReferentiel } from "../../adaptateurs/AdaptateurReferentiel";
import { referentiel } from "../../diagnostique/donneesReferentiel";
import { Referentiel } from "../../diagnostique/Referentiel";

export class AdaptateurReferentielMAC implements AdaptateurReferentiel {
  lis = (): Promise<Referentiel> => Promise.resolve(referentiel);
}
