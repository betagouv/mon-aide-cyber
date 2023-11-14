import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';
import { Aidant } from '../../../src/authentification/Aidant';

interface Constructeur<T> {
  construis(): T;
}
class ConstructeurAidant implements Constructeur<Aidant> {
  private identifiant: crypto.UUID = fakerFR.string.uuid() as crypto.UUID;
  private identifiantConnexion: string = fakerFR.internet.email();
  private nomPrenom: string = fakerFR.person.fullName();
  private motDePasse: string = fakerFR.string.alpha(10);
  avecUnNomPrenom(nomPrenom: string): ConstructeurAidant {
    this.nomPrenom = nomPrenom;
    return this;
  }

  avecUnIdentifiantDeConnexion(
    identifiantConnexion: string,
  ): ConstructeurAidant {
    this.identifiantConnexion = identifiantConnexion;
    return this;
  }

  avecUnMotDePasse(motDePasse: string): ConstructeurAidant {
    this.motDePasse = motDePasse;
    return this;
  }

  construis(): Aidant {
    return {
      identifiant: this.identifiant,
      identifiantConnexion: this.identifiantConnexion,
      motDePasse: this.motDePasse,
      nomPrenom: this.nomPrenom,
    };
  }
}

export const unAidant = (): ConstructeurAidant => new ConstructeurAidant();
