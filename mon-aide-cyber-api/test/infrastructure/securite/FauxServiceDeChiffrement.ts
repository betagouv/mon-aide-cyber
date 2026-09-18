import { ServiceDeChiffrement } from '../../../src/securite/ServiceDeChiffrement';

export class FauxServiceDeChiffrement implements ServiceDeChiffrement {
  private _aEteAppele = false;
  private appels: Map<string, boolean> = new Map();
  private valeurLevantUneException: string | undefined = undefined;
  private comparaisonMotDePasseAppele: boolean = false;
  private motDePasseAEteHashe: boolean = false;

  constructor(private tableDeChiffrement: Map<string, string>) {}
  chiffre(chaine: string): string {
    this.appels.set(chaine, true);
    return this.tableDeChiffrement.get(chaine) || '';
  }
  dechiffre(chaine: string): string {
    if (chaine === this.valeurLevantUneException) {
      throw new Error('Impossible de déchiffrer');
    }
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

  lanceUneExceptionSurDechiffre(valeur: string) {
    this.valeurLevantUneException = valeur;
  }

  nettoie() {
    this.tableDeChiffrement = new Map();
    this.appels = new Map();
  }

  aHasheLeMotDePasse() {
    return this.motDePasseAEteHashe;
  }

  async hache(chaine: string): Promise<string> {
    this.motDePasseAEteHashe = true;
    return `${chaine} hashee`;
  }

  async compare(_hash: string, _motDePasse: string): Promise<boolean> {
    this.comparaisonMotDePasseAppele = true;
    return _hash === `${_motDePasse} hashee`;
  }

  aCompareLeMotDePasse(): boolean {
    return this.comparaisonMotDePasseAppele;
  }
}
