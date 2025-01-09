import {
  construisErreurSimple,
  ErreurFormulaire,
} from '../../../../composants/alertes/Erreurs.tsx';
import { Departement, estDepartement } from '../../departement.ts';

export type ErreursSaisieDemande = {
  cguValidees?: ErreurFormulaire;
  prenom?: ErreurFormulaire;
  nom?: ErreurFormulaire;
  mail?: ErreurFormulaire;
  departement?: ErreurFormulaire;
};
export type EtatDemande = {
  cguValidees: boolean;
  prenom: string;
  nom: string;
  mail: string;
  departement: string | Departement;
  erreurs?: ErreursSaisieDemande;
  pretPourEnvoi: boolean;
};

enum TypeAction {
  PRENOM_SAISI = 'PRENOM_SAISI',
  NOM_SAISI = 'NOM_SAISI',
  MAIL_SAISI = 'MAIL_SAISI',
  DEPARTEMENT_SAISI = 'DEPARTEMENT_SAISI',
  CGU_CLIQUEES = 'CGU_CLIQUEES',
}

type Action =
  | { type: TypeAction.PRENOM_SAISI; saisie: string }
  | { type: TypeAction.NOM_SAISI; saisie: string }
  | { type: TypeAction.MAIL_SAISI; saisie: string }
  | { type: TypeAction.DEPARTEMENT_SAISI; saisie: string | Departement }
  | { type: TypeAction.CGU_CLIQUEES };

const construisErreurPrenom = (prenomValide: boolean) => {
  return !prenomValide
    ? construisErreurSimple('prenom', 'Veuillez saisir un prénom valide')
    : undefined;
};

const construisErreurNom = (nomValide: boolean) => {
  return !nomValide
    ? construisErreurSimple('nom', 'Veuillez saisir un nom valide')
    : undefined;
};

const construisErreurMail = (mailValide: boolean) => {
  return !mailValide
    ? construisErreurSimple('mail', 'Veuillez saisir un mail valide')
    : undefined;
};

const construisErreurDepartement = (departementvalide: boolean) => {
  return !departementvalide
    ? construisErreurSimple(
        'departement',
        'Veuillez sélectionner un département dans la liste'
      )
    : undefined;
};

const construisErreurCGUValidees = (cguValidees: boolean) => {
  return !cguValidees
    ? construisErreurSimple('cguValidees', 'Veuillez valider les CGU.')
    : undefined;
};

const estVide = (chaine: string): boolean => chaine.trim() === '';
const contientUnChiffre = (chaine: string): boolean =>
  chaine.match(/[0-9]+/) !== null;
const estPrenomValide = (prenom: string): boolean =>
  !estVide(prenom) && !contientUnChiffre(prenom);
const estNomValide = estPrenomValide;

const supprimeObjetErreursSiFormulaireValide = (etatCourant: EtatDemande) => {
  if (etatCourant.erreurs && Object.keys(etatCourant.erreurs).length === 0) {
    delete etatCourant['erreurs'];
  }
};

type ChampNouvelEtat = { [clef: string]: boolean | string | Departement };

type ParametreGenerationNouvelEtat = {
  champ: keyof ErreursSaisieDemande;
  champValide: () => boolean;
  construisErreurChamp: (
    bool: boolean
  ) => { [p: string]: ErreurFormulaire } | undefined;
  ajouteAuNouvelEtat: () => ChampNouvelEtat;
};

const regenereEtatFormulaire = (
  etatPrecedent: EtatDemande,
  {
    champ,
    champValide,
    construisErreurChamp,
    ajouteAuNouvelEtat,
  }: ParametreGenerationNouvelEtat
): EtatDemande => {
  const etatCourant = { ...etatPrecedent };
  const estChampValide = champValide();

  if (estChampValide) {
    delete etatCourant.erreurs?.[champ];
    supprimeObjetErreursSiFormulaireValide(etatCourant);
  }

  const nouvelEtat = {
    ...etatCourant,

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
  return {
    ...nouvelEtat,
    pretPourEnvoi:
      estPrenomValide(nouvelEtat.prenom) &&
      estNomValide(nouvelEtat.nom) &&
      !!nouvelEtat.mail &&
      estDepartement(nouvelEtat.departement) &&
      nouvelEtat.cguValidees,
  };
};

export const reducteurDevenirAidant = (etat: EtatDemande, action: Action) => {
  switch (action.type) {
    case TypeAction.PRENOM_SAISI: {
      const etatCourant = { ...etat };

      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ prenom: action.saisie }),
        champ: 'prenom',
        champValide: () => estPrenomValide(action.saisie),
        construisErreurChamp: (bool: boolean) => construisErreurPrenom(bool),
      });
    }
    case TypeAction.NOM_SAISI: {
      const etatCourant = { ...etat };

      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ nom: action.saisie }),
        champ: 'nom',
        champValide: () => estNomValide(action.saisie),
        construisErreurChamp: (bool: boolean) => construisErreurNom(bool),
      });
    }
    case TypeAction.MAIL_SAISI: {
      const etatCourant = { ...etat };

      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ mail: action.saisie }),
        champ: 'mail',
        champValide: () => !!action.saisie.trim(),
        construisErreurChamp: (bool: boolean) => construisErreurMail(bool),
      });
    }
    case TypeAction.DEPARTEMENT_SAISI: {
      const etatCourant = { ...etat };

      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ departement: action.saisie }),
        champ: 'departement',
        champValide: () => estDepartement(action.saisie),
        construisErreurChamp: (bool: boolean) =>
          construisErreurDepartement(bool),
      });
    }
    case TypeAction.CGU_CLIQUEES: {
      const etatCourant = { ...etat };
      const cguValidees = !etatCourant.cguValidees;

      return regenereEtatFormulaire(etatCourant, {
        ajouteAuNouvelEtat: () => ({ cguValidees: cguValidees }),
        champ: 'cguValidees',
        champValide: () => cguValidees,
        construisErreurChamp: (bool: boolean) =>
          construisErreurCGUValidees(bool),
      });
    }
  }
};

export const initialiseFormulaire = (): EtatDemande => ({
  prenom: '',
  nom: '',
  mail: '',
  departement: '',
  pretPourEnvoi: false,
  cguValidees: false,
});

export const saisiPrenom = (saisie: string): Action => ({
  type: TypeAction.PRENOM_SAISI,
  saisie,
});
export const saisieNom = (saisie: string): Action => ({
  type: TypeAction.NOM_SAISI,
  saisie,
});
export const saisieMail = (saisie: string): Action => ({
  type: TypeAction.MAIL_SAISI,
  saisie,
});
export const saisieDepartement = (saisie: Departement | string): Action => ({
  type: TypeAction.DEPARTEMENT_SAISI,
  saisie,
});
export const cguCliquees = (): Action => ({
  type: TypeAction.CGU_CLIQUEES,
});
