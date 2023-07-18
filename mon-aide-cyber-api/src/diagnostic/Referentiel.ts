type ReponseComplementaire = Omit<
  ReponsePossible,
  "question" | "reponsesComplementaires"
>;
type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  question?: QuestionChoixUnique | QuestionChoixMultiple | undefined;
  reponsesComplementaires?: ReponseComplementaire[] | undefined;
};

type TypeQuestion = "choixMultiple" | "choixUnique";

type ReponseDonnee = {
  valeur: string;
};

type Question = {
  identifiant: string;
  libelle: string;
  type: TypeQuestion;
  reponseDonnee?: ReponseDonnee;
  reponsesPossibles: ReponsePossible[];
};

type QuestionChoixUnique = Question & {
  type: Exclude<TypeQuestion, "choixMultiple">;
};

type QuestionChoixMultiple = Question & {
  type: Exclude<TypeQuestion, "choixUnique">;
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
  ReponseComplementaire,
  ReponsePossible,
};
