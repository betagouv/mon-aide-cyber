import { Question, ReponseDonnee } from "./Referentiel.ts";
import { Reponse } from "./Diagnostic.ts";

enum TypeActionReponse {
  REPONSE_CHANGEE = "REPONSE_CHANGEE",
}
export enum EtatReponseStatut {
  CHARGEE = "CHARGEE",
  MODIFIE = "MODIFIE",
}

export type EtatReponse = {
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
        reponses: [],
      };

      const valeur: () => string = () => action.reponse.valeur;
      const reponseDonneeCourante = etat.reponseDonnee as ReponseDonnee;
      const reponses: { identifiant: string; reponses: Set<string> }[] =
        reponseDonneeCourante.reponses.map((rep) => ({
          identifiant: rep.identifiant,
          reponses: new Set(rep.reponses),
        }));
      const elementReponseMultiple = action.reponse.elementReponseMultiple;
      if (elementReponseMultiple) {
        const aDejaUneReponse = reponses.find(
          (rep) =>
            rep.identifiant === elementReponseMultiple.identifiantReponse,
        );
        if (aDejaUneReponse) {
          aDejaUneReponse.reponses.add(elementReponseMultiple.elementReponse);
          const doitRetirerUneReponsePrecedemmentSelectionnee =
            reponseDonneeCourante.reponses.find((rep) =>
              rep.reponses.has(elementReponseMultiple.elementReponse),
            );
          if (doitRetirerUneReponsePrecedemmentSelectionnee) {
            aDejaUneReponse.reponses.delete(
              elementReponseMultiple.elementReponse,
            );
          }
        } else {
          reponses.push({
            identifiant: elementReponseMultiple.identifiantReponse,
            reponses: new Set([elementReponseMultiple.elementReponse]),
          });
        }
        reponseDonnee.reponses = reponses;

        reponse = () => ({
          identifiantQuestion: etat.identifiantQuestion,
          reponseDonnee: {
            reponse: (reponseDonnee as ReponseDonnee).valeur!,
            questions: reponseDonnee.reponses.map((rep) => ({
              identifiant: rep.identifiant,
              reponses: Array.from(rep.reponses),
            })),
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
