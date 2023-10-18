import { AdapteurGestionnaireErreurs } from "../../adaptateurs/AdapteurGestionnaireErreurs";

export class GestionnaireErreursMemoire implements AdapteurGestionnaireErreurs {
  private erreurs: Error[] = [];

  tous(): Error[] {
    return this.erreurs;
  }

  consigne(erreur: Error): void {
    this.erreurs.push(erreur);
  }
}
