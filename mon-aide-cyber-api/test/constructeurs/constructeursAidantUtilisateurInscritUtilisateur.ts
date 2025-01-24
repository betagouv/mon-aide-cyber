import {
  EntrepotUtilisateur,
  Utilisateur,
} from '../../src/authentification/Utilisateur';
import crypto from 'crypto';
import { fakerFR } from '@faker-js/faker';
import {
  Aidant,
  EntiteAidant,
  EntrepotAidant,
  TypeEntite,
  TypesEntites,
} from '../../src/espace-aidant/Aidant';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { SecteurActivite } from '../../src/espace-aidant/preferences/secteursActivite';
import { Departement } from '../../src/gestion-demandes/departements';
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
  private consentementAnnuaire = false;
  private siret: string | undefined = undefined;
  private dateSignatureCGU: Date | undefined = FournisseurHorloge.maintenant();
  private dateSignatureCharte: Date = FournisseurHorloge.maintenant();
  private entite: EntiteAidant | undefined = undefined;

  avecUnNomPrenom(nomPrenom: string): ConstructeurAidant {
    this.nomPrenom = nomPrenom;
    return this;
  }

  avecUnEmail(identifiantConnexion: string): ConstructeurAidant {
    this.email = identifiantConnexion;
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
  private dateSignatureCGU: Date = fakerFR.date.anytime();
  private email: string = fakerFR.internet.email();
  private entite: EntiteUtilisateurInscrit = {};
  private identifiant: crypto.UUID = crypto.randomUUID();
  private nomPrenom: string = fakerFR.person.fullName();

  avecLeSiret(siret: string): ConstructeurUtilisateurInscrit {
    this.entite = { siret };
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

  construis(): UtilisateurInscrit {
    return {
      dateSignatureCGU: this.dateSignatureCGU,
      email: this.email,
      entite: this.entite,
      identifiant: this.identifiant,
      nomPrenom: this.nomPrenom,
    };
  }
}

export const unAidant = (): ConstructeurAidant => new ConstructeurAidant();

type ParametresLiaisonAidant = {
  entrepotUtilisateur: EntrepotUtilisateur;
  constructeurAidant: ConstructeurAidant;
  entrepotAidant: EntrepotAidant;
  constructeurUtilisateur: ConstructeurUtilisateur;
};

export const unCompteAidantRelieAUnCompteUtilisateur = async (
  parametres: ParametresLiaisonAidant
): Promise<{ utilisateur: Utilisateur; aidant: Aidant }> => {
  const utilisateur = parametres.constructeurUtilisateur.construis();
  await parametres.entrepotUtilisateur.persiste(utilisateur);
  const aidant = parametres.constructeurAidant
    .avecUnIdentifiant(utilisateur.identifiant)
    .avecUnNomPrenom(utilisateur.nomPrenom)
    .construis();
  await parametres.entrepotAidant.persiste(aidant);
  return { utilisateur, aidant };
};
type ParametresLiaisonUtilisateurInscrit = {
  constructeurUtilisateurInscrit: ConstructeurUtilisateurInscrit;
  constructeurUtilisateur: ConstructeurUtilisateur;
  entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit;
  entrepotUtilisateur: EntrepotUtilisateur;
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
    .construis();
  await parametres.entrepotUtilisateurInscrit.persiste(utilisateurInscrit);
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
