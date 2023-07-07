import { AdaptateurReferentiel } from "../adaptateurs/AdaptateurReferentiel";
import { Diagnostique } from "./Diagnostique";
import * as crypto from "crypto";
import { Entrepots } from "../domaine/Entrepots";
import { Referentiel } from "./Referentiel";

export class ServiceDiagnostique {
  constructor(
    private readonly adaptateurReferentiel: AdaptateurReferentiel,
    private readonly entrepots: Entrepots,
  ) {}

  diagnostique = async (id: crypto.UUID): Promise<Diagnostique> =>
    this.adaptateurReferentiel.lis().then((contenu) => ({
      identifiant: id,
      referentiel: (contenu as Diagnostique).referentiel,
    }));

  cree(): Promise<Diagnostique> {
    return this.adaptateurReferentiel.lis().then((referentiel) => {
      const diagnostique: Diagnostique = {
        identifiant: crypto.randomUUID(),
        referentiel: referentiel as Referentiel,
      };
      this.entrepots.diagnostique().persiste(diagnostique);
      return Promise.resolve(diagnostique);
    });
  }
}
