import { Constructeur } from "./constructeur";
import { unReferentiel } from "./constructeurReferentiel";
import {
  Diagnostic,
  initialiseDiagnostic,
} from "../../src/diagnostic/Diagnostic";
import { Referentiel } from "../../src/diagnostic/Referentiel";

class ConstructeurDiagnostic implements Constructeur<Diagnostic> {
  private referentiel: Referentiel = unReferentiel().construis();

  avecUnReferentiel(referentiel: Referentiel): ConstructeurDiagnostic {
    this.referentiel = referentiel;
    return this;
  }

  construis(): Diagnostic {
    return initialiseDiagnostic(this.referentiel);
  }
}

export const unDiagnostic = () => new ConstructeurDiagnostic();
