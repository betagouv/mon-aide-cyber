export type Contexte = {
  questions: Question[];
};
export type Referentiel = {
  contexte: Contexte;
};
type TypeReponse = "aSaisir";
export type ReponsePossible = {
  ordre: number;
  identifiant: string;
  libelle: string;
  type?: TypeReponse;
};
export type Question = {
  identifiant: string;
  libelle: string;
  reponsesPossibles: ReponsePossible[];
};
