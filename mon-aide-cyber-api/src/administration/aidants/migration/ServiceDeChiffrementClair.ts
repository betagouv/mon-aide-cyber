import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { MigrationAidant } from './migreAidants';

export class ServiceDeChiffrementClair implements ServiceDeChiffrement {
  chiffre(chaine: string): string {
    return chaine;
  }

  dechiffre(chaine: string): string {
    return chaine;
  }
}

export class ServiceDeChiffrementEnErreurSur implements ServiceDeChiffrement {
  constructor(private readonly migration: MigrationAidant) {}

  chiffre(chaine: string): string {
    return chaine;
  }

  dechiffre(chaine: string): string {
    if (this.migration.aidant.identifiantConnexion === chaine) {
      throw new Error('Ne peut déchiffrer la donnée');
    }
    return chaine;
  }
}
