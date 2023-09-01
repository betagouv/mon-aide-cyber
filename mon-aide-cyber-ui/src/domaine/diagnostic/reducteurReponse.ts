import { Question, ReponseDonnee } from "./Referentiel.ts";
import { Reponse } from "./Diagnostic.ts";

enum TypeActionReponse {
  REPONSE_CHANGEE = "REPONSE_CHANGEE",
}
export enum EtatReponseStatut {
  CHARGEE = "CHARGEE",
  MODIFIE = "MODIFIE",
}

type EtatReponse = {
  identifiantQuestion: string;
  reponseDonnee: ReponseDonnee;
  reponse: () => Reponse | null;
  statut: EtatReponseStatut;
  valeur: () => string | undefined;
};
type ElementReponse = {
  valeur: string;
  elementReponseMultiple?: {
    identifiantReponse: string;
    elementReponse: string;
  };
};

type ActionReponse = {
  reponse: ElementReponse;
  type: TypeActionReponse.REPONSE_CHANGEE;
};
export const reducteurReponse = (
  etat: EtatReponse,
  action: ActionReponse,
): EtatReponse => {
  switch (action.type) {
    case TypeActionReponse.REPONSE_CHANGEE: {
      let reponse: () => Reponse = () => ({
        identifiantQuestion: etat.identifiantQuestion,
        reponseDonnee: action.reponse.valeur,
      });
      const reponseDonnee: ReponseDonnee = {
        valeur: action.reponse.valeur,
        reponsesMultiples: new Set(),
      };

      const valeur: () => string = () => action.reponse.valeur;
      const reponseDonneeCourante = etat.reponseDonnee as ReponseDonnee;
      const reponses: Set<string> = new Set(
        reponseDonneeCourante.reponsesMultiples,
      );
      const elementReponseMultiple = action.reponse.elementReponseMultiple;
      if (elementReponseMultiple !== undefined) {
        reponses.add(elementReponseMultiple.elementReponse);
        if (
          reponseDonneeCourante.reponsesMultiples.has(
            elementReponseMultiple.elementReponse,
          )
        ) {
          reponses.delete(elementReponseMultiple.elementReponse);
        }
        reponseDonnee.reponsesMultiples = reponses;

        reponse = () => ({
          identifiantQuestion: etat.identifiantQuestion,
          reponseDonnee: {
            reponse: (reponseDonnee as ReponseDonnee).valeur!,
            question: {
              identifiant: elementReponseMultiple.identifiantReponse,
              reponses: Array.from(
                (reponseDonnee as ReponseDonnee).reponsesMultiples,
              ),
            },
          },
        });
      }

      return {
        ...etat,
        reponseDonnee,
        reponse,
        statut: EtatReponseStatut.MODIFIE,
        valeur,
      };
    }
  }
};

export const reponseChangee = (
  reponse: string,
  elementReponseMultilple:
    | { identifiantReponse: string; elementReponse: string }
    | undefined = undefined,
): ActionReponse => {
  return {
    reponse: {
      valeur: reponse,
      elementReponseMultiple: elementReponseMultilple,
    },
    type: TypeActionReponse.REPONSE_CHANGEE,
  };
};

export const initialiseReducteur = (question: Question): EtatReponse => {
  const valeur: () => string | undefined = () =>
    question.reponseDonnee?.valeur || undefined;
  return {
    identifiantQuestion: question.identifiant,
    reponseDonnee: question.reponseDonnee,
    reponse: () => null,
    statut: EtatReponseStatut.CHARGEE,
    valeur,
  };
};
