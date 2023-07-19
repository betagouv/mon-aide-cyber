import { Constructeur } from "./Constructeur";
import { ActionDiagnostic } from "../../src/domaine/diagnostic/Diagnostic";
import { faker } from "@faker-js/faker/locale/fr";

class ConstructeurActionDiagnostic implements Constructeur<ActionDiagnostic> {
  private chemin = "contexte";
  private action = "repondre" as const;
  private url: string = faker.internet.url();
  contexte(): ConstructeurActionDiagnostic {
    this.chemin = "contexte";
    return this;
  }

  construis(): ActionDiagnostic {
    return {
      action: this.action,
      chemin: this.chemin,
      ressource: { url: this.url, methode: "PATCH" },
    };
  }
}

export const uneAction = () => new ConstructeurActionDiagnostic();
