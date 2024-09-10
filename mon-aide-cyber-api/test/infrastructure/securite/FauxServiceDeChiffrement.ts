import { ServiceDeChiffrement } from '../../../src/securite/ServiceDeChiffrement';

export class FauxServiceDeChiffrement implements ServiceDeChiffrement {
  private _aEteAppele = false;
  constructor(private readonly tableDeChiffrement: Map<string, string>) {}

  chiffre(chaine: string): string {
    return this.tableDeChiffrement.get(chaine) || '';
  }

  dechiffre(chaine: string): string {
    let resultat = '';
    this.tableDeChiffrement.forEach((clef, valeur) => {
      if (clef === chaine) {
        resultat = valeur;
        this._aEteAppele = true;
      }
    });
    return resultat;
  }

  ajoute(clef: string, valeurChiffree: string) {
    this.tableDeChiffrement.set(clef, valeurChiffree);
  }

  aEteAppele(): boolean {
    return this._aEteAppele;
  }
}
