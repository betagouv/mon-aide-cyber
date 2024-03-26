import { ReactElement } from 'react';
import { construisErreur, PresentationErreur } from '../alertes/Erreurs.tsx';

type ErreurSaisieInformations = {
  cguValidees?: PresentationErreur;
  departement?: PresentationErreur;
  adresseElectronique?: PresentationErreur;
};

export type EtatSaisieInformations = {
  cguValidees: boolean;
  champsErreur?: ReactElement;
  departement: string;
  email: string;
  erreur?: ErreurSaisieInformations;
  raisonSociale?: string;
  pretPourEnvoi: boolean;
};

enum TypeActionSaisieInformations {
  ADRESSE_ELECTRONIQUE_SAISIE = 'ADRESSE_ELECTRONIQUE_SAISIE',
  DEPARTEMENT_SAISI = 'DEPARTEMENT_SAISI',
  RAISON_SOCIALE_SAISIE = 'RAISON_SOCIALE_SAISIE',
  CGU_VALIDEES = 'CGU_VALIDEES',
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
      type: TypeActionSaisieInformations.RAISON_SOCIALE_SAISIE;
      raisonSociale: string;
    };

const estUnEmail = (email: string) => {
  const emailMatch = email
    .trim()
    .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  return (emailMatch && emailMatch?.length > 0) || false;
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

  switch (action.type) {
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
      const departementValide = action.departement.trim().length > 0;
      const etatCourant = { ...etat };

      if (departementValide) {
        delete etatCourant.erreur?.['departement'];
        videLesErreurs(etatCourant);
      }

      return {
        ...etatCourant,
        departement: action.departement,
      };
    }
    case TypeActionSaisieInformations.RAISON_SOCIALE_SAISIE: {
      return {
        ...etat,
        raisonSociale: action.raisonSociale,
      };
    }
  }
  return {} as EtatSaisieInformations;
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
export const initialiseEtatSaisieInformations = (): EtatSaisieInformations => ({
  cguValidees: false,
  departement: '',
  email: '',
  pretPourEnvoi: false,
});
