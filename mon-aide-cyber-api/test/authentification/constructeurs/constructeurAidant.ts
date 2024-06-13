import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';
import { Aidant } from '../../../src/authentification/Aidant';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';

interface Constructeur<T> {
  construis(): T;
}
class ConstructeurAidant implements Constructeur<Aidant> {
  private identifiant: crypto.UUID = fakerFR.string.uuid() as crypto.UUID;
  private identifiantConnexion: string = fakerFR.internet.email().toLowerCase();
  private nomPrenom: string = fakerFR.person.fullName();
  private motDePasse: string = fakerFR.string.alpha(10);
  private dateSignatureCGU: Date | undefined = FournisseurHorloge.maintenant();
  private dateSignatureCharte: Date | undefined =
    FournisseurHorloge.maintenant();
  avecUnNomPrenom(nomPrenom: string): ConstructeurAidant {
    this.nomPrenom = nomPrenom;
    return this;
  }

  avecUnIdentifiantDeConnexion(
    identifiantConnexion: string
  ): ConstructeurAidant {
    this.identifiantConnexion = identifiantConnexion;
    return this;
  }

  avecUnMotDePasse(motDePasse: string): ConstructeurAidant {
    this.motDePasse = motDePasse;
    return this;
  }

  avecUnIdentifiant(identifiant: crypto.UUID): ConstructeurAidant {
    this.identifiant = identifiant;
    return this;
  }

  sansEspace(): ConstructeurAidant {
    this.dateSignatureCGU = undefined;
    this.dateSignatureCharte = undefined;
    return this;
  }

  construis(): Aidant {
    return {
      identifiant: this.identifiant,
      identifiantConnexion: this.identifiantConnexion,
      motDePasse: this.motDePasse,
      nomPrenom: this.nomPrenom,
      ...(this.dateSignatureCGU && { dateSignatureCGU: this.dateSignatureCGU }),
      ...(this.dateSignatureCharte && {
        dateSignatureCharte: this.dateSignatureCharte,
      }),
    };
  }
}

export const unAidant = (): ConstructeurAidant => new ConstructeurAidant();
