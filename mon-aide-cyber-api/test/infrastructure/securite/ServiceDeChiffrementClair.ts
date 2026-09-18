import { ServiceDeChiffrement } from '../../../src/securite/ServiceDeChiffrement';

export class ServiceDeChiffrementClair implements ServiceDeChiffrement {
  private _dechiffreAEteAppele = false;
  chiffre(chaine: string): string {
    return chaine;
  }
  dechiffre(chaine: string): string {
    this._dechiffreAEteAppele = true;
    return chaine;
  }
  dechiffreAEteAppele(): boolean {
    return this._dechiffreAEteAppele;
  }

  async compare(_hash: string, _motDePasse: string): Promise<boolean> {
    return true;
  }

  async hache(chaine: string): Promise<string> {
    return `${chaine} claire`;
  }
}
