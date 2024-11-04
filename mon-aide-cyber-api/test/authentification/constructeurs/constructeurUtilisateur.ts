import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';
import { Utilisateur } from '../../../src/authentification/Utilisateur';

interface Constructeur<T> {
  construis(): T;
}

class ConstructeurUtilisateur implements Constructeur<Utilisateur> {
  private identifiant: crypto.UUID = fakerFR.string.uuid() as crypto.UUID;
  private identifiantConnexion: string = fakerFR.internet.email().toLowerCase();
  private motDePasse: string = fakerFR.string.alpha(10);
  private nomPrenom: string = fakerFR.person.fullName();
  private dateSignatureCGU: Date | undefined = fakerFR.date.anytime();

  avecUnIdentifiantDeConnexion(
    identifiantConnexion: string
  ): ConstructeurUtilisateur {
    this.identifiantConnexion = identifiantConnexion;
    return this;
  }

  avecUnMotDePasse(motDePasse: string): ConstructeurUtilisateur {
    this.motDePasse = motDePasse;
    return this;
  }

  avecUnIdentifiant(identifiant: crypto.UUID): ConstructeurUtilisateur {
    this.identifiant = identifiant;
    return this;
  }

  avecUnNomPrenom(nomPrenom: string): ConstructeurUtilisateur {
    this.nomPrenom = nomPrenom;
    return this;
  }

  sansCGUSignees(): ConstructeurUtilisateur {
    this.dateSignatureCGU = undefined;
    return this;
  }

  construis(): Utilisateur {
    return {
      identifiant: this.identifiant,
      nomPrenom: this.nomPrenom,
      identifiantConnexion: this.identifiantConnexion,
      motDePasse: this.motDePasse,
      ...(this.dateSignatureCGU && { dateSignatureCGU: this.dateSignatureCGU }),
    };
  }
}

export const unUtilisateur = (): ConstructeurUtilisateur =>
  new ConstructeurUtilisateur();
