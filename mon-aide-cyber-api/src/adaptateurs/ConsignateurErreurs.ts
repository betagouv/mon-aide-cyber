export interface ConsignateurErreurs {
  tous(): Error[];

  consigne(erreur: Error): void;
}
