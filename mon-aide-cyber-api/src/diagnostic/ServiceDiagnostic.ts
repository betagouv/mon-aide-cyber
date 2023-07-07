import { Diagnostic } from "./Diagnostic";
import * as crypto from "crypto";
import { Referentiel } from "./Referentiel";
import { AdaptateurReferentiel } from "../adaptateurs/AdaptateurReferentiel";
import { Entrepots } from "../domaine/Entrepots";

export class ServiceDiagnostic {
  constructor(
    private readonly adaptateurReferentiel: AdaptateurReferentiel,
    private readonly entrepots: Entrepots,
  ) {}

  diagnostic = async (id: crypto.UUID): Promise<Diagnostic> =>
    this.adaptateurReferentiel.lis().then((contenu) => ({
      identifiant: id,
      referentiel: (contenu as Diagnostic).referentiel,
    }));

  cree(): Promise<Diagnostic> {
    return this.adaptateurReferentiel.lis().then((referentiel) => {
      const diagnostic: Diagnostic = {
        identifiant: crypto.randomUUID(),
        referentiel: referentiel as Referentiel,
      };
      this.entrepots.diagnostic().persiste(diagnostic);
      return Promise.resolve(diagnostic);
    });
  }
}
