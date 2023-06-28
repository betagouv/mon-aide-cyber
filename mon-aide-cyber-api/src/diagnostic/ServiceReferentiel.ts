import { Referentiel } from "./Referentiel";
import { AdaptateurDonnees } from "../adaptateurs/AdaptateurDonnees";

export class ServiceReferentiel {
  constructor(private readonly adaptateurDonnees: AdaptateurDonnees) {}

  referentiel = async (): Promise<Referentiel> =>
    this.adaptateurDonnees.lis().then((contenu) => contenu as Referentiel);
}
