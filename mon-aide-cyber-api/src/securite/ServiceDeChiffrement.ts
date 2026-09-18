export interface ServiceDeChiffrement {
  chiffre(chaine: string): string;

  dechiffre(chaine: string): string;

  compare(hash: string, motDePasse: string): Promise<boolean>;

  hache(chaine: string): Promise<string>;
}
