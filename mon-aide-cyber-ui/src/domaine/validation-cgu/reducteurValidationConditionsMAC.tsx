import { ReactElement } from 'react';
import {
  ChampsErreur,
  construisErreur,
  PresentationErreur,
} from '../../composants/alertes/Erreurs.tsx';

type ErreurCreationEspaceAidant = {
  cguSignees?: PresentationErreur;
};

export type EtatValidationConditionsMAC = {
  cguSignees: boolean;
  pixelDeSuiviAutorise : boolean;
  champsErreur?: ReactElement;
  erreur?: ErreurCreationEspaceAidant;
  saisieValide: () => boolean;
};

enum TypeActionValidationConditionsMAC {
  CGU_CLIQUEES = 'CGU_CLIQUEES',
  CREATION_ESPACE_AIDANT_INVALIDEE = 'CREATION_ESPACE_AIDANT_INVALIDEE',
  PIXEL_DE_SUIVI_CLIQUE = 'PIXEL_DE_SUIVI_CLIQUE',
}

type ActionCreationEspaceAidant =
  | {
      type: TypeActionValidationConditionsMAC.CGU_CLIQUEES;
    }
    | {
      type: TypeActionValidationConditionsMAC.PIXEL_DE_SUIVI_CLIQUE;
    }
  | {
      erreur: Error;
      type: TypeActionValidationConditionsMAC.CREATION_ESPACE_AIDANT_INVALIDEE;
    };

export const reducteurValidationConditionsMAC = (
  etat: EtatValidationConditionsMAC,
  action: ActionCreationEspaceAidant
): EtatValidationConditionsMAC => {
  const construisErreurCGU = () =>
    construisErreur('cguSignees', {
      texte: 'Veuillez accepter les CGU.',
      identifiantTexteExplicatif: 'cguSignees',
    });

  switch (action.type) {
    case TypeActionValidationConditionsMAC.PIXEL_DE_SUIVI_CLIQUE:
      return {
        ...etat,
        pixelDeSuiviAutorise: !etat.pixelDeSuiviAutorise,
        saisieValide: () => etat.cguSignees,
    };
    case TypeActionValidationConditionsMAC.CREATION_ESPACE_AIDANT_INVALIDEE: {
      const etatCourant = { ...etat };
      return {
        ...etatCourant,
        cguSignees: false,
        champsErreur: <ChampsErreur erreur={action.erreur} />,
        saisieValide: () => false,
      };
    }
    case TypeActionValidationConditionsMAC.CGU_CLIQUEES: {
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
  type: TypeActionValidationConditionsMAC.CGU_CLIQUEES,
});
export const validationCGUInvalidee = (
  erreur: Error
): ActionCreationEspaceAidant => ({
  erreur,
  type: TypeActionValidationConditionsMAC.CREATION_ESPACE_AIDANT_INVALIDEE,
});
export const pixelDeSuiviClique = (): ActionCreationEspaceAidant => ({
  type: TypeActionValidationConditionsMAC.PIXEL_DE_SUIVI_CLIQUE,
});
export const initialiseReducteur = (): EtatValidationConditionsMAC => ({
  cguSignees: false,
  pixelDeSuiviAutorise: false,
  saisieValide: () => false,
  erreur: {},
});
