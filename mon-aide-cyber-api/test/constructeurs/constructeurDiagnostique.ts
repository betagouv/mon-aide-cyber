import { Referentiel } from "../../src/diagnostique/Referentiel";
import { Diagnostique } from "../../src/diagnostique/Diagnostique";
import { Constructeur } from "./constructeur";
import { unReferentiel } from "./constructeurReferentiel";
import { fakerFR as faker } from "@faker-js/faker";
import crypto from "crypto";

class ConstructeurDiagnostique implements Constructeur<Diagnostique> {
  private referentiel: Referentiel = unReferentiel().construis();
  private identifiant = faker.string.uuid() as crypto.UUID;
  avecUnReferentiel(referentiel: Referentiel): ConstructeurDiagnostique {
    this.referentiel = referentiel;
    return this;
  }

  construis(): Diagnostique {
    return { identifiant: this.identifiant, referentiel: this.referentiel };
  }
}

export const unDiagnostique = () => new ConstructeurDiagnostique();
