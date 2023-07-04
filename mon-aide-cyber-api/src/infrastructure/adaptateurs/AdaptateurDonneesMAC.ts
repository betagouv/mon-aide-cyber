import { AdaptateurDonnees } from "../../adaptateurs/AdaptateurDonnees";
import { referentiel } from "../../diagnostic/donneesReferentiel";

export class AdaptateurDonneesMAC implements AdaptateurDonnees {
  lis = (): Promise<object> => Promise.resolve({ referentiel });
}
