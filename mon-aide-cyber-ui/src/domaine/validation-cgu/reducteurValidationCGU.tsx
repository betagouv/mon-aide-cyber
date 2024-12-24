import { ReactElement } from 'react';
import {
  ChampsErreur,
  construisErreur,
  PresentationErreur,
} from '../../composants/alertes/Erreurs.tsx';

type ErreurCreationEspaceAidant = {
  cguSignees?: PresentationErreur;
};

export type EtatValidationCGU = {
  cguSignees: boolean;
  champsErreur?: ReactElement;
  erreur?: ErreurCreationEspaceAidant;
  saisieValide: () => boolean;
};

enum TypeActionValidationCGU {
  CGU_CLIQUEES = 'CGU_CLIQUEES',
  CREATION_ESPACE_AIDANT_INVALIDEE = 'CREATION_ESPACE_AIDANT_INVALIDEE',
}

type ActionCreationEspaceAidant =
  | {
      type: TypeActionValidationCGU.CGU_CLIQUEES;
    }
  | {
      erreur: Error;
      type: TypeActionValidationCGU.CREATION_ESPACE_AIDANT_INVALIDEE;
    };

export const reducteurValidationCGU = (
  etat: EtatValidationCGU,
  action: ActionCreationEspaceAidant
): EtatValidationCGU => {
  const construisErreurCGU = () =>
    construisErreur('cguSignees', {
      texte: 'Veuillez accepter les CGU.',
      identifiantTexteExplicatif: 'cguSignees',
    });

  switch (action.type) {
    case TypeActionValidationCGU.CREATION_ESPACE_AIDANT_INVALIDEE: {
      const etatCourant = { ...etat };
      return {
        ...etatCourant,
        cguSignees: false,
        champsErreur: <ChampsErreur erreur={action.erreur} />,
        saisieValide: () => false,
      };
    }
    case TypeActionValidationCGU.CGU_CLIQUEES: {
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
        saisieValide: () => cguSignees,
      };
    }
  }
};

export const cguCliquees = (): ActionCreationEspaceAidant => ({
  type: TypeActionValidationCGU.CGU_CLIQUEES,
});
export const validationCGUInvalidee = (
  erreur: Error
): ActionCreationEspaceAidant => ({
  erreur,
  type: TypeActionValidationCGU.CREATION_ESPACE_AIDANT_INVALIDEE,
});
export const initialiseReducteur = (): EtatValidationCGU => ({
  cguSignees: false,
  saisieValide: () => false,
  erreur: {},
});
