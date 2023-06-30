type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
};

type QuestionChoixUnique = {
  identifiant: string;
  libelle: string;
  reponsesPossibles: ReponsePossible[];
};

type Contexte = {
  questions: QuestionChoixUnique[];
};

type Referentiel = {
  contexte: Contexte;
};

export { Contexte, QuestionChoixUnique, Referentiel, ReponsePossible };
