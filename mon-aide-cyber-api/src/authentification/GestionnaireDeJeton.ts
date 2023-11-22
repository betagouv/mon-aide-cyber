export type Jeton = string;

export interface GestionnaireDeJeton {
  decode(jeton: string): void;

  genereJeton(donnee: string): Jeton;
}
