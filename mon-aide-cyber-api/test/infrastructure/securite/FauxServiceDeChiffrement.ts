import { ServiceDeChiffrement } from '../../../src/securite/ServiceDeChiffrement';

export class FauxServiceDeChiffrement implements ServiceDeChiffrement {
  constructor(private readonly tableDeChiffrement: Map<string, string>) {}

  chiffre(chaine: string): string {
    return this.tableDeChiffrement.get(chaine) || '';
  }

  dechiffre(chaine: string): string {
    let resultat = '';
    this.tableDeChiffrement.forEach((clef, valeur) => {
      if (clef === chaine) {
        resultat = valeur;
      }
    });
    return resultat;
  }
}
