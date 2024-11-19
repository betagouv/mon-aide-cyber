import {
  construisErreurSimple,
  ErreurFormulaire,
} from '../../../composants/alertes/Erreurs.tsx';
import { estMailValide } from '../../../validateurs/email.ts';

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

type ErreursFormulaireDemandeAutodiagnostic = {
  adresseElectronique?: ErreurFormulaire;
  cguValidees?: ErreurFormulaire;
};

export type EtatFormulaireDemandeAutodiagnostic = {
  cguValidees: boolean;
  email: string;
  pretPourEnvoi: boolean;
  erreurs?: ErreursFormulaireDemandeAutodiagnostic;
};

enum TypeActionFormulaireDemandeAutodiagnostic {
  ADRESSE_ELECTRONIQUE_SAISIE = 'ADRESSE_ELECTRONIQUE_SAISIE',
  CGU_CLIQUEES = 'CGU_CLIQUEES',
}

type ActionFormulaireDemandeAutodiagnostic =
  | {
      type: TypeActionFormulaireDemandeAutodiagnostic.ADRESSE_ELECTRONIQUE_SAISIE;
      adresseElectronique: string;
    }
  | {
      type: TypeActionFormulaireDemandeAutodiagnostic.CGU_CLIQUEES;
    };

const supprimeObjetErreursSiFormulaireValide = (
  etatCourant: EtatFormulaireDemandeAutodiagnostic
) => {
  if (etatCourant.erreurs && Object.keys(etatCourant.erreurs).length === 0) {
    delete etatCourant['erreurs'];
  }
};

type ChampNouvelEtat = { [clef: string]: boolean | string };

type ParametreGenerationNouvelEtat = {
  champ: keyof ErreursFormulaireDemandeAutodiagnostic;
  champValide: () => boolean;
  elementsFormulairesValides: () => boolean;
  construisErreurChamp: (
    bool: boolean
  ) => { [p: string]: ErreurFormulaire } | undefined;
  ajouteAuNouvelEtat: () => ChampNouvelEtat;
};

const regenereEtatFormulaire = (
  etatPrecedent: EtatFormulaireDemandeAutodiagnostic,
  {
    champ,
    champValide,
    elementsFormulairesValides,
    construisErreurChamp,
    ajouteAuNouvelEtat,
  }: ParametreGenerationNouvelEtat
): EtatFormulaireDemandeAutodiagnostic => {
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

export const reducteurFormulaireDemandeAutodiagnostic = (
  etat: EtatFormulaireDemandeAutodiagnostic,
  action: ActionFormulaireDemandeAutodiagnostic
): EtatFormulaireDemandeAutodiagnostic => {
  switch (action.type) {
    case TypeActionFormulaireDemandeAutodiagnostic.ADRESSE_ELECTRONIQUE_SAISIE: {
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
    case TypeActionFormulaireDemandeAutodiagnostic.CGU_CLIQUEES: {
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
): ActionFormulaireDemandeAutodiagnostic => ({
  type: TypeActionFormulaireDemandeAutodiagnostic.ADRESSE_ELECTRONIQUE_SAISIE,
  adresseElectronique,
});
export const cguCliquees = (): ActionFormulaireDemandeAutodiagnostic => ({
  type: TypeActionFormulaireDemandeAutodiagnostic.CGU_CLIQUEES,
});

export const initialiseFormulaireDemandeAutodiagnostic =
  (): EtatFormulaireDemandeAutodiagnostic => ({
    cguValidees: false,
    email: '',
    pretPourEnvoi: false,
  });
