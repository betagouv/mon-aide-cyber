import { AdaptateurDonnees } from "../adaptateurs/AdaptateurDonnees";
import { Diagnostic } from "./Diagnostic";
import * as crypto from "crypto";
import { Referentiel } from "./Referentiel";

export class ServiceDiagnostic {
  constructor(private readonly adaptateurDonnees: AdaptateurDonnees) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    this.adaptateurDonnees.lis().then((contenu) => ({
      identifiant: id,
      referentiel: contenu as Referentiel,
    }));
}
