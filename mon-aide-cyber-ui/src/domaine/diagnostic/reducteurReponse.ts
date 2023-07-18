import { ReponseDonnee } from "./Referentiel.ts";

enum TypeActionReponse {
  REPONSE_DONEE = "REPONSE_DONEE",
}

type EtatReponse = {
  reponseDonnee?: ReponseDonnee | undefined;
};

type ActionReponse = {
  reponseDonnee: ReponseDonnee;
  type: TypeActionReponse.REPONSE_DONEE;
};
export const reducteurReponse = (
  etat: EtatReponse,
  action: ActionReponse,
): EtatReponse => {
  switch (action.type) {
    case TypeActionReponse.REPONSE_DONEE:
      return { ...etat, reponseDonnee: action.reponseDonnee };
  }
};
