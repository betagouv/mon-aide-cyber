export type Jeton = string;

export interface GestionnaireDeJeton {
  decode(jeton: string): any;

  genereJeton(donnee: string): Jeton;
}
