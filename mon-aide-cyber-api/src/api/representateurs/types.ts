import crypto from 'crypto';
import { ReferentielDiagnostic } from '../../diagnostic/Diagnostic';

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

export type RepresentationDiagnostic = {
  identifiant: crypto.UUID;
  referentiel: RepresentationReferentiel;
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
type Perimetre = 'SYSTEME-INDUSTRIEL' | 'ATTAQUE-CIBLEE';
export type RepresentationQuestion = {
  perimetre?: Perimetre;
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
  perimetre?: Perimetre;
  identifiant: string;
  'info-bulles'?: InfoBulle[];
  reponses?: ReponseATranscrire[];
  type?: TypeDeSaisie;
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

export type Conditions = { [question: string]: string };
export type ConditionPerimetre = {
  [thematique: keyof ReferentielDiagnostic]: Conditions;
};
export type ConditionsPerimetre = {
  [identifiantQuestion: string]: ConditionPerimetre;
};
export type Transcripteur = {
  ordreThematiques?: string[];
  thematiques: Thematiques;
  generateurInfoBulle: (infoBulles: InfoBulle[]) => string[];
  conditionsPerimetre: ConditionsPerimetre;
};
export type Chemin = string;
