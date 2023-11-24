export type Jeton = string;

export type DonneesJetonMAC = {
  identifiant: string;
};

export interface GestionnaireDeJeton {
  verifie(jeton: string): void;

  genereJeton(donnee: DonneesJetonMAC): Jeton;
}
