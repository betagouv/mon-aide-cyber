import { ActionReponseDiagnostic } from './Diagnostic.ts';

export type Groupes = {
  numero: number;
  questions: Question[];
}[];
export type Thematique = {
  actions: ActionReponseDiagnostic[];
  description: string;
  libelle: string;
  styles: { navigation: `navigation-${string}` };
  localisationIllustration: string;
  groupes: Groupes;
};
export type Referentiel = {
  [clef: string]: Thematique;
};
export type Suggestions = {
  clefsFiltrage: (keyof Omit<ReponsePossible, 'questions'>)[];
  champsAAfficher: (keyof Omit<ReponsePossible, 'questions'>)[];
};
export type TypeDeSaisie =
  | 'choixMultiple'
  | 'choixUnique'
  | 'liste'
  | Suggestions;
export type Format = 'texte' | 'nombre' | undefined;
export type ReponseMultiple = { identifiant: string; reponses: Set<string> };
export type ReponseDonnee = {
  valeur: string | null;
  reponses: ReponseMultiple[];
};
export type QuestionATiroir = Omit<Question, 'reponseDonnee'>;
export type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  questions?: QuestionATiroir[];
};
export type Perimetre = 'SYSTEME-INDUSTRIEL' | 'ESPIONNAGE-CIBLE';
export type Question = {
  identifiant: string;
  libelle: string;
  reponseDonnee: ReponseDonnee;
  reponsesPossibles: ReponsePossible[];
  type: TypeDeSaisie;
  'info-bulles'?: string[];
  perimetre?: Perimetre;
};
