import { ReponseDonnee } from "./Referentiel.ts";

enum TypeActionReponse {
  REPONSE_DONNEE = "REPONSE_DONNEE",
  REPONSE_CHANGEE = "REPONSE_CHANGEE",
}

type EtatReponse = {
  reponseDonnee?: ReponseDonnee | undefined;
};

type ActionReponse =
  | {
      reponseDonnee: ReponseDonnee;
      type: TypeActionReponse.REPONSE_DONNEE;
    }
  | {
      reponse: string;
      type: TypeActionReponse.REPONSE_CHANGEE;
    };
export const reducteurReponse = (
  etat: EtatReponse,
  action: ActionReponse,
): EtatReponse => {
  switch (action.type) {
    case TypeActionReponse.REPONSE_CHANGEE:
      return { ...etat, reponseDonnee: { valeur: action.reponse } };
    case TypeActionReponse.REPONSE_DONNEE:
      return { ...etat, reponseDonnee: action.reponseDonnee };
  }
};

export const reponseChangee = (reponse: string): ActionReponse => {
  return {
    reponse: reponse,
    type: TypeActionReponse.REPONSE_CHANGEE,
  };
};
