export type Contexte = {
  questions: Question[];
};
export type Referentiel = {
  contexte: Contexte;
};
export type TypeDeSaisie = "saisieLibre" | "liste";
export type Format = "texte" | "nombre";
export type ReponsePossible = {
  ordre: number;
  identifiant: string;
  libelle: string;
  type?: { type: TypeDeSaisie; format: Format } | undefined;
};
export type Question = {
  identifiant: string;
  libelle: string;
  reponsesPossibles: ReponsePossible[];
  type?: TypeDeSaisie;
};
