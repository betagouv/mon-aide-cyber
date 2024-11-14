type EtatUtilisateurAuthentifie = {
  enAttenteDeChargement: boolean;
};

enum TypeActionUtilisateurAuthentifie {
  UTILISATEUR_CHARGE = 'UTILISATEUR_CHARGE',
  UTILISATEUR_NON_AUTHENTIFIE = 'UTILISATEUR_NON_AUTHENTIFIE',
}

type ActionUtilisateurAuthentifie =
  | {
      type: TypeActionUtilisateurAuthentifie.UTILISATEUR_CHARGE;
    }
  | {
      type: TypeActionUtilisateurAuthentifie.UTILISATEUR_NON_AUTHENTIFIE;
    };
export const reducteurUtilisateurAuthentifie = (
  etat: EtatUtilisateurAuthentifie,
  action: ActionUtilisateurAuthentifie
): EtatUtilisateurAuthentifie => {
  switch (action.type) {
    case TypeActionUtilisateurAuthentifie.UTILISATEUR_NON_AUTHENTIFIE: {
      return {
        ...etat,
        enAttenteDeChargement: false,
      };
    }
    case TypeActionUtilisateurAuthentifie.UTILISATEUR_CHARGE:
      return {
        ...etat,
        enAttenteDeChargement: false,
      };
  }
};
export const initialiseReducteurUtilisateurAuthentifie =
  (): EtatUtilisateurAuthentifie => {
    return {
      enAttenteDeChargement: true,
    };
  };
export const utilisateurCharge = (): ActionUtilisateurAuthentifie => {
  return {
    type: TypeActionUtilisateurAuthentifie.UTILISATEUR_CHARGE,
  };
};
export const utilisateurNonAuthentifie = (): ActionUtilisateurAuthentifie => {
  return {
    type: TypeActionUtilisateurAuthentifie.UTILISATEUR_NON_AUTHENTIFIE,
  };
};
