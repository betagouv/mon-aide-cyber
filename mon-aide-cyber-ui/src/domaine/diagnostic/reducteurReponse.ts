import { Question, ReponseDonnee, ReponseMultiple } from "./Referentiel.ts";
import { Reponse } from "./Diagnostic.ts";

enum TypeActionReponse {
  REPONSE_UNIQUE_DONNEE = "REPONSE_UNIQUE_DONNEE",
  REPONSE_MULTIPLE_DONNEE = "REPONSE_MULTIPLE_DONNEE",
  REPONSE_TIROIR_UNIQUE_DONNEE = "REPONSE_TIROIR_UNIQUE_DONNEE",
  REPONSE_TIROIR_MULTIPLE_DONNEE = "REPONSE_TIROIR_MULTIPLE_DONNEE",
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
  identifiantReponse: string;
  reponse: string;
};

type ElementReponseUnique = {
  valeur: string;
};

type ElementReponseMultiple = {
  elementReponse: ElementReponse;
};

type ElementReponseTiroirUnique = {
  valeur: string;
  elementReponse: ElementReponse;
};

type ElementReponseTiroirMultiple = {
  valeur: string;
  elementReponse: ElementReponse;
};

type ActionReponse =
  | {
      reponse: ElementReponseUnique;
      type: TypeActionReponse.REPONSE_UNIQUE_DONNEE;
    }
  | {
      reponse: ElementReponseMultiple;
      type: TypeActionReponse.REPONSE_MULTIPLE_DONNEE;
    }
  | {
      reponse: ElementReponseTiroirUnique;
      type: TypeActionReponse.REPONSE_TIROIR_UNIQUE_DONNEE;
    }
  | {
      reponse: ElementReponseTiroirMultiple;
      type: TypeActionReponse.REPONSE_TIROIR_MULTIPLE_DONNEE;
    };
