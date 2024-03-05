import { Constructeur } from './Constructeur.ts';
import { Utilisateur } from '../../src/domaine/authentification/Authentification.ts';
import { fakerFR } from '@faker-js/faker';

class ConstructeurUtilisateur implements Constructeur<Utilisateur> {
  private nomPrenom: string = fakerFR.person.fullName();
  construis(): Utilisateur {
    return { nomPrenom: this.nomPrenom };
  }
}

export const unUtilisateur = () => new ConstructeurUtilisateur();
