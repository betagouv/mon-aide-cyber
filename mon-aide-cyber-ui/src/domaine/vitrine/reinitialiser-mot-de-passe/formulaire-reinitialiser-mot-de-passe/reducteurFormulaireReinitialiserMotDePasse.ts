import {
  construisErreurSimple,
  ErreurFormulaire,
} from '../../../../composants/alertes/Erreurs.tsx';

const supprimeObjetErreursSiFormulaireValide = (
  etatCourant: EtatFormulaireReinitialiserMotDePasse
) => {
  if (etatCourant.erreurs && Object.keys(etatCourant.erreurs).length === 0) {
    delete etatCourant['erreurs'];
  }
};

type ChampNouvelEtat = { [clef: string]: boolean | string };

type ParametreGenerationNouvelEtat = {
  champ: keyof ErreursFormulaireReinitialiserMotDePasse;
  champValide: () => boolean;
  elementsFormulairesValides: () => boolean;
  construisErreurChamp: (
    bool: boolean
  ) => { [p: string]: ErreurFormulaire } | undefined;
  ajouteAuNouvelEtat: () => ChampNouvelEtat;
};

const regenereEtatFormulaire = (
  etatPrecedent: EtatFormulaireReinitialiserMotDePasse,
  {
    champ,
    champValide,
    elementsFormulairesValides,
    construisErreurChamp,
    ajouteAuNouvelEtat,
  }: ParametreGenerationNouvelEtat
): EtatFormulaireReinitialiserMotDePasse => {
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
    ...Object.entries(ajouteAuNouvelEtat()).reduce((prev, [clef, valeur]) => {
      prev[clef] = valeur;
      return prev;
    }, {} as ChampNouvelEtat),
  };
};

const construisErreurConfirmationMotDePasse = (motDePasseValide: boolean) =>
  !motDePasseValide
    ? construisErreurSimple(
        'confirmationMotDePasse',
        'Les deux mots de passe doivent correspondre'
      )
    : undefined;

type ErreursFormulaireReinitialiserMotDePasse = {
  motDePasse?: ErreurFormulaire;
  confirmationMotDePasse?: ErreurFormulaire;
};

export type EtatFormulaireReinitialiserMotDePasse = {
  motDePasse: string;
  confirmationMotDePasse: string;
  pretPourEnvoi: boolean;
  erreurs?: ErreursFormulaireReinitialiserMotDePasse;
};

enum TypeActionFormulaireReinitialiserMotDePasse {
  MOT_DE_PASSE_SAISI = 'MOT_DE_PASSE_SAISI',
  CONFIRMATION_MOT_DE_PASSE_SAISI = 'CONFIRMATION_MOT_DE_PASSE_SAISI',
}

type ActionFormulaireReinitialiserMotDePasse =
  | {
      type: TypeActionFormulaireReinitialiserMotDePasse.MOT_DE_PASSE_SAISI;
      motDePasse: string;
    }
  | {
      type: TypeActionFormulaireReinitialiserMotDePasse.CONFIRMATION_MOT_DE_PASSE_SAISI;
      confirmationMotDePasse: string;
    };

export const reducteurFormulaireReinitialiserMotDePasse = (
  etat: EtatFormulaireReinitialiserMotDePasse,
  action: ActionFormulaireReinitialiserMotDePasse
): EtatFormulaireReinitialiserMotDePasse => {
  switch (action.type) {
    case TypeActionFormulaireReinitialiserMotDePasse.MOT_DE_PASSE_SAISI: {
      const etatCourant = { ...etat };

      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ motDePasse: action.motDePasse }),
        champ: 'motDePasse',
        champValide: () => !!action.motDePasse,
        construisErreurChamp: (_bool: boolean) => undefined,
        elementsFormulairesValides: () => action.motDePasse.trim().length > 0,
      });
    }
    case TypeActionFormulaireReinitialiserMotDePasse.CONFIRMATION_MOT_DE_PASSE_SAISI: {
      const etatCourant = { ...etat };

      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({
          confirmationMotDePasse: action.confirmationMotDePasse,
        }),
        champ: 'confirmationMotDePasse',
        champValide: () =>
          !!action.confirmationMotDePasse &&
          action.confirmationMotDePasse === etat.motDePasse,
        construisErreurChamp: (bool: boolean) =>
          construisErreurConfirmationMotDePasse(bool),
        elementsFormulairesValides: () =>
          etat.motDePasse === action.confirmationMotDePasse,
      });
    }
  }
};

export const motDePasseSaisi = (
  motDePasse: string
): ActionFormulaireReinitialiserMotDePasse => ({
  motDePasse,
  type: TypeActionFormulaireReinitialiserMotDePasse.MOT_DE_PASSE_SAISI,
});

export const confirmationMotDePasseSaisi = (
  confirmationMotDePasse: string
): ActionFormulaireReinitialiserMotDePasse => ({
  confirmationMotDePasse: confirmationMotDePasse,
  type: TypeActionFormulaireReinitialiserMotDePasse.CONFIRMATION_MOT_DE_PASSE_SAISI,
});

export const initialiseFormulaireReinitialiserMotDePasse =
  (): EtatFormulaireReinitialiserMotDePasse => ({
    motDePasse: '',
    confirmationMotDePasse: '',
    pretPourEnvoi: false,
  });
