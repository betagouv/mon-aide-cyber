import { Question, Referentiel, ReponseMultiple } from './Referentiel.ts';
import { Aggregat } from '../Aggregat.ts';
import { ReponseTiroir } from '../../composants/diagnostic/ConteneurReponsePossible.tsx';

export type Diagnostic = Aggregat & {
  referentiel: Referentiel;
};
export type ReponseQuestionATiroir = {
  reponse: string;
  questions: {
    identifiant: string;
    reponses: string[];
  }[];
};

export type Reponse = {
  identifiantQuestion: string;
  reponseDonnee: string | string[] | ReponseQuestionATiroir | null;
};

export const reponseUniqueDonnee = (
  question: Question,
  identifiantReponse: string
): Reponse => ({
  identifiantQuestion: question.identifiant,
  reponseDonnee: identifiantReponse,
});

export const reponseMultipleDonnee = (
  question: Question,
  identifiantReponse: string
): Reponse => {
  const reponses = gereLesReponsesMultiples(question, {
    reponse: identifiantReponse,
    identifiantReponse: question.identifiant,
  });
  return {
    identifiantQuestion: question.identifiant,
    reponseDonnee: reponses.flatMap((rep) => Array.from(rep.reponses)),
  };
};

export const reponseTiroirMultipleDonnee = (
  question: Question,
  reponse: ReponseTiroir
): Reponse => {
  const reponses = gereLesReponsesMultiples(question, {
    reponse: reponse.questionTiroir.valeur,
    identifiantReponse: reponse.questionTiroir.identifiant,
  });
  return genereLaReponsePourUneQuestionTiroir(
    question,
    reponses,
    reponse.identifiant
  );
};

export const reponseTiroirUniqueDonnee = (
  question: Question,
  reponse: ReponseTiroir
): Reponse => {
  let reponses: ReponseMultiple[] = toutesLesReponses(question);
  if (
    !reponses
      .map((rep) => rep.identifiant)
      .some((rep) =>
        question.reponsesPossibles
          .filter((rep) => rep.identifiant === reponse.identifiant)
          .flatMap((rep) => rep.questions?.map((q) => q.identifiant))
          .includes(rep)
      )
  ) {
    reponses = [];
  }
  const aDejaUneReponse = reponses.find(
    (rep) => rep.identifiant === reponse.questionTiroir.identifiant
  );

  if (!aDejaUneReponse) {
    ajouteLaReponse(reponses, {
      identifiantReponse: reponse.questionTiroir.identifiant,
      reponse: reponse.questionTiroir.valeur,
    });
  } else {
    aDejaUneReponse.reponses.clear();
    aDejaUneReponse.reponses.add(reponse.questionTiroir.valeur);
  }

  return genereLaReponsePourUneQuestionTiroir(
    question,
    reponses,
    reponse.identifiant
  );
};
const ajouteLaReponse = (
  reponses: ReponseMultiple[],
  reponse: { identifiantReponse: string; reponse: string }
): void => {
  reponses.push({
    identifiant: reponse.identifiantReponse,
    reponses: new Set([reponse.reponse]),
  });
};

const toutesLesReponses = (question: Question) => {
  const reponses: ReponseMultiple[] = question.reponseDonnee.reponses.map(
    (rep) => ({
      identifiant: rep.identifiant,
      reponses: new Set(rep.reponses),
    })
  );
  return reponses;
};

const gereLesReponsesMultiples = (
  question: Question,
  reponse: { identifiantReponse: string; reponse: string }
): ReponseMultiple[] => {
  const reponses = toutesLesReponses(question);
  const doitRetirerUneReponsePrecedemmentSelectionnee = reponses.find(
    (rep) =>
      rep.identifiant === reponse.reponse || rep.reponses.has(reponse.reponse)
  );

  reponses
    .filter((rep) => rep.identifiant === reponse.identifiantReponse)
    .forEach((rep) => {
      if (doitRetirerUneReponsePrecedemmentSelectionnee) {
        rep.reponses.delete(reponse.reponse);
      } else {
        rep.reponses.add(reponse.reponse);
      }
    });

  const aDejaUneReponse = reponses.find(
    (rep) => rep.identifiant === reponse.identifiantReponse
  );
  if (!aDejaUneReponse) {
    ajouteLaReponse(reponses, reponse);
  }
  return reponses;
};

const genereLaReponsePourUneQuestionTiroir = (
  question: Question,
  reponses: ReponseMultiple[],
  reponse: string
): Reponse => ({
  identifiantQuestion: question.identifiant,
  reponseDonnee: {
    reponse,
    questions: reponses.map((rep) => ({
      identifiant: rep.identifiant,
      reponses: Array.from(rep.reponses),
    })),
  },
});
