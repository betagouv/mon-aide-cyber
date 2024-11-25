import {
  construisErreurSimple,
  ErreurFormulaire,
} from '../../../composants/alertes/Erreurs.tsx';

const construisErreurCGUValidees = (cguValidees: boolean) => {
  return !cguValidees
    ? construisErreurSimple('cguValidees', 'Veuillez valider les CGU.')
    : undefined;
};

type ErreursFormulaireDemandeAutodiagnostic = {
  cguValidees?: ErreurFormulaire;
};

export type EtatFormulaireDemandeAutodiagnostic = {
  cguValidees: boolean;
  pretPourEnvoi: boolean;
  erreurs?: ErreursFormulaireDemandeAutodiagnostic;
};

enum TypeActionFormulaireDemandeAutodiagnostic {
  CGU_CLIQUEES = 'CGU_CLIQUEES',
}

type ActionFormulaireDemandeAutodiagnostic = {
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
    case TypeActionFormulaireDemandeAutodiagnostic.CGU_CLIQUEES: {
      const etatCourant = { ...etat };
      const cguValidees = !etatCourant.cguValidees;
      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ cguValidees: cguValidees }),
        champ: 'cguValidees',
        champValide: () => cguValidees,
        construisErreurChamp: (bool: boolean) =>
          construisErreurCGUValidees(bool),
        elementsFormulairesValides: () => true,
      });
    }
  }
};

export const cguCliquees = (): ActionFormulaireDemandeAutodiagnostic => ({
  type: TypeActionFormulaireDemandeAutodiagnostic.CGU_CLIQUEES,
});

export const initialiseFormulaireDemandeAutodiagnostic =
  (): EtatFormulaireDemandeAutodiagnostic => ({
    cguValidees: false,
    pretPourEnvoi: false,
  });
