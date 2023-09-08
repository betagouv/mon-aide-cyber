type QuestionATiroir = Omit<Question, "reponsesPossibles"> & {
  reponsesPossibles: Omit<ReponsePossible, "questions">[];
};

type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  questions?: QuestionATiroir[];
};

type TypeQuestion = "choixMultiple" | "choixUnique";

type Question = {
  identifiant: string;
  libelle: string;
  type: TypeQuestion;
  reponsesPossibles: ReponsePossible[];
};

type QuestionChoixUnique = Question & {
  type: Exclude<TypeQuestion, "choixMultiple">;
};

type QuestionChoixMultiple = Question & {
  type: Exclude<TypeQuestion, "choixUnique">;
};

type QuestionsThematique = {
  questions: (QuestionChoixUnique | QuestionChoixMultiple)[];
};

type Referentiel = {
  [thematique: string]: QuestionsThematique;
};

export {
  QuestionsThematique,
  Question,
  QuestionATiroir,
  QuestionChoixUnique,
  QuestionChoixMultiple,
  Referentiel,
  ReponsePossible,
  TypeQuestion,
};
