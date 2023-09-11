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
  question: Question;
  reponseDonnee: ReponseDonnee;
  reponse: () => Reponse | null;
  statut: EtatReponseStatut;
  valeur: () => string | undefined;
};
type ElementReponse = {
  valeur: string;
  elementReponse?: {
    identifiantReponse: string;
    reponse: string;
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
  const laQuestionTiroirEstAChoixUnique = (
    identifiantReponse: string,
  ): boolean => {
    return etat.question.reponsesPossibles.some(
      (rep) =>
        rep.questions?.some((q) => {
          return (
            q.reponsesPossibles
              .map((r) => r.identifiant)
              .includes(identifiantReponse) && q.type === "choixUnique"
          );
        }),
    );
  };
  switch (action.type) {
    case TypeActionReponse.REPONSE_CHANGEE: {
      let reponse: () => Reponse = () => ({
        identifiantQuestion: etat.question.identifiant,
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
      const elementReponse = action.reponse.elementReponse;
      if (elementReponse) {
        const aDejaUneReponse = reponses.find(
          (rep) => rep.identifiant === elementReponse.identifiantReponse,
        );
        if (aDejaUneReponse) {
          if (laQuestionTiroirEstAChoixUnique(elementReponse.reponse)) {
            aDejaUneReponse.reponses.clear();
            aDejaUneReponse.reponses.add(elementReponse.reponse);
          } else {
            aDejaUneReponse.reponses.add(elementReponse.reponse);
            const doitRetirerUneReponsePrecedemmentSelectionnee =
              reponseDonneeCourante.reponses.find((rep) =>
                rep.reponses.has(elementReponse.reponse),
              );
            if (doitRetirerUneReponsePrecedemmentSelectionnee) {
              aDejaUneReponse.reponses.delete(elementReponse.reponse);
            }
          }
        } else {
          reponses.push({
            identifiant: elementReponse.identifiantReponse,
            reponses: new Set([elementReponse.reponse]),
          });
        }
        reponseDonnee.reponses = reponses;

        reponse = () => ({
          identifiantQuestion: etat.question.identifiant,
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
  elementReponse:
    | { identifiantReponse: string; reponse: string }
    | undefined = undefined,
): ActionReponse => {
  return {
    reponse: {
      valeur: reponse,
      ...(elementReponse !== undefined && { elementReponse }),
    },
    type: TypeActionReponse.REPONSE_CHANGEE,
  };
};

export const initialiseReducteur = (question: Question): EtatReponse => {
  const valeur: () => string | undefined = () =>
    question.reponseDonnee?.valeur || undefined;
  return {
    question: question,
    reponseDonnee: question.reponseDonnee,
    reponse: () => null,
    statut: EtatReponseStatut.CHARGEE,
    valeur,
  };
};
