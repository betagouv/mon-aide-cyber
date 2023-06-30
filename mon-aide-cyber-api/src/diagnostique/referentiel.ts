type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
};

type Question = {
  identifiant: string;
  libelle: string;
};

type QuestionChoixUnique = Question & {
  reponsesPossibles: ReponsePossible[];
};

type Contexte = {
  questions: QuestionChoixUnique[];
};

type Referentiel = {
  contexte: Contexte;
};

export {
  Contexte,
  Question,
  QuestionChoixUnique,
  Referentiel,
  ReponsePossible,
};
