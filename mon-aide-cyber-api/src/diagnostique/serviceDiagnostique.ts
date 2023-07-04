import { AdaptateurDonnees } from "../adaptateurs/AdaptateurDonnees";
import { Diagnostique } from "./diagnostique";
import * as crypto from "crypto";

export class ServiceDiagnostique {
  constructor(private readonly adaptateurDonnees: AdaptateurDonnees) {}

  diagnostique = async (id: crypto.UUID): Promise<Diagnostique> =>
    this.adaptateurDonnees.lis().then((contenu) => ({
      identifiant: id,
      referentiel: (contenu as Diagnostique).referentiel,
    }));
}
