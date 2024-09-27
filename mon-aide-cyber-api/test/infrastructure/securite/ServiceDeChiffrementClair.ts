import { ServiceDeChiffrement } from '../../../src/securite/ServiceDeChiffrement';

export class ServiceDeChiffrementClair implements ServiceDeChiffrement {
  chiffre(chaine: string): string {
    return chaine;
  }

  dechiffre(chaine: string): string {
    return chaine;
  }
}
