export type Contexte = {
  questions: Question[];
};
export type Referentiel = {
  contexte: Contexte;
};
export type TypeDeSaisie = "choixMultiple" | "saisieLibre" | "liste";
export type Format = "texte" | "nombre" | undefined;
export type ReponseComplementaire = Omit<
  ReponsePossible,
  "question" | "reponsesComplementaires"
>;
export type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  question?: Question;
  type?: { type: TypeDeSaisie; format?: Format } | undefined;
  reponsesComplementaires?: ReponseComplementaire[] | undefined;
};
export type Question = {
  identifiant: string;
  libelle: string;
  reponsesPossibles: ReponsePossible[];
  type?: Exclude<TypeDeSaisie, "saisieLibre">;
};
