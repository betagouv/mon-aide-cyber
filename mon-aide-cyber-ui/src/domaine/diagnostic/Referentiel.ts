import { ActionDiagnostic } from "./Diagnostic.ts";

export type Thematique = {
  actions: ActionDiagnostic[];
  questions: Question[];
};
export type Referentiel = {
  [clef: string]: Thematique;
};
export type TypeDeSaisie =
  | "choixMultiple"
  | "choixUnique"
  | "saisieLibre"
  | "liste";
export type Format = "texte" | "nombre" | undefined;
export type ReponseComplementaire = Omit<
  ReponsePossible,
  "question" | "reponsesComplementaires"
>;
export type ReponseDonnee = {
  valeur: string | null;
  reponsesMultiples: Set<string>;
};
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
  reponseDonnee: ReponseDonnee;
  reponsesPossibles: ReponsePossible[];
  type?: Exclude<TypeDeSaisie, "saisieLibre">;
};
