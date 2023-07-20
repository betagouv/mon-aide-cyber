type ReponseComplementaire = Omit<
  ReponsePossible,
  "question" | "reponsesComplementaires"
>;

type QuestionATiroir = Omit<Question, "reponsesPossibles"> & {
  reponsesPossibles: Omit<
    ReponsePossible,
    "question" | "reponsesComplementaires"
  >[];
};

type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  question?: QuestionATiroir | undefined;
  reponsesComplementaires?: ReponseComplementaire[] | undefined;
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
  [clef: string]: QuestionsThematique;
};

export {
  QuestionsThematique,
  Question,
  QuestionATiroir,
  QuestionChoixUnique,
  QuestionChoixMultiple,
  Referentiel,
  ReponseComplementaire,
  ReponsePossible,
  TypeQuestion,
};