export const reducteurReponse = (
  etat: EtatReponse,
  action: ActionReponse,
): EtatReponse => {
  function ajouteLaReponse(
    reponses: ReponseMultiple[],
    elementReponse: ElementReponse,
  ) {
    reponses.push({
      identifiant: elementReponse.identifiantReponse,
      reponses: new Set([elementReponse.reponse]),
    });
  }

  const toutesLesReponses = () => {
    const reponses: ReponseMultiple[] = etat.reponseDonnee.reponses.map(
      (rep) => ({
        identifiant: rep.identifiant,
        reponses: new Set(rep.reponses),
      }),
    );
    return reponses;
  };

  function gereLesReponsesMultiples(elementReponse: ElementReponse) {
    const reponses = toutesLesReponses();
    const doitRetirerUneReponsePrecedemmentSelectionnee = reponses.find(
      (rep) =>
        rep.identifiant === elementReponse.reponse ||
        rep.reponses.has(elementReponse.reponse),
    );

    reponses
      .filter((rep) => rep.identifiant === elementReponse.identifiantReponse)
      .forEach((rep) => {
        if (doitRetirerUneReponsePrecedemmentSelectionnee) {
          rep.reponses.delete(elementReponse.reponse);
        } else {
          rep.reponses.add(elementReponse.reponse);
        }
      });

    const aDejaUneReponse = reponses.find(
      (rep) => rep.identifiant === elementReponse.identifiantReponse,
    );
    if (!aDejaUneReponse) {
      ajouteLaReponse(reponses, elementReponse);
    }
    return reponses;
  }

  const genereLaReponsePourUneQuestionTiroir = (
    reponses: ReponseMultiple[],
    reponse: string,
  ): (() => Reponse) => {
    return (): Reponse => ({
      identifiantQuestion: etat.question.identifiant,
      reponseDonnee: {
        reponse,
        questions: reponses.map((rep) => ({
          identifiant: rep.identifiant,
          reponses: Array.from(rep.reponses),
        })),
      },
    });
  };

  function etatPourUneQuestionTiroir(
    reponses: ReponseMultiple[],
    valeur: string,
  ) {
    return {
      ...etat,
      reponseDonnee: {
        valeur,
        reponses,
      },
      reponse: genereLaReponsePourUneQuestionTiroir(reponses, valeur),
      statut: EtatReponseStatut.MODIFIE,
      valeur: () => valeur,
    };
  }

  switch (action.type) {
    case TypeActionReponse.REPONSE_UNIQUE_DONNEE: {
      return {
        ...etat,
        reponseDonnee: {
          valeur: action.reponse.valeur,
          reponses: [],
        },
        reponse: () => ({
          identifiantQuestion: etat.question.identifiant,
          reponseDonnee: action.reponse.valeur,
        }),
        statut: EtatReponseStatut.MODIFIE,
        valeur: () => action.reponse.valeur,
      };
    }
    case TypeActionReponse.REPONSE_MULTIPLE_DONNEE: {
      const reponses = gereLesReponsesMultiples(action.reponse.elementReponse);

      return {
        ...etat,
        reponseDonnee: {
          valeur: null,
          reponses,
        },
        reponse: () => ({
          identifiantQuestion: etat.question.identifiant,
          reponseDonnee: reponses.flatMap((rep) => Array.from(rep.reponses)),
        }),
        statut: EtatReponseStatut.MODIFIE,
        valeur: () => undefined,
      };
    }
    case TypeActionReponse.REPONSE_TIROIR_UNIQUE_DONNEE: {
      const reponses: ReponseMultiple[] = toutesLesReponses();
      const elementReponse = action.reponse.elementReponse;
      const aDejaUneReponse = reponses.find(
        (rep) => rep.identifiant === elementReponse.identifiantReponse,
      );

      if (!aDejaUneReponse) {
        ajouteLaReponse(reponses, elementReponse);
      } else {
        aDejaUneReponse.reponses.clear();
        aDejaUneReponse.reponses.add(elementReponse.reponse);
      }

      return etatPourUneQuestionTiroir(reponses, action.reponse.valeur);
    }
    case TypeActionReponse.REPONSE_TIROIR_MULTIPLE_DONNEE: {
      const reponses = gereLesReponsesMultiples(action.reponse.elementReponse);
      return etatPourUneQuestionTiroir(reponses, action.reponse.valeur);
    }
  }
};

export const reponseUniqueDonnee = (reponse: string): ActionReponse => {
  return {
    reponse: {
      valeur: reponse,
    },
    type: TypeActionReponse.REPONSE_UNIQUE_DONNEE,
  };
};

export const reponseMultipleDonnee = (elementReponse: {
  identifiantReponse: string;
  reponse: string;
}): ActionReponse => {
  return {
    reponse: {
      elementReponse,
    },
    type: TypeActionReponse.REPONSE_MULTIPLE_DONNEE,
  };
};

export const reponseTiroirUniqueDonnee = (
  reponse: string,
  elementReponse: { identifiantReponse: string; reponse: string },
): ActionReponse => {
  return {
    reponse: {
      valeur: reponse,
      elementReponse,
    },
    type: TypeActionReponse.REPONSE_TIROIR_UNIQUE_DONNEE,
  };
};

export const reponseTiroirMultipleDonnee = (
  reponse: string,
  elementReponse: { identifiantReponse: string; reponse: string },
): ActionReponse => {
  return {
    reponse: {
      valeur: reponse,
      elementReponse,
    },
    type: TypeActionReponse.REPONSE_TIROIR_MULTIPLE_DONNEE,
  };
};

export const initialiseReducteur = (question: Question): EtatReponse => {
  const valeur: () => string | undefined = () =>
    question.reponseDonnee.valeur || undefined;
  return {
    question: question,
    reponseDonnee: question.reponseDonnee,
    reponse: () => null,
    statut: EtatReponseStatut.CHARGEE,
    valeur,
  };
};
