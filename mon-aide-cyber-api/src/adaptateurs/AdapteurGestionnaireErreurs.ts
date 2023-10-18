export interface AdapteurGestionnaireErreurs {
  tous(): Error[];

  consigne(erreur: Error): void;
}
