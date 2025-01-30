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
}
