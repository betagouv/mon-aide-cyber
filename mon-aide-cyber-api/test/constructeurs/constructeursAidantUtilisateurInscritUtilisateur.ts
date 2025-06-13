import {
  EntrepotUtilisateur,
  Utilisateur,
} from '../../src/authentification/Utilisateur';
import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';
import {
  Aidant,
  EntiteAidant,
  entitesPubliques,
  EntrepotAidant,
  formatteLeNomPrenomSelonRegleAffichage,
  TypeAffichageAnnuaire,
  TypeEntite,
  TypesEntites,
} from '../../src/espace-aidant/Aidant';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { SecteurActivite } from '../../src/espace-aidant/preferences/secteursActivite';
import { Departement, gironde } from '../../src/gestion-demandes/departements';
import { Constructeur } from './constructeur';
import {
  EntiteUtilisateurInscrit,
  EntrepotUtilisateurInscrit,
  UtilisateurInscrit,
} from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import { AdaptateurDeVerificationDeSessionDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionDeTest';

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
  private secteursActivite: SecteurActivite[] = [];
  private departements: Departement[] = [];
  private typesEntites: TypesEntites = [];
  private nomAffichageAnnuaire: string = this.nomPrenom;
  private consentementAnnuaire = false;
  private siret: string | undefined = undefined;
  private dateSignatureCGU: Date | undefined = FournisseurHorloge.maintenant();
  private dateSignatureCharte: Date = FournisseurHorloge.maintenant();
  private entite: EntiteAidant | undefined = undefined;

  avecUnNomPrenom(nomPrenom: string): ConstructeurAidant {
    this.nomPrenom = nomPrenom;
    this.nomAffichageAnnuaire = nomPrenom;
    return this;
  }

  avecUnEmail(email: string): ConstructeurAidant {
    this.email = email;
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

  ayantConsentiPourLAnnuaire(
    typeAffichageAnnuaire: TypeAffichageAnnuaire = TypeAffichageAnnuaire.PRENOM_NOM
  ): ConstructeurAidant {
    this.consentementAnnuaire = true;
    this.nomAffichageAnnuaire = formatteLeNomPrenomSelonRegleAffichage(
      this.nomPrenom,
      typeAffichageAnnuaire
    );
    return this;
  }

  avecUnIdentifiant(identifiant: crypto.UUID): ConstructeurAidant {
    this.identifiant = identifiant;
    return this;
  }

  avecUnSiret(siret: string): ConstructeurAidant {
    this.siret = siret;
    return this;
  }

  sansCGUSignees(): ConstructeurAidant {
    this.dateSignatureCGU = undefined;
    return this;
  }

  cguValideesLe(date: Date): ConstructeurAidant {
    this.dateSignatureCGU = date;
    return this;
  }

  avecUneDateDeSignatureDeCharte(date: Date): ConstructeurAidant {
    this.dateSignatureCharte = date;
    return this;
  }

  faisantPartieDeEntite(type: TypeEntite): ConstructeurAidant {
    this.entite = {
      nom: fakerFR.company.name(),
      siret: fakerFR.string.alpha(10),
      type,
    };
    return this;
  }

  avecUnProfilGendarme(): ConstructeurAidant {
    this.siret = 'GENDARMERIE';
    return this;
  }

  construis(): Aidant {
    return {
      identifiant: this.identifiant,
      email: this.email,
      nomPrenom: this.nomPrenom,
      preferences: {
        secteursActivite: this.secteursActivite,
        departements: this.departements,
        typesEntites: this.typesEntites,
        nomAffichageAnnuaire: this.nomAffichageAnnuaire,
      },
      ...(this.siret && { siret: this.siret }),
      consentementAnnuaire: this.consentementAnnuaire,
      ...(this.dateSignatureCGU && { dateSignatureCGU: this.dateSignatureCGU }),
      dateSignatureCharte: this.dateSignatureCharte,
      ...(this.entite && { entite: this.entite }),
    };
  }
}

class ConstructeurUtilisateurInscrit
  implements Constructeur<UtilisateurInscrit>
{
  private dateSignatureCGU: Date | undefined = fakerFR.date.anytime();
  private email: string = fakerFR.internet.email().toLowerCase();
  private entite: EntiteUtilisateurInscrit | undefined = {};
  private identifiant: crypto.UUID = crypto.randomUUID();
  private nomPrenom: string = fakerFR.person.fullName();

  avecLeSiret(siret: string): ConstructeurUtilisateurInscrit {
    this.entite = { siret };
    return this;
  }

  sansEntite(): ConstructeurUtilisateurInscrit {
    this.entite = undefined;
    return this;
  }

  avecUneDateDeSignatureDeCGU(
    dateSignatureCGU: Date
  ): ConstructeurUtilisateurInscrit {
    this.dateSignatureCGU = dateSignatureCGU;
    return this;
  }

  avecUnIdentifiant(identifiant: crypto.UUID): ConstructeurUtilisateurInscrit {
    this.identifiant = identifiant;
    return this;
  }

  avecUnNomPrenom(nomPrenom: string): ConstructeurUtilisateurInscrit {
    this.nomPrenom = nomPrenom;
    return this;
  }

  sansValidationDeCGU(): ConstructeurUtilisateurInscrit {
    this.dateSignatureCGU = undefined;
    return this;
  }

  avecUnEmail(email: string): ConstructeurUtilisateurInscrit {
    this.email = email;
    return this;
  }

  construis(): UtilisateurInscrit {
    return {
      ...(this.dateSignatureCGU && { dateSignatureCGU: this.dateSignatureCGU }),
      email: this.email,
      ...(this.entite && { entite: this.entite }),
      identifiant: this.identifiant,
      nomPrenom: this.nomPrenom,
    };
  }
}

export const unAidant = (): ConstructeurAidant => new ConstructeurAidant();

class ConstructeurAidants implements Constructeur<Aidant[]> {
  private nombreAidants: number = fakerFR.number.int({ min: 1, max: 10 });
  private departement: Departement | undefined = undefined;
  private typeEntite: TypesEntites = [];
  private secteursActivites: SecteurActivite[] = [];

  construis(): Aidant[] {
    const aidants: Aidant[] = [];
    for (let i = 0; i < this.nombreAidants; i++) {
      let constructeurAidant = unAidant();

      if (this.departement) {
        constructeurAidant = constructeurAidant.ayantPourDepartements([
          this.departement,
        ]);
      }
      if (this.typeEntite) {
        constructeurAidant = constructeurAidant.ayantPourTypesEntite(
          this.typeEntite
        );
      }
      if (this.secteursActivites.length > 0) {
        constructeurAidant = constructeurAidant.ayantPourSecteursActivite(
          this.secteursActivites
        );
      }

      aidants.push(constructeurAidant.construis());
    }
    return aidants;
  }

  auNombreDe(nombreAidants: number): ConstructeurAidants {
    this.nombreAidants = nombreAidants;
    return this;
  }

  enGironde(): ConstructeurAidants {
    this.departement = gironde;
    return this;
  }

  dansLeServicePublic(): ConstructeurAidants {
    this.typeEntite?.push(entitesPubliques);
    return this;
  }

  pourLesSecteursActivite(
    secteursActivites: SecteurActivite[]
  ): ConstructeurAidants {
    this.secteursActivites = secteursActivites;
    return this;
  }
}

export const desAidants = (): ConstructeurAidants => new ConstructeurAidants();

type ParametresLiaisonAidant = {
  entrepotUtilisateur: EntrepotUtilisateur;
  constructeurAidant: ConstructeurAidant;
  entrepotAidant: EntrepotAidant;
  constructeurUtilisateur: ConstructeurUtilisateur;
};

export const unCompteAidantRelieAUnCompteUtilisateur = async (
  parametres: ParametresLiaisonAidant
): Promise<{ utilisateur: Utilisateur; aidant: Aidant }> => {
  const aidant = parametres.constructeurAidant.construis();
  const utilisateur = parametres.constructeurUtilisateur
    .avecUnIdentifiant(aidant.identifiant)
    .avecUnNomPrenom(aidant.nomPrenom)
    .avecUnIdentifiantDeConnexion(aidant.email)
    .construis();
  await parametres.entrepotUtilisateur.persiste(utilisateur);
  await parametres.entrepotAidant.persiste(aidant);
  return { utilisateur, aidant };
};
type ParametresLiaisonUtilisateurInscrit = {
  constructeurUtilisateurInscrit: ConstructeurUtilisateurInscrit;
  constructeurUtilisateur: ConstructeurUtilisateur;
  entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit;
  entrepotUtilisateur: EntrepotUtilisateur;
  adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;
};

export const unUtilisateurInscrit = () => new ConstructeurUtilisateurInscrit();

export const unCompteUtilisateurInscritRelieAUnCompteUtilisateur = async (
  parametres: ParametresLiaisonUtilisateurInscrit
): Promise<{
  utilisateur: Utilisateur;
  utilisateurInscrit: UtilisateurInscrit;
}> => {
  const utilisateur = parametres.constructeurUtilisateur.construis();
  await parametres.entrepotUtilisateur.persiste(utilisateur);
  const utilisateurInscrit = parametres.constructeurUtilisateurInscrit
    .avecUnIdentifiant(utilisateur.identifiant)
    .avecUnEmail(utilisateur.identifiantConnexion)
    .construis();
  await parametres.entrepotUtilisateurInscrit.persiste(utilisateurInscrit);
  parametres.adaptateurDeVerificationDeSession.utilisateurConnecte(
    utilisateur.identifiant
  );
  return { utilisateur, utilisateurInscrit };
};
type ParametreUtilisateurInscritProConnect = {
  entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit;
  constructeurUtilisateur: ConstructeurUtilisateurInscrit;
  adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;
};
export const unCompteUtilisateurInscritConnecteViaProConnect = async (
  parametres: ParametreUtilisateurInscritProConnect
): Promise<UtilisateurInscrit> => {
  const utilisateur = parametres.constructeurUtilisateur.construis();
  await parametres.entrepotUtilisateurInscrit.persiste(utilisateur);
  parametres.adaptateurDeVerificationDeSession.utilisateurProConnect(
    utilisateur.identifiant
  );
  return utilisateur;
};
type ParametreAidantProConnect = {
  entrepotAidant: EntrepotAidant;
  constructeurAidant: ConstructeurAidant;
  adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;
};
export const unCompteAidantConnecteViaProConnect = async (
  parametres: ParametreAidantProConnect
): Promise<UtilisateurInscrit> => {
  const aidant = parametres.constructeurAidant.construis();
  await parametres.entrepotAidant.persiste(aidant);
  parametres.adaptateurDeVerificationDeSession.utilisateurProConnect(
    aidant.identifiant
  );
  return aidant;
};
type ParametreUtilisateurInconnuProConnect = {
  constructeurUtilisateur: ConstructeurUtilisateurInscrit;
  adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;
};
export const unUtilisateurConnecteViaProConnectInconnuDeMAC = async (
  parametres: ParametreUtilisateurInconnuProConnect
): Promise<UtilisateurInscrit> => {
  const utilisateur = parametres.constructeurUtilisateur.construis();
  parametres.adaptateurDeVerificationDeSession.utilisateurProConnect(
    utilisateur.identifiant
  );
  return utilisateur;
};
export const unCompteAidantConnecte = async (configuration: {
  entrepotUtilisateur: EntrepotUtilisateur;
  entrepotAidant: EntrepotAidant;
  constructeurAidant: ConstructeurAidant;
  adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;
}) => {
  const { utilisateur, aidant } = await unCompteAidantRelieAUnCompteUtilisateur(
    {
      entrepotUtilisateur: configuration.entrepotUtilisateur,
      entrepotAidant: configuration.entrepotAidant,
      constructeurUtilisateur: unUtilisateur(),
      constructeurAidant: configuration.constructeurAidant,
    }
  );
  configuration.adaptateurDeVerificationDeSession.utilisateurConnecte(
    utilisateur.identifiant
  );
  await configuration.entrepotUtilisateur.persiste(utilisateur);
  return aidant;
};

export const unAidantConnecteInconnu = async (configuration: {
  adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;
}) => {
  const utilisateur = unAidant().construis();
  configuration.adaptateurDeVerificationDeSession.utilisateurConnecte(
    utilisateur.identifiant
  );
};
