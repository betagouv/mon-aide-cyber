import { construisErreur, PresentationErreur } from '../../alertes/Erreurs.tsx';
import { Departement } from '../../../domaine/gestion-demandes/departement.ts';
import { estMailValide } from '../../../validateurs/email.ts';

type ErreurFormulaireDemandeEtreAide = {
  cguValidees?: PresentationErreur;
  departement?: PresentationErreur;
  adresseElectronique?: PresentationErreur;
  relationAidantSaisie?: PresentationErreur;
  relationUtilisateurSaisie?: PresentationErreur;
};

export type Email = string;

export type EtatFormulaireDemandeEtreAide = {
  cguValidees: boolean;
  departement: Departement;
  email: string;
  erreur?: ErreurFormulaireDemandeEtreAide;
  raisonSociale?: string;
  pretPourEnvoi: boolean;
  departements: Departement[];
  relationUtilisateurSaisie: undefined | 'Non' | Email;
  relationUtilisateurFournie?: true;
  valeurSaisieDepartement: string;
};

enum TypeActionFormulaireDemandeEtreAide {
  ADRESSE_ELECTRONIQUE_SAISIE = 'ADRESSE_ELECTRONIQUE_SAISIE',
  DEPARTEMENT_SAISI = 'DEPARTEMENT_SAISI',
  RAISON_SOCIALE_SAISIE = 'RAISON_SOCIALE_SAISIE',
  CGU_VALIDEES = 'CGU_VALIDEES',
  DEPARTEMENTS_CHARGES = 'DEPARTEMENTS_CHARGES',
  RELATION_AIDANT_CLIQUEE = 'RELATION_AIDANT_CLIQUEE',
  EMAIL_UTILISATEUR_SAISI = 'EMAIL_UTILISATEUR_SAISI',
  EMAIL_UTILISATEUR_FOURNI = 'EMAIL_UTILISATEUR_FOURNI',
}

type ActionFormulaireDemandeEtreAide =
  | {
      type: TypeActionFormulaireDemandeEtreAide.DEPARTEMENTS_CHARGES;
      departements: Departement[];
    }
  | {
      type: TypeActionFormulaireDemandeEtreAide.ADRESSE_ELECTRONIQUE_SAISIE;
      adresseElectronique: string;
    }
  | {
      type: TypeActionFormulaireDemandeEtreAide.CGU_VALIDEES;
    }
  | {
      type: TypeActionFormulaireDemandeEtreAide.DEPARTEMENT_SAISI;
      departement: Departement | string;
    }
  | {
      type: TypeActionFormulaireDemandeEtreAide.RAISON_SOCIALE_SAISIE;
      raisonSociale: string;
    }
  | {
      type: TypeActionFormulaireDemandeEtreAide.RELATION_AIDANT_CLIQUEE;
      estEnRelation: boolean;
    }
  | {
      type: TypeActionFormulaireDemandeEtreAide.EMAIL_UTILISATEUR_SAISI;
      email: string;
    }
  | {
      type: TypeActionFormulaireDemandeEtreAide.EMAIL_UTILISATEUR_FOURNI;
      email: string;
    };

const construisErreurAdresseElectronique = (emailValide: boolean) =>
  !emailValide
    ? construisErreur('adresseElectronique', {
        identifiantTexteExplicatif: 'adresse-electronique',
        texte: 'Veuillez saisir une adresse électronique valide.',
      })
    : undefined;

const construisErreurDepartement = (departementValide: boolean) => {
  return !departementValide
    ? construisErreur('departement', {
        identifiantTexteExplicatif: 'departement',
        texte: 'Veuillez saisir un département valide.',
      })
    : undefined;
};

const construisErreurCGUValidess = (cguValidees: boolean) => {
  return !cguValidees
    ? construisErreur('cguValidees', {
        identifiantTexteExplicatif: 'cguValidees',
        texte: 'Veuillez valider les CGU.',
      })
    : undefined;
};

const construisErreurRelationUtilisateurSaisie = (
  relationUtilisateurSaisie: boolean
) => {
  return !relationUtilisateurSaisie
    ? construisErreur('relationUtilisateurSaisie', {
        identifiantTexteExplicatif: 'relation-utilisateur-saisie',
        texte: 'Veuillez saisir un Email valide.',
      })
    : undefined;
};

type ChampNouvelEtat = { [clef: string]: boolean | string | Departement };

