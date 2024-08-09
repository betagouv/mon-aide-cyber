import { construisErreur, PresentationErreur } from '../alertes/Erreurs.tsx';
import { estMailValide } from '../../validateurs/email.ts';

import { Departement } from '../../domaine/gestion-demandes/departement.ts';

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
  DEMANDE_TERMINEE = 'DEMANDE_TERMINEE',
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
    }
  | {
      type: TypeActionSaisieInformations.DEMANDE_TERMINEE;
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
    case TypeActionSaisieInformations.DEMANDE_TERMINEE: {
      const emailValide = estMailValide(etat.email);
      const etatCourant = { ...etat };
      const departementValide = estDepartementValide(
        etat.valeurSaisieDepartement
      );
      const cguValidees = etat.cguValidees;
      const pretPourEnvoi = emailValide && departementValide && cguValidees;

      if (pretPourEnvoi) {
        delete etatCourant.erreur;
      }

      return {
        ...etatCourant,
        pretPourEnvoi,
        departement: departementValide
          ? trouveDepartement(etat.valeurSaisieDepartement)
          : ({} as Departement),
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
      const emailValide = estMailValide(action.adresseElectronique);
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

      const departement = trouveDepartement(action.departement);
      return {
        ...etatCourant,
        departement,
        valeurSaisieDepartement: departement.nom,
      };
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
export const demandeTerminee = (): ActionSaisieInformations => ({
  type: TypeActionSaisieInformations.DEMANDE_TERMINEE,
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
