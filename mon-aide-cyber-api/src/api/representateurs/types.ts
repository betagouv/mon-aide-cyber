import crypto from "crypto";

type ActionBase = {
  action: string;
  ressource: { url: string; methode: "PATCH" | "GET" };
};

export type Action =
  | ActionDiagnostic
  | ActionRepondreDiagnostic
  | ActionTerminerDiagnostic;
type ActionRepondreDiagnostic = {
  [thematique: string]: ActionBase & { action: "repondre" };
};
type ActionTerminerDiagnostic = ActionBase & {
  action: "terminer";
};
type ActionDiagnostic = ActionBase & {
  action: "repondre";
  chemin: string;
};
export type RepresentationDiagnostic = {
  identifiant: crypto.UUID;
  referentiel: RepresentationReferentiel;
  actions: Action[];
};
export type RepresentationReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  questions?: (
    | RepresentationQuestionChoixUnique
    | RepresentationQuestionChoixMultiple
  )[];
  type?: { type: TypeDeSaisie; format: Format };
};
type RepresentationReponseDonnee = {
  valeur: string | null;
  reponses: { identifiant: string; reponses: string[] }[];
};
export type RepresentationQuestion = {
  identifiant: string;
  libelle: string;
  reponseDonnee: RepresentationReponseDonnee;
  reponsesPossibles: RepresentationReponsePossible[];
  type?: TypeDeSaisie | undefined;
};
export type RepresentationQuestionChoixMultiple = RepresentationQuestion & {
  type?: Exclude<TypeDeSaisie, "choixUnique"> | undefined;
};
type RepresentationQuestionChoixUnique = RepresentationQuestion & {
  type?: Exclude<TypeDeSaisie, "choixMultiple"> | undefined;
};
type RepresentationContexte = {
  actions: ActionDiagnostic[];
  questions: (
    | RepresentationQuestionChoixUnique
    | RepresentationQuestionChoixMultiple
  )[];
};
type RepresentationReferentiel = {
  [clef: string]: RepresentationContexte;
};
export type TypeDeSaisie =
  | "choixMultiple"
  | "choixUnique"
  | "liste"
  | "saisieLibre";
export type Format = "nombre" | "texte";
export type ReponseATranscrire = {
  identifiant: string;
  question?: QuestionATranscrire | undefined;
  reponses?: ReponseATranscrire[];
  type?: { format: Format; type: TypeDeSaisie };
};
export type QuestionATranscrire = {
  identifiant: string;
  reponses?: ReponseATranscrire[];
  type?: TypeDeSaisie;
};
export type Transcripteur = {
  [thematique: string]: {
    questions: QuestionATranscrire[];
  };
};
export type Chemin = "contexte";
