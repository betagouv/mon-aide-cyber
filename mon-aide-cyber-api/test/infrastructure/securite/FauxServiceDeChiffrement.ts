import { ServiceDeChiffrement } from '../../../src/securite/ServiceDeChiffrement';

export class FauxServiceDeChiffrement implements ServiceDeChiffrement {
  private _aEteAppele = false;
  private appels: Map<string, boolean> = new Map();

  constructor(private tableDeChiffrement: Map<string, string>) {}

  chiffre(chaine: string): string {
    this.appels.set(chaine, true);
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
    this.appels.set(chaine, true);
    return resultat;
  }

  ajoute(clef: string, valeurChiffree: string) {
    this.tableDeChiffrement.set(clef, valeurChiffree);
  }

  aEteAppele(): boolean {
    return this._aEteAppele;
  }

  aEteAppeleAvec(valeur: string): boolean {
    return !!this.appels.get(valeur);
  }

  nettoie() {
    this.tableDeChiffrement = new Map();
    this.appels = new Map();
  }
}
