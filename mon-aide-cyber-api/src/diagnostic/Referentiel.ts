import { Indice } from './Indice';

type QuestionATiroir = Omit<Question, 'reponsesPossibles'> & {
  reponsesPossibles: Omit<ReponsePossible, 'questions'>[];
};

export type NiveauRecommandation = 1 | 2;

type Resultat = {
  recommandations?: Recommandation[];
  indice: Indice;
};
type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  questions?: QuestionATiroir[];
  resultat?: Resultat;
};

type TypeQuestion = 'choixMultiple' | 'choixUnique';

type Question = {
  identifiant: string;
  libelle: string;
  type: TypeQuestion;
  reponsesPossibles: ReponsePossible[];
};

type QuestionChoixUnique = Question & {
  type: Exclude<TypeQuestion, 'choixMultiple'>;
};

type QuestionChoixMultiple = Question & {
  type: Exclude<TypeQuestion, 'choixUnique'>;
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
  Resultat,
  TypeQuestion,
};
export type Recommandation = {
  identifiant: string;
  niveau: NiveauRecommandation;
};