type ParametreGenerationNouvelEtat = {
  champ: keyof ErreurFormulaireDemandeEtreAide;
  champValide: () => boolean;
  elementsFormulairesValides: () => boolean;
  construisErreurChamp: (
    bool: boolean
  ) => { [p: string]: PresentationErreur } | undefined;
  ajouteAuNouvelEtat: () => ChampNouvelEtat;
};

export const reducteurFormulaireDemandeEtreAide = (
  etat: EtatFormulaireDemandeEtreAide,
  action: ActionFormulaireDemandeEtreAide
): EtatFormulaireDemandeEtreAide => {
  const videLesErreurs = (etatCourant: EtatFormulaireDemandeEtreAide) => {
    if (etatCourant.erreur && Object.keys(etatCourant.erreur).length === 0) {
      delete etatCourant['erreur'];
    }
  };

  const estChaineDeCaractere = (
    departement: Departement | string
  ): departement is string => typeof departement === 'string';

  const departementUniqueTrouve = (departement: string) =>
    etat.departements.filter(
      (d) =>
        d.nom.toLowerCase() === departement.toLowerCase().trim() ||
        d.code === departement.trim()
    ).length === 1;

  const estDepartementValide = (departement: Departement | string) =>
    estChaineDeCaractere(departement)
      ? departementUniqueTrouve(departement)
      : true;

  const trouveDepartement = (
    departementCherche: Departement | string
  ): Departement => {
    const valeurSaisie = departementCherche;
    return estChaineDeCaractere(valeurSaisie)
      ? etat.departements.find(
          (departement) =>
            departement.nom.toLowerCase() ===
              valeurSaisie.toLowerCase().trim() ||
            departement.code === valeurSaisie.trim()
        ) || ({} as Departement)
      : valeurSaisie;
  };

  const genereNouvelEtat = (
    parametres: ParametreGenerationNouvelEtat
  ): EtatFormulaireDemandeEtreAide => {
    const etatCourant = { ...etat };
    const valide = parametres.champValide();
    if (valide) {
      delete etatCourant.erreur?.[parametres.champ];
      videLesErreurs(etatCourant);
    }
    return {
      ...etatCourant,
      pretPourEnvoi: valide && parametres.elementsFormulairesValides(),
      ...(!valide && {
        erreur: {
          ...etatCourant.erreur,
          ...parametres.construisErreurChamp(valide),
        },
      }),
      ...Object.entries(parametres.ajouteAuNouvelEtat()).reduce(
        (etatPrecedent, [clef, valeur]) => {
          etatPrecedent[clef] = valeur;
          return etatPrecedent;
        },
        {} as ChampNouvelEtat
      ),
    };
  };

  const genereEtatAvecEmailUtilisateur = (
    email: string,
    emailUtilisateurFourni = false
  ): EtatFormulaireDemandeEtreAide => {
    const emailUtilisateur = email.trim().toLowerCase();
    return genereNouvelEtat({
      ajouteAuNouvelEtat: () => ({
        relationUtilisateurSaisie: estMailValide(emailUtilisateur)
          ? emailUtilisateur
          : '',
        ...(emailUtilisateurFourni && { relationUtilisateurFournie: true }),
      }),
      champ: 'relationUtilisateurSaisie',
      champValide: () => estMailValide(emailUtilisateur),
      construisErreurChamp: (bool: boolean) =>
        construisErreurRelationUtilisateurSaisie(bool),
      elementsFormulairesValides: () =>
        estMailValide(etat.email) &&
        estDepartementValide(etat.departement) &&
        etat.cguValidees,
    });
  };

  switch (action.type) {
    case TypeActionFormulaireDemandeEtreAide.EMAIL_UTILISATEUR_FOURNI:
      return genereEtatAvecEmailUtilisateur(action.email, true);
    case TypeActionFormulaireDemandeEtreAide.EMAIL_UTILISATEUR_SAISI: {
      return genereEtatAvecEmailUtilisateur(action.email);
    }
    case TypeActionFormulaireDemandeEtreAide.RELATION_AIDANT_CLIQUEE: {
      return genereNouvelEtat({
        ajouteAuNouvelEtat: () => ({
          relationUtilisateurSaisie: !action.estEnRelation ? 'Non' : '',
        }),
        champ: 'relationUtilisateurSaisie',
        champValide: () => true,
        construisErreurChamp: (_bool: boolean) => undefined,
        elementsFormulairesValides: () =>
          estMailValide(etat.email) &&
          estDepartementValide(etat.departement) &&
          etat.cguValidees,
      });
    }
    case TypeActionFormulaireDemandeEtreAide.DEPARTEMENTS_CHARGES: {
      return {
        ...etat,
        departements: action.departements,
      };
    }
    case TypeActionFormulaireDemandeEtreAide.CGU_VALIDEES: {
      const cguValidees = !etat.cguValidees;
      return genereNouvelEtat({
        ajouteAuNouvelEtat: () => ({ cguValidees: cguValidees }),
        champ: 'cguValidees',
        champValide: () => cguValidees,
        construisErreurChamp: (bool: boolean) =>
          construisErreurCGUValidess(bool),
        elementsFormulairesValides: () =>
          estMailValide(etat.email) && estDepartementValide(etat.departement),
      });
    }
    case TypeActionFormulaireDemandeEtreAide.ADRESSE_ELECTRONIQUE_SAISIE: {
      return genereNouvelEtat({
        ajouteAuNouvelEtat: () => ({ email: action.adresseElectronique }),
        champ: 'adresseElectronique',
        champValide: () => estMailValide(action.adresseElectronique),
        construisErreurChamp: (bool: boolean) =>
          construisErreurAdresseElectronique(bool),
        elementsFormulairesValides: () =>
          estDepartementValide(etat.valeurSaisieDepartement) &&
          etat.cguValidees,
      });
    }
    case TypeActionFormulaireDemandeEtreAide.DEPARTEMENT_SAISI: {
      return genereNouvelEtat({
        ajouteAuNouvelEtat: () => {
          const departement = trouveDepartement(action.departement);
          return {
            departement,
            valeurSaisieDepartement:
              departement.nom || (action.departement as string),
          };
        },
        champ: 'departement',
        champValide: () => estDepartementValide(action.departement),
        construisErreurChamp: (bool: boolean) =>
          construisErreurDepartement(bool),
        elementsFormulairesValides: () =>
          estMailValide(etat.email) && etat.cguValidees,
      });
    }
    case TypeActionFormulaireDemandeEtreAide.RAISON_SOCIALE_SAISIE: {
      return {
        ...etat,
        raisonSociale: action.raisonSociale,
      };
    }
  }
};

