import {
  construisErreurSimple,
  ErreurFormulaire,
} from '../../../../composants/alertes/Erreurs.tsx';
import { estMailValide } from '../../../../validateurs/email.ts';

const supprimeObjetErreursSiFormulaireValide = (
  etatCourant: EtatFormulaireMotDePasseOublie
) => {
  if (etatCourant.erreurs && Object.keys(etatCourant.erreurs).length === 0) {
    delete etatCourant['erreurs'];
  }
};

type ChampNouvelEtat = { [clef: string]: boolean | string };

type ParametreGenerationNouvelEtat = {
  champ: keyof ErreursFormulaireMotDePasseOublie;
  champValide: () => boolean;
  elementsFormulairesValides: () => boolean;
  construisErreurChamp: (
    bool: boolean
  ) => { [p: string]: ErreurFormulaire } | undefined;
  ajouteAuNouvelEtat: () => ChampNouvelEtat;
};

const regenereEtatFormulaire = (
  etatPrecedent: EtatFormulaireMotDePasseOublie,
  {
    champ,
    champValide,
    elementsFormulairesValides,
    construisErreurChamp,
    ajouteAuNouvelEtat,
  }: ParametreGenerationNouvelEtat
): EtatFormulaireMotDePasseOublie => {
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

const construisErreurAdresseElectronique = (emailValide: boolean) =>
  !emailValide
    ? construisErreurSimple(
        'adresseElectronique',
        'Veuillez saisir une adresse électronique valide.'
      )
    : undefined;

type ErreursFormulaireMotDePasseOublie = {
  adresseElectronique?: ErreurFormulaire;
};

export type EtatFormulaireMotDePasseOublie = {
  email: string;
  pretPourEnvoi: boolean;
  erreurs?: ErreursFormulaireMotDePasseOublie;
};

enum TypeActionFormulaireMotDePasseOublie {
  ADRESSE_ELECTRONIQUE_SAISIE = 'ADRESSE_ELECTRONIQUE_SAISIE',
}

type ActionFormulaireMotDePasseOublie = {
  type: TypeActionFormulaireMotDePasseOublie.ADRESSE_ELECTRONIQUE_SAISIE;
  adresseElectronique: string;
};

export const reducteurFormulaireMotDePasseOublie = (
  etat: EtatFormulaireMotDePasseOublie,
  action: ActionFormulaireMotDePasseOublie
) => {
  switch (action.type) {
    case TypeActionFormulaireMotDePasseOublie.ADRESSE_ELECTRONIQUE_SAISIE: {
      const etatCourant = { ...etat };

      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ email: action.adresseElectronique }),
        champ: 'adresseElectronique',
        champValide: () => estMailValide(action.adresseElectronique),
        construisErreurChamp: (bool: boolean) =>
          construisErreurAdresseElectronique(bool),
        elementsFormulairesValides: () => true,
      });
    }
  }
};

export const adresseElectroniqueSaisie = (
  adresseElectronique: string
): ActionFormulaireMotDePasseOublie => ({
  type: TypeActionFormulaireMotDePasseOublie.ADRESSE_ELECTRONIQUE_SAISIE,
  adresseElectronique,
});

export const initialiseFormulaireMotDePasseOublie =
  (): EtatFormulaireMotDePasseOublie => ({
    email: '',
    pretPourEnvoi: false,
  });
