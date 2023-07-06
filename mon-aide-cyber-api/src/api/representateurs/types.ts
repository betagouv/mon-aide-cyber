import crypto from "crypto";

export type RepresentationDiagnostic = {
  identifiant: crypto.UUID;
  referentiel: RepresentationReferentiel;
};
export type RepresentationReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  question?:
    | RepresentationQuestionChoixUnique
    | RepresentationQuestionChoixMultiple
    | undefined;
  type?: { type: TypeDeSaisie; format: Format } | undefined;
};
type RepresentationQuestion = {
  identifiant: string;
  libelle: string;
  reponsesPossibles: RepresentationReponsePossible[];
  type?: TypeDeSaisie | undefined;
};
export type RepresentationQuestionChoixMultiple = RepresentationQuestion & {
  type?: Exclude<TypeDeSaisie, "choixSimple"> | undefined;
};
type RepresentationQuestionChoixUnique = RepresentationQuestion & {
  type?: Exclude<TypeDeSaisie, "choixMultiple"> | undefined;
};
type RepresentationContexte = {
  questions: (
    | RepresentationQuestionChoixUnique
    | RepresentationQuestionChoixMultiple
  )[];
};
type RepresentationReferentiel = {
  contexte: RepresentationContexte;
};
export type TypeDeSaisie =
  | "choixMultiple"
  | "choixUnique"
  | "liste"
  | "saisieLibre";
export type Format = "nombre" | "texte";
export type ReponseATranscrire = {
  identifiant: string;
  question?: QuestionATrancrire;
  type?: { format: Format; type: TypeDeSaisie };
};
export type QuestionATrancrire = {
  identifiant: string;
  reponses?: ReponseATranscrire[];
  type?: TypeDeSaisie;
};
export type Transcripteur = {
  contexte: {
    questions: QuestionATrancrire[];
  };
};
export type Chemin = "contexte";
