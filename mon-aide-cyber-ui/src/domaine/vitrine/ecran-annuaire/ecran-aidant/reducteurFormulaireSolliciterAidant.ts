import {
  construisErreurSimple,
  ErreurFormulaire,
} from '../../../../composants/alertes/Erreurs.tsx';
import { estMailValide } from '../../../../validateurs/email.ts';

const construisErreurAdresseElectronique = (emailValide: boolean) =>
  !emailValide
    ? construisErreurSimple(
        'adresseElectronique',
        'Veuillez saisir une adresse électronique valide.'
      )
    : undefined;

const construisErreurCGUValidees = (cguValidees: boolean) => {
  return !cguValidees
    ? construisErreurSimple('cguValidees', 'Veuillez valider les CGU.')
    : undefined;
};

type ErreursFormulaireSolliciterAidant = {
  adresseElectronique?: ErreurFormulaire;
  cguValidees?: ErreurFormulaire;
};

export type EtatFormulaireSolliciterAidant = {
  cguValidees: boolean;
  email: string;
  raisonSociale?: string;
  pretPourEnvoi: boolean;
  erreurs?: ErreursFormulaireSolliciterAidant;
};

enum TypeActionFormulaireSolliciterAidant {
  ADRESSE_ELECTRONIQUE_SAISIE = 'ADRESSE_ELECTRONIQUE_SAISIE',
  RAISON_SOCIALE_SAISIE = 'RAISON_SOCIALE_SAISIE',
  CGU_CLIQUEES = 'CGU_CLIQUEES',
}

type ActionFormulaireSolliciterAidant =
  | {
      type: TypeActionFormulaireSolliciterAidant.ADRESSE_ELECTRONIQUE_SAISIE;
      adresseElectronique: string;
    }
  | {
      type: TypeActionFormulaireSolliciterAidant.RAISON_SOCIALE_SAISIE;
      raisonSociale: string;
    }
  | {
      type: TypeActionFormulaireSolliciterAidant.CGU_CLIQUEES;
    };

const supprimeObjetErreursSiFormulaireValide = (
  etatCourant: EtatFormulaireSolliciterAidant
) => {
  if (etatCourant.erreurs && Object.keys(etatCourant.erreurs).length === 0) {
    delete etatCourant['erreurs'];
  }
};

type ChampNouvelEtat = { [clef: string]: boolean | string };

type ParametreGenerationNouvelEtat = {
  champ: keyof ErreursFormulaireSolliciterAidant;
  champValide: () => boolean;
  elementsFormulairesValides: () => boolean;
  construisErreurChamp: (
    bool: boolean
  ) => { [p: string]: ErreurFormulaire } | undefined;
  ajouteAuNouvelEtat: () => ChampNouvelEtat;
};

const regenereEtatFormulaire = (
  etatPrecedent: EtatFormulaireSolliciterAidant,
  {
    champ,
    champValide,
    elementsFormulairesValides,
    construisErreurChamp,
    ajouteAuNouvelEtat,
  }: ParametreGenerationNouvelEtat
): EtatFormulaireSolliciterAidant => {
  const etatCourant = { ...etatPrecedent };
  const estChampValide = champValide();

  if (estChampValide) {
    delete etatCourant.erreurs?.[champ];
    supprimeObjetErreursSiFormulaireValide(etatCourant);
  }

  return {
    ...etatCourant,
    pretPourEnvoi: estChampValide && elementsFormulairesValides(),
    ...(!estChampValide && {
      erreurs: {
        ...etatCourant.erreurs,
        ...construisErreurChamp(estChampValide),
      },
    }),
    ...Object.entries(ajouteAuNouvelEtat()).reduce(
      (precedent, [clef, valeur]) => {
        precedent[clef] = valeur;
        return precedent;
      },
      {} as ChampNouvelEtat
    ),
  };
};

export const reducteurFormulaireSolliciterAidant = (
  etat: EtatFormulaireSolliciterAidant,
  action: ActionFormulaireSolliciterAidant
): EtatFormulaireSolliciterAidant => {
  switch (action.type) {
    case TypeActionFormulaireSolliciterAidant.ADRESSE_ELECTRONIQUE_SAISIE: {
      const etatCourant = { ...etat };

      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ email: action.adresseElectronique }),
        champ: 'adresseElectronique',
        champValide: () => estMailValide(action.adresseElectronique),
        construisErreurChamp: (bool: boolean) =>
          construisErreurAdresseElectronique(bool),
        elementsFormulairesValides: () => etat.cguValidees,
      });
    }
    case TypeActionFormulaireSolliciterAidant.RAISON_SOCIALE_SAISIE: {
      return {
        ...etat,
        raisonSociale: action.raisonSociale,
      };
    }
    case TypeActionFormulaireSolliciterAidant.CGU_CLIQUEES: {
      const etatCourant = { ...etat };
      const cguValidees = !etatCourant.cguValidees;
      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ cguValidees: cguValidees }),
        champ: 'cguValidees',
        champValide: () => cguValidees,
        construisErreurChamp: (bool: boolean) =>
          construisErreurCGUValidees(bool),
        elementsFormulairesValides: () => estMailValide(etat.email),
      });
    }
  }
};

export const adresseElectroniqueSaisie = (
  adresseElectronique: string
): ActionFormulaireSolliciterAidant => ({
  type: TypeActionFormulaireSolliciterAidant.ADRESSE_ELECTRONIQUE_SAISIE,
  adresseElectronique,
});
export const raisonSocialeSaisie = (
  raisonSociale: string
): ActionFormulaireSolliciterAidant => ({
  type: TypeActionFormulaireSolliciterAidant.RAISON_SOCIALE_SAISIE,
  raisonSociale,
});
export const cguCliquees = (): ActionFormulaireSolliciterAidant => ({
  type: TypeActionFormulaireSolliciterAidant.CGU_CLIQUEES,
});

export const initialiseFormulaireSolliciterAidant =
  (): EtatFormulaireSolliciterAidant => ({
    cguValidees: false,
    email: '',
    raisonSociale: '',
    pretPourEnvoi: false,
  });
