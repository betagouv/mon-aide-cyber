type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
};

type QuestionChoixUnique = {
  reponsesPossibles: ReponsePossible[];
  identifiant: string;
  libelle: string;
};

class Contexte {
  questions: QuestionChoixUnique[] = [];
}

type Referentiel = {
  contexte: Contexte;
};

export { Contexte, QuestionChoixUnique, Referentiel, ReponsePossible };