export const departementsCharges = (
  departements: Departement[]
): ActionFormulaireDemandeEtreAide => ({
  type: TypeActionFormulaireDemandeEtreAide.DEPARTEMENTS_CHARGES,
  departements,
});
export const adresseElectroniqueSaisie = (
  adresseElectronique: string
): ActionFormulaireDemandeEtreAide => ({
  type: TypeActionFormulaireDemandeEtreAide.ADRESSE_ELECTRONIQUE_SAISIE,
  adresseElectronique,
});
export const departementSaisi = (
  departement: Departement | string
): ActionFormulaireDemandeEtreAide => ({
  type: TypeActionFormulaireDemandeEtreAide.DEPARTEMENT_SAISI,
  departement,
});
export const raisonSocialeSaisie = (
  raisonSociale: string
): ActionFormulaireDemandeEtreAide => ({
  type: TypeActionFormulaireDemandeEtreAide.RAISON_SOCIALE_SAISIE,
  raisonSociale,
});
export const cguValidees = (): ActionFormulaireDemandeEtreAide => ({
  type: TypeActionFormulaireDemandeEtreAide.CGU_VALIDEES,
});
export const relationUtilisateurCliquee = (
  estEnRelation: boolean
): ActionFormulaireDemandeEtreAide => ({
  type: TypeActionFormulaireDemandeEtreAide.RELATION_AIDANT_CLIQUEE,
  estEnRelation,
});
export const emailUtilisateurSaisi = (
  email: string
): ActionFormulaireDemandeEtreAide => ({
  email,
  type: TypeActionFormulaireDemandeEtreAide.EMAIL_UTILISATEUR_SAISI,
});
export const emailUtilisateurFourni = (
  email: string
): ActionFormulaireDemandeEtreAide => ({
  email,
  type: TypeActionFormulaireDemandeEtreAide.EMAIL_UTILISATEUR_FOURNI,
});
export const initialiseEtatFormulaireDemandeEtreAide = (
  departements: Departement[]
): EtatFormulaireDemandeEtreAide => ({
  cguValidees: false,
  departement: {} as Departement,
  email: '',
  pretPourEnvoi: false,
  departements: departements,
  relationUtilisateurSaisie: undefined,
  valeurSaisieDepartement: '',
});
