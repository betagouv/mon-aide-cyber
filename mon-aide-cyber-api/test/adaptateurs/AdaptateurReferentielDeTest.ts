import { AdaptateurReferentiel } from "../../src/adaptateurs/AdaptateurReferentiel";
import { Referentiel } from "../../src/diagnostic/Referentiel";

export class AdaptateurReferentielDeTest implements AdaptateurReferentiel {
  private referentiel: Referentiel | undefined = undefined;

  lis(): Promise<Referentiel> {
    return this.referentiel !== undefined
      ? Promise.resolve(this.referentiel)
      : Promise.reject("Referentiel non connu");
  }

  ajoute(referentiel: Referentiel) {
    this.referentiel = referentiel;
  }
}
