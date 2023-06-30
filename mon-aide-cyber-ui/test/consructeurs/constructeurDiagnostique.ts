import { Referentiel } from "../../src/domaine/diagnostique/Referentiel.ts";
import { unReferentiel } from "./construceurReferentiel.ts";
import { Diagnostique } from "../../src/domaine/diagnostique/Diagnostique.ts";
import { faker } from "@faker-js/faker/locale/fr";
import { UUID } from "../../src/types/Types.ts";

class ConstructeurDiagnostique {
  private referentiel: Referentiel = unReferentiel().construis();
  private identifiant: UUID = faker.string.uuid() as UUID;

  avecUnReferentiel(referentiel: Referentiel): ConstructeurDiagnostique {
    this.referentiel = referentiel;
    return this;
  }

  avecIdentifiant(identifiant: UUID): ConstructeurDiagnostique {
    this.identifiant = identifiant;
    return this;
  }

  construis(): Diagnostique {
    return {
      identifiant: this.identifiant,
      referentiel: this.referentiel,
    };
  }
}

export const unDiagnostique = () => new ConstructeurDiagnostique();
