import {
  ChampsErreur,
  construisErreur,
  PresentationErreur,
} from '../erreurs/Erreurs.tsx';
import { ReactElement } from 'react';
import { ModificationMotDePasse } from '../mot-de-passe/ComposantMotDePasse.tsx';

type ErreurCreationEspaceAidant = {
  cguSignees?: PresentationErreur;
};

export type EtatCreationEspaceAidant = {
  cguSignees: boolean;
  motDePasse?: ModificationMotDePasse;
  champsErreur?: ReactElement;
  erreur?: ErreurCreationEspaceAidant;
  creationEspaceAidantATransmettre?: boolean;
  saisieValide: () => boolean;
};

enum TypeActionCreationEspaceAidant {
  CREATION_ESPACE_AIDANT_VALIDEE = 'CREATION_ESPACE_AIDANT_VALIDEE',
  CGU_CLIQUEES = 'CGU_CLIQUEES',
  CREATION_ESPACE_AIDANT_TRANSMISE = 'CREATION_ESPACE_AIDANT_TRANSMISE',
  CREATION_ESPACE_AIDANT_INVALIDEE = 'CREATION_ESPACE_AIDANT_INVALIDEE',
}

type ActionCreationEspaceAidant =
  | {
      motDePasse: ModificationMotDePasse;
      type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_VALIDEE;
    }
  | {
      type: TypeActionCreationEspaceAidant.CGU_CLIQUEES;
    }
  | {
      type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_TRANSMISE;
    }
  | {
      erreur: Error;
      type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_INVALIDEE;
    };

export const reducteurCreationEspaceAidant = (
  etat: EtatCreationEspaceAidant,
  action: ActionCreationEspaceAidant,
): EtatCreationEspaceAidant => {
  const construisErreurCGU = () =>
    construisErreur('cguSignees', {
      texte: 'Veuillez accepter les CGU.',
      identifiantTexteExplicatif: 'cguSignees',
    });

  switch (action.type) {
    case TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_INVALIDEE: {
      const etatCourant = { ...etat };
      delete etatCourant['creationEspaceAidantATransmettre'];
      delete etatCourant['motDePasse'];
      return {
        ...etatCourant,
        cguSignees: false,
        champsErreur: <ChampsErreur erreur={action.erreur} />,
        saisieValide: () => false,
      };
    }
    case TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_TRANSMISE: {
      const etatCourant = { ...etat };
      delete etatCourant['creationEspaceAidantATransmettre'];
      delete etatCourant['motDePasse'];
      return {
        ...etatCourant,
      };
    }
    case TypeActionCreationEspaceAidant.CGU_CLIQUEES: {
      const cguSignees = !etat.cguSignees;
      const erreur = { ...etat.erreur };
      delete erreur['cguSignees'];
      return {
        ...etat,
        cguSignees: cguSignees,
        erreur: {
          ...erreur,
          ...(!cguSignees && construisErreurCGU()),
        },
        saisieValide: () =>
          cguSignees && !!etat.motDePasse && etat.motDePasse.valide,
      };
    }
    case TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_VALIDEE: {
      const motDePasse = action.motDePasse;
      const motDePasseValide = motDePasse.valide;
      return {
        ...etat,
        erreur: {
          ...(!etat.cguSignees && {
            ...construisErreurCGU(),
          }),
        },
        motDePasse: {
          ancienMotDePasse: motDePasse.ancienMotDePasse,
          nouveauMotDePasse: motDePasse.nouveauMotDePasse,
          confirmationNouveauMotDePasse:
            motDePasse.confirmationNouveauMotDePasse,
          valide: motDePasse.valide,
        },
        saisieValide: () => etat.cguSignees && motDePasseValide,
        ...(etat.cguSignees &&
          motDePasseValide && {
            creationEspaceAidantATransmettre:
              etat.cguSignees && motDePasseValide,
          }),
      };
    }
  }
};

export const creationEspaceAidantValidee = (
  motDePasse: ModificationMotDePasse,
): ActionCreationEspaceAidant => ({
  motDePasse,
  type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_VALIDEE,
});

export const cguCliquees = (): ActionCreationEspaceAidant => ({
  type: TypeActionCreationEspaceAidant.CGU_CLIQUEES,
});

export const creationEspaceAidantTransmise =
  (): ActionCreationEspaceAidant => ({
    type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_TRANSMISE,
  });

export const creationEspaceAidantInvalidee = (
  erreur: Error,
): ActionCreationEspaceAidant => ({
  erreur,
  type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_INVALIDEE,
});
export const initialiseReducteur = (): EtatCreationEspaceAidant => ({
  cguSignees: false,
  saisieValide: () => false,
  erreur: {},
});
