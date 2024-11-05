import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { SecteurActivite } from '../../../src/espace-aidant/preferences/secteursActivite';
import { Departement } from '../../../src/gestion-demandes/departements';
import { Aidant, TypesEntites } from '../../../src/espace-aidant/Aidant';

interface Constructeur<T> {
  construis(): T;
}

class ConstructeurAidant implements Constructeur<Aidant> {
  private identifiant: crypto.UUID = fakerFR.string.uuid() as crypto.UUID;
  private email: string = fakerFR.internet.email().toLowerCase();
  private nomPrenom: string = fakerFR.person.fullName();
  private motDePasse: string = fakerFR.string.alpha(10);
  private dateSignatureCGU: Date | undefined = FournisseurHorloge.maintenant();
  private dateSignatureCharte: Date | undefined =
    FournisseurHorloge.maintenant();
  private secteursActivite: SecteurActivite[] = [];
  private departements: Departement[] = [];
  private typesEntites: TypesEntites = [];
  private consentementAnnuaire = false;

  avecUnNomPrenom(nomPrenom: string): ConstructeurAidant {
    this.nomPrenom = nomPrenom;
    return this;
  }

  avecUnEmail(identifiantConnexion: string): ConstructeurAidant {
    this.email = identifiantConnexion;
    return this;
  }

  avecUnMotDePasse(motDePasse: string): ConstructeurAidant {
    this.motDePasse = motDePasse;
    return this;
  }

  sansEspace(): ConstructeurAidant {
    this.dateSignatureCGU = undefined;
    this.dateSignatureCharte = undefined;
    return this;
  }

  ayantPourSecteursActivite(
    secteursActivite: SecteurActivite[]
  ): ConstructeurAidant {
    this.secteursActivite = secteursActivite;
    return this;
  }

  ayantPourDepartements(departements: Departement[]): ConstructeurAidant {
    this.departements = departements;
    return this;
  }

  ayantPourTypesEntite(typesEntites: TypesEntites): ConstructeurAidant {
    this.typesEntites = typesEntites;
    return this;
  }

  ayantConsentiPourLAnnuaire(): ConstructeurAidant {
    this.consentementAnnuaire = true;
    return this;
  }

  construis(): Aidant {
    return {
      identifiant: this.identifiant,
      email: this.email,
      motDePasse: this.motDePasse,
      nomPrenom: this.nomPrenom,
      ...(this.dateSignatureCGU && { dateSignatureCGU: this.dateSignatureCGU }),
      ...(this.dateSignatureCharte && {
        dateSignatureCharte: this.dateSignatureCharte,
      }),
      preferences: {
        secteursActivite: this.secteursActivite,
        departements: this.departements,
        typesEntites: this.typesEntites,
      },
      consentementAnnuaire: this.consentementAnnuaire,
    };
  }
}

export const unAidant = (): ConstructeurAidant => new ConstructeurAidant();
