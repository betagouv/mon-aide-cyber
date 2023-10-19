import { ConsignateurErreurs } from "../../adaptateurs/ConsignateurErreurs";

export class ConsignateurErreursMemoire implements ConsignateurErreurs {
  private erreurs: Error[] = [];

  tous(): Error[] {
    return this.erreurs;
  }

  consigne(erreur: Error): void {
    this.erreurs.push(erreur);
  }
}
