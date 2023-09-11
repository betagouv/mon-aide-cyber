import { Constructeur } from "./constructeur";
import { unReferentiel } from "./constructeurReferentiel";
import {
  Diagnostic,
  initialiseDiagnostic,
} from "../../src/diagnostic/Diagnostic";
import { Referentiel } from "../../src/diagnostic/Referentiel";
import { unTableauDeNotes } from "./constructeurTableauDeNotes";

class ConstructeurDiagnostic implements Constructeur<Diagnostic> {
  private referentiel: Referentiel = unReferentiel().construis();
  private readonly tableauDeNotes = unTableauDeNotes().construis();

  avecUnReferentiel(referentiel: Referentiel): ConstructeurDiagnostic {
    this.referentiel = referentiel;
    return this;
  }

  construis(): Diagnostic {
    return initialiseDiagnostic(this.referentiel, this.tableauDeNotes);
  }
}

export const unDiagnostic = () => new ConstructeurDiagnostic();
