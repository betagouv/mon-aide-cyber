import {
  EntrepotUtilisateur,
  Utilisateur,
} from '../../src/authentification/Utilisateur';
import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';
import {
  Aidant,
  EntrepotAidant,
  TypesEntites,
} from '../../src/espace-aidant/Aidant';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { SecteurActivite } from '../../src/espace-aidant/preferences/secteursActivite';
import { Departement } from '../../src/gestion-demandes/departements';
import { Constructeur } from './constructeur';

class ConstructeurUtilisateur implements Constructeur<Utilisateur> {
  private identifiant: crypto.UUID = fakerFR.string.uuid() as crypto.UUID;
  private identifiantConnexion: string = fakerFR.internet.email().toLowerCase();
  private motDePasse: string = fakerFR.string.alpha(10);
  private nomPrenom: string = fakerFR.person.fullName();
  private dateSignatureCGU: Date | undefined = FournisseurHorloge.maintenant();

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

  avecUnIdentifiant(identifiant: crypto.UUID): ConstructeurAidant {
    this.identifiant = identifiant;
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
type Parametres = {
  entrepotUtilisateur: EntrepotUtilisateur;
  constructeurAidant: ConstructeurAidant;
  entrepotAidant: EntrepotAidant;
  constructeurUtilisateur: ConstructeurUtilisateur;
};

export async function unCompteAidantRelieAUnCompteUtilisateur(
  parametres: Parametres
) {
  const utilisateur = parametres.constructeurUtilisateur.construis();
  await parametres.entrepotUtilisateur.persiste(utilisateur);
  const aidant = parametres.constructeurAidant
    .avecUnIdentifiant(utilisateur.identifiant)
    .construis();
  await parametres.entrepotAidant.persiste(aidant);
  return { utilisateur, aidant };
}
