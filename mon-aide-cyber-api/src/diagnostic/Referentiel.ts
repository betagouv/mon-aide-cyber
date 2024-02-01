import { Indice, Poids } from './Indice';

type QuestionATiroir = Omit<Question, 'reponsesPossibles'> & {
  reponsesPossibles: Omit<ReponsePossible, 'questions'>[];
};

export type NiveauMesure = 1 | 2;

type Resultat = {
  mesures?: Mesure[];
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
  poids: Poids;
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
export type Mesure = {
  identifiant: string;
  niveau: NiveauMesure;
};
