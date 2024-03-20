import { ServiceDeChiffrementChacha20 } from '../securite/ServiceDeChiffrementChacha20';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';

class ServiceDechiffrementClair implements ServiceDeChiffrement {
  chiffre(chaine: string): string {
    return chaine;
  }
  dechiffre(chaine: string): string {
    return chaine;
  }
}

export const adaptateurServiceChiffrement = (): ServiceDeChiffrement => {
  return process.env.CLEF_SECRETE_CHIFFREMENT !== undefined || process.env.CLEF_SECRETE_CHIFFREMENT === null
    ? new ServiceDeChiffrementChacha20()
    : new ServiceDechiffrementClair();
};
