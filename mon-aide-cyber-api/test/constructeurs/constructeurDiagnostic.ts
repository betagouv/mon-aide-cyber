import { Constructeur } from "./constructeur";
import { unReferentiel } from "./constructeurReferentiel";
import { fakerFR as faker } from "@faker-js/faker";
import crypto from "crypto";
import { Diagnostic } from "../../src/diagnostic/Diagnostic";
import { Referentiel } from "../../src/diagnostic/Referentiel";

class ConstructeurDiagnostic implements Constructeur<Diagnostic> {
  private referentiel: Referentiel = unReferentiel().construis();
  private identifiant = faker.string.uuid() as crypto.UUID;
  avecUnReferentiel(referentiel: Referentiel): ConstructeurDiagnostic {
    this.referentiel = referentiel;
    return this;
  }

  construis(): Diagnostic {
    return { identifiant: this.identifiant, referentiel: this.referentiel };
  }
}

export const unDiagnostic = () => new ConstructeurDiagnostic();
