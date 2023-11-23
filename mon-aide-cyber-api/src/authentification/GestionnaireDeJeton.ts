export type Jeton = string;

export interface GestionnaireDeJeton {
  verifie(jeton: string): void;

  genereJeton(donnee: string): Jeton;
}
