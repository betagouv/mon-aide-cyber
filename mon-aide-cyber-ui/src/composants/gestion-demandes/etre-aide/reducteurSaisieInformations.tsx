import { construisErreur, PresentationErreur } from '../../alertes/Erreurs.tsx';
import { Departement } from '../../../domaine/gestion-demandes/departement.ts';
import { estMailValide } from '../../../validateurs/email.ts';

type ErreurSaisieInformations = {
  cguValidees?: PresentationErreur;
  departement?: PresentationErreur;
  adresseElectronique?: PresentationErreur;
};

export type EtatSaisieInformations = {
  cguValidees: boolean;
  departement: Departement;
  email: string;
  erreur?: ErreurSaisieInformations;
  raisonSociale?: string;
  pretPourEnvoi: boolean;
  departements: Departement[];
  relationAidantSaisie: boolean;
  valeurSaisieDepartement: string;
};

enum TypeActionSaisieInformations {
  ADRESSE_ELECTRONIQUE_SAISIE = 'ADRESSE_ELECTRONIQUE_SAISIE',
  DEPARTEMENT_SAISI = 'DEPARTEMENT_SAISI',
  RAISON_SOCIALE_SAISIE = 'RAISON_SOCIALE_SAISIE',
  CGU_VALIDEES = 'CGU_VALIDEES',
  DEPARTEMENTS_CHARGES = 'DEPARTEMENTS_CHARGES',
  RELATION_AIDANT_CLIQUEE = 'RELATION_AIDANT_CLIQUEE',
}

type ActionSaisieInformations =
  | {
      type: TypeActionSaisieInformations.DEPARTEMENTS_CHARGES;
      departements: Departement[];
    }
  | {
      type: TypeActionSaisieInformations.ADRESSE_ELECTRONIQUE_SAISIE;
      adresseElectronique: string;
    }
  | {
      type: TypeActionSaisieInformations.CGU_VALIDEES;
    }
  | {
      type: TypeActionSaisieInformations.DEPARTEMENT_SAISI;
      departement: Departement | string;
    }
  | {
      type: TypeActionSaisieInformations.RAISON_SOCIALE_SAISIE;
      raisonSociale: string;
    }
  | {
      type: TypeActionSaisieInformations.RELATION_AIDANT_CLIQUEE;
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

type ChampNouvelEtat = { [clef: string]: boolean | string | Departement };

type ParametreGenerationNouvelEtat = {
  champ: keyof ErreurSaisieInformations;
  champValide: () => boolean;
  elementsFormulairesValides: () => boolean;
  construisErreurChamp: (
    bool: boolean
  ) => { [p: string]: PresentationErreur } | undefined;
  ajouteAuNouvelEtat: () => ChampNouvelEtat;
};

export const reducteurSaisieInformations = (
  etat: EtatSaisieInformations,
  action: ActionSaisieInformations
): EtatSaisieInformations => {
  const videLesErreurs = (etatCourant: EtatSaisieInformations) => {
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
  ): EtatSaisieInformations => {
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

  switch (action.type) {
    case TypeActionSaisieInformations.RELATION_AIDANT_CLIQUEE: {
      return { ...etat, relationAidantSaisie: !etat.relationAidantSaisie };
    }
    case TypeActionSaisieInformations.DEPARTEMENTS_CHARGES: {
      return {
        ...etat,
        departements: action.departements,
      };
    }
    case TypeActionSaisieInformations.CGU_VALIDEES: {
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
    case TypeActionSaisieInformations.ADRESSE_ELECTRONIQUE_SAISIE: {
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
    case TypeActionSaisieInformations.DEPARTEMENT_SAISI: {
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
    case TypeActionSaisieInformations.RAISON_SOCIALE_SAISIE: {
      return {
        ...etat,
        raisonSociale: action.raisonSociale,
      };
    }
  }
};

export const departementsCharges = (
  departements: Departement[]
): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.DEPARTEMENTS_CHARGES,
  departements,
});
export const adresseElectroniqueSaisie = (
  adresseElectronique: string
): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.ADRESSE_ELECTRONIQUE_SAISIE,
  adresseElectronique,
});
export const departementSaisi = (
  departement: Departement | string
): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.DEPARTEMENT_SAISI,
  departement,
});
export const raisonSocialeSaisie = (
  raisonSociale: string
): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.RAISON_SOCIALE_SAISIE,
  raisonSociale,
});
export const cguValidees = (): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.CGU_VALIDEES,
});
export const relationAidantCliquee = (): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.RELATION_AIDANT_CLIQUEE,
});
export const initialiseEtatSaisieInformations = (
  departements: Departement[]
): EtatSaisieInformations => ({
  cguValidees: false,
  departement: {} as Departement,
  email: '',
  pretPourEnvoi: false,
  departements: departements,
  relationAidantSaisie: false,
  valeurSaisieDepartement: '',
});
