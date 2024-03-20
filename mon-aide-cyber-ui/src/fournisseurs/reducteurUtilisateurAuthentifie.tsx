import { Navigate, Outlet } from 'react-router-dom';
import { Utilisateur } from '../domaine/authentification/Authentification.ts';
import { ReactElement } from 'react';

type EtatUtilisateurAuthentifie = {
  element: ReactElement | null;
  enAttenteDeChargement: boolean;
  utilisateur?: Utilisateur;
};

enum TypeActionUtilisateurAuthentifie {
  UTILISATEUR_CHARGE = 'UTILISATEUR_CHARGE',
  UTILISATEUR_NON_AUTHENTIFIE = 'UTILISATEUR_NON_AUTHENTIFIE',
  UTILISATEUR_RECHARGE = 'UTILISATEUR_RECHARGE',
}

type ActionUtilisateurAuthentifie =
  | {
      utilisateur: Utilisateur;
      type: TypeActionUtilisateurAuthentifie.UTILISATEUR_CHARGE;
    }
  | {
      type: TypeActionUtilisateurAuthentifie.UTILISATEUR_NON_AUTHENTIFIE;
    }
  | {
      type: TypeActionUtilisateurAuthentifie.UTILISATEUR_RECHARGE;
    };
export const reducteurUtilisateurAuthentifie = (
  etat: EtatUtilisateurAuthentifie,
  action: ActionUtilisateurAuthentifie,
): EtatUtilisateurAuthentifie => {
  switch (action.type) {
    case TypeActionUtilisateurAuthentifie.UTILISATEUR_RECHARGE: {
      const nouvelEtat = { ...etat };
      delete nouvelEtat['utilisateur'];
      return {
        ...nouvelEtat,
        element: null,
        enAttenteDeChargement: true,
      };
    }
    case TypeActionUtilisateurAuthentifie.UTILISATEUR_NON_AUTHENTIFIE: {
      const nouvelEtat = { ...etat };
      delete nouvelEtat['utilisateur'];
      return {
        ...nouvelEtat,
        element: <Navigate to="/" />,
        enAttenteDeChargement: false,
      };
    }
    case TypeActionUtilisateurAuthentifie.UTILISATEUR_CHARGE:
      return {
        ...etat,
        utilisateur: action.utilisateur,
        element: <Outlet />,
        enAttenteDeChargement: false,
      };
  }
};
export const initialiseReducteurUtilisateurAuthentifie = (): EtatUtilisateurAuthentifie => {
  return {
    enAttenteDeChargement: true,
    element: null,
  };
};
export const utilisateurCharge = (utilisateur: Utilisateur): ActionUtilisateurAuthentifie => {
  return {
    type: TypeActionUtilisateurAuthentifie.UTILISATEUR_CHARGE,
    utilisateur,
  };
};
export const utilisateurNonAuthentifie = (): ActionUtilisateurAuthentifie => {
  return {
    type: TypeActionUtilisateurAuthentifie.UTILISATEUR_NON_AUTHENTIFIE,
  };
};
export const utilisateurRecharge = (): ActionUtilisateurAuthentifie => ({
  type: TypeActionUtilisateurAuthentifie.UTILISATEUR_RECHARGE,
});
