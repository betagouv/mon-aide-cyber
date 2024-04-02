import { construisErreur, PresentationErreur } from '../alertes/Erreurs.tsx';

type ErreurSaisieInformations = {
  cguValidees?: PresentationErreur;
  departement?: PresentationErreur;
  adresseElectronique?: PresentationErreur;
};

type Departement = { nom: string; code: string };
export type EtatSaisieInformations = {
  cguValidees: boolean;
  departement: string;
  email: string;
  erreur?: ErreurSaisieInformations;
  raisonSociale?: string;
  pretPourEnvoi: boolean;
  departements: Departement[];
  departementsFiltres: Departement[];
};

enum TypeActionSaisieInformations {
  ADRESSE_ELECTRONIQUE_SAISIE = 'ADRESSE_ELECTRONIQUE_SAISIE',
  DEPARTEMENT_SAISI = 'DEPARTEMENT_SAISI',
  RAISON_SOCIALE_SAISIE = 'RAISON_SOCIALE_SAISIE',
  CGU_VALIDEES = 'CGU_VALIDEES',
  DEMANDE_TERMINEE = 'DEMANDE_TERMINEE',
  DEPARTEMENT_SELECTIONNE = 'DEPARTEMENT_SELECTIONNE',
  SAISIE_DEPARTEMENT_QUITTEE = 'SAISIE_DEPARTEMENT_QUITTEE',
}

type ActionSaisieInformations =
  | {
      type: TypeActionSaisieInformations.ADRESSE_ELECTRONIQUE_SAISIE;
      adresseElectronique: string;
    }
  | {
      type: TypeActionSaisieInformations.CGU_VALIDEES;
    }
  | {
      type: TypeActionSaisieInformations.DEPARTEMENT_SAISI;
      departement: string;
    }
  | {
      type: TypeActionSaisieInformations.DEPARTEMENT_SELECTIONNE;
      departement: string;
    }
  | {
      type: TypeActionSaisieInformations.SAISIE_DEPARTEMENT_QUITTEE;
    }
  | {
      type: TypeActionSaisieInformations.RAISON_SOCIALE_SAISIE;
      raisonSociale: string;
    }
  | {
      type: TypeActionSaisieInformations.DEMANDE_TERMINEE;
    };

const estUnEmail = (email: string) => {
  const emailMatch = email
    .trim()
    .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  return (emailMatch && emailMatch?.length > 0) || false;
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

export const reducteurSaisieInformations = (
  etat: EtatSaisieInformations,
  action: ActionSaisieInformations,
): EtatSaisieInformations => {
  const videLesErreurs = (etatCourant: EtatSaisieInformations) => {
    if (etatCourant.erreur && Object.keys(etatCourant.erreur).length === 0) {
      delete etatCourant['erreur'];
    }
  };

  const estDepartementValide = (departement: string) =>
    etat.departements.filter(
      (d) => d.nom.toLowerCase() === departement.toLowerCase().trim(),
    ).length > 0;

  switch (action.type) {
    case TypeActionSaisieInformations.DEMANDE_TERMINEE: {
      const emailValide = estUnEmail(etat.email);
      const etatCourant = { ...etat };
      const departementValide = estDepartementValide(etat.departement);
      const cguValidees = etat.cguValidees;
      const pretPourEnvoi = emailValide && departementValide && cguValidees;

      if (pretPourEnvoi) {
        delete etatCourant.erreur;
      }

      return {
        ...etatCourant,
        pretPourEnvoi,
        ...(!pretPourEnvoi && {
          erreur: {
            ...etatCourant.erreur,
            ...construisErreurAdresseElectronique(emailValide),
            ...construisErreurDepartement(departementValide),
            ...construisErreurCGUValidess(cguValidees),
          },
        }),
      };
    }
    case TypeActionSaisieInformations.CGU_VALIDEES: {
      const cguValidees = !etat.cguValidees;
      const etatCourant = { ...etat };

      if (cguValidees) {
        delete etatCourant.erreur?.['cguValidees'];
        videLesErreurs(etatCourant);
      }

      return {
        ...etatCourant,
        cguValidees: cguValidees,
        ...(!cguValidees && {
          erreur: {
            ...etatCourant.erreur,
            ...construisErreur('cguValidees', {
              identifiantTexteExplicatif: 'cguValidees',
              texte: 'Veuillez valider les CGU.',
            }),
          },
        }),
      };
    }
    case TypeActionSaisieInformations.ADRESSE_ELECTRONIQUE_SAISIE: {
      const emailValide = estUnEmail(action.adresseElectronique);
      const etatCourant = { ...etat };
      if (emailValide) {
        delete etatCourant.erreur?.['adresseElectronique'];
        videLesErreurs(etatCourant);
      }
      return {
        ...etatCourant,
        email: action.adresseElectronique,
      };
    }
    case TypeActionSaisieInformations.DEPARTEMENT_SAISI: {
      const departementValide = estDepartementValide(action.departement);
      const etatCourant = { ...etat };

      if (departementValide) {
        delete etatCourant.erreur?.['departement'];
        videLesErreurs(etatCourant);
      }

      const departementsFiltres = etatCourant.departements.filter(
        (departement) =>
          departement.nom
            .toLowerCase()
            .includes(action.departement.toLowerCase()) ||
          departement.code.includes(action.departement),
      );
      return {
        ...etatCourant,
        departement: action.departement,
        departementsFiltres,
      };
    }
    case TypeActionSaisieInformations.DEPARTEMENT_SELECTIONNE: {
      const etatCourant = { ...etat };
      delete etatCourant.erreur?.['departement'];
      videLesErreurs(etatCourant);
      return {
        ...etat,
        departement: action.departement,
        departementsFiltres: [],
      };
    }
    case TypeActionSaisieInformations.SAISIE_DEPARTEMENT_QUITTEE: {
      return { ...etat, departementsFiltres: [] };
    }
    case TypeActionSaisieInformations.RAISON_SOCIALE_SAISIE: {
      return {
        ...etat,
        raisonSociale: action.raisonSociale,
      };
    }
  }
};

export const adresseElectroniqueSaisie = (
  adresseElectronique: string,
): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.ADRESSE_ELECTRONIQUE_SAISIE,
  adresseElectronique,
});
export const departementSaisi = (
  departement: string,
): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.DEPARTEMENT_SAISI,
  departement,
});
export const raisonSocialeSaisie = (
  raisonSociale: string,
): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.RAISON_SOCIALE_SAISIE,
  raisonSociale,
});
export const cguValidees = (): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.CGU_VALIDEES,
});
export const demandeTerminee = (): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.DEMANDE_TERMINEE,
});
export const departementSelectionne = (
  departement: string,
): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.DEPARTEMENT_SELECTIONNE,
  departement,
});
export const initialiseEtatSaisieInformations = (
  departements: Departement[],
): EtatSaisieInformations => ({
  cguValidees: false,
  departement: '',
  email: '',
  pretPourEnvoi: false,
  departements: departements,
  departementsFiltres: [],
});
