type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  question?: QuestionChoixUnique | QuestionChoixMultiple | undefined;
};

type TypeQuestion = "choixMultiple" | "choixUnique";

type Question = {
  identifiant: string;
  libelle: string;
  type: TypeQuestion;
};

type QuestionChoixUnique = Question & {
  type: Exclude<TypeQuestion, "choixMultiple">;
  reponsesPossibles: ReponsePossible[];
};

type QuestionChoixMultiple = Question & {
  type: Exclude<TypeQuestion, "choixUnique">;
  reponsesPossibles: ReponsePossible[];
};

type Contexte = {
  questions: (QuestionChoixUnique | QuestionChoixMultiple)[];
};

type Referentiel = {
  contexte: Contexte;
};

export {
  Contexte,
  Question,
  QuestionChoixUnique,
  QuestionChoixMultiple,
  Referentiel,
  ReponsePossible,
};
