import crypto from 'crypto';

type ActionBase = {
  action: string;
  ressource: { url: string; methode: 'PATCH' | 'GET' };
};

export type Action =
  | ActionDiagnostic
  | ActionRepondreDiagnostic
  | ActionRestituer
  | ActionLancerDiagnostic;
export type ActionLancerDiagnostic = ActionBase & {
  action: 'lancer-diagnostic';
};
export type RessourceActionRestituer = {
  ressource: {
    url: string;
    methode: 'PATCH' | 'GET';
    contentType: 'application/pdf' | 'application/json';
  };
};
export type TypeActionRestituer = {
  [type: string]: RessourceActionRestituer;
};
type ActionRestituer = Omit<ActionBase, 'ressource'> & {
  types: TypeActionRestituer;
};
type ActionRepondreDiagnostic = {
  [thematique: string]: ActionBase & { action: 'repondre' };
};
type ActionDiagnostic = ActionBase & {
  action: 'repondre';
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
  'info-bulles'?: InfoBulle[];
};
export type RepresentationQuestionChoixMultiple = RepresentationQuestion & {
  type?: Exclude<TypeDeSaisie, 'choixUnique'> | undefined;
};
type RepresentationQuestionChoixUnique = RepresentationQuestion & {
  type?: Exclude<TypeDeSaisie, 'choixMultiple'> | undefined;
};
export type RepresentationGroupes = {
  numero: number;
  questions: (
    | RepresentationQuestionChoixUnique
    | RepresentationQuestionChoixMultiple
  )[];
}[];
export type RepresentationThematique = {
  actions: ActionDiagnostic[];
  description: string;
  libelle: string;
  localisationIllustration: string;
  localisationIconeNavigation: string;
  groupes: RepresentationGroupes;
};
export type RepresentationReferentiel = {
  [clef: string]: RepresentationThematique;
};
export type TypeDeSaisie =
  | 'choixMultiple'
  | 'choixUnique'
  | 'liste'
  | 'saisieLibre';
export type Format = 'nombre' | 'texte';
export type ReponseATranscrire = {
  identifiant: string;
  question?: QuestionATranscrire | undefined;
  type?: { format: Format; type: TypeDeSaisie };
};
type InfoBulle = string;
export type QuestionATranscrire = {
  identifiant: string;
  reponses?: ReponseATranscrire[];
  type?: TypeDeSaisie;
  'info-bulles'?: InfoBulle[];
};
export type Thematique = {
  description: string;
  libelle: string;
  localisationIconeNavigation: string;
  localisationIllustration: string;
  groupes: { questions: QuestionATranscrire[] }[];
};
type Thematiques = {
  [thematique: string]: Thematique;
};

export type Transcripteur = {
  ordreThematiques?: string[];
  thematiques: Thematiques;
  generateurInfoBulle: (infoBulles: InfoBulle[]) => string[];
};
export type Chemin = string;
