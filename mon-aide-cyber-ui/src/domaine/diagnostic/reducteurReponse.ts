import { ReponseDonnee } from "./Referentiel.ts";

enum TypeActionReponse {
  REPONSE_DONNEE = "REPONSE_DONNEE",
}

type EtatReponse = {
  reponseDonnee?: ReponseDonnee | undefined;
};

type ActionReponse = {
  reponseDonnee: ReponseDonnee;
  type: TypeActionReponse.REPONSE_DONNEE;
};
export const reducteurReponse = (
  etat: EtatReponse,
  action: ActionReponse,
): EtatReponse => {
  switch (action.type) {
    case TypeActionReponse.REPONSE_DONNEE:
      return { ...etat, reponseDonnee: action.reponseDonnee };
  }
};
