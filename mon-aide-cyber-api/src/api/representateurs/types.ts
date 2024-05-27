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
  questions?: RepresentationQuestion[];
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
  type?: TypeDeSaisie;
  'info-bulles'?: InfoBulle[];
};
export type ElementRepresentationGroupe = {
  numero: number;
  questions: RepresentationQuestion[];
};
export type RepresentationGroupes = ElementRepresentationGroupe[];
type StyleThematique = {
  navigation: `navigation-${string}`;
};
export type RepresentationThematique = {
  actions: ActionDiagnostic[];
  description: string;
  libelle: string;
  styles: StyleThematique;
  localisationIllustration: string;
  groupes: RepresentationGroupes;
};
export type RepresentationReferentiel = {
  [clef: string]: RepresentationThematique;
};
type ChoixOptions = {
  clefsFiltrage: (keyof Omit<RepresentationReponsePossible, 'questions'>)[];
  champsAAfficher: (keyof Omit<RepresentationReponsePossible, 'questions'>)[];
};
export type TypeDeSaisie =
  | 'choixMultiple'
  | 'choixUnique'
  | 'liste'
  | 'saisieLibre'
  | ChoixOptions;
export type ReponseATranscrire = {
  identifiant: string;
  question?: QuestionATranscrire | undefined;
};
type InfoBulle = string;
export type QuestionATranscrire = {
  identifiant: string;
  reponses?: ReponseATranscrire[];
  type?: TypeDeSaisie;
  'info-bulles'?: InfoBulle[];
};
export type Thematique = {
  styles: StyleThematique;
  description: string;
  libelle: string;
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
