import { Action } from '../../domaine/diagnostic/Diagnostic.ts';
import { UUID } from '../../types/Types.ts';

type RepresentationReponseDonnee = {
  valeur: string | null;
  reponses: { identifiant: string; reponses: string[] }[];
};
type Format = 'texte' | 'nombre' | undefined;
type RepresentationReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  questions?: RepresentationQuestion[];
  type?: { type: RepresentationTypeDeSaisie; format?: Format } | undefined;
};
type RepresentationQuestion = {
  identifiant: string;
  libelle: string;
  reponseDonnee: RepresentationReponseDonnee;
  reponsesPossibles: RepresentationReponsePossible[];
  type?: Exclude<RepresentationTypeDeSaisie, 'saisieLibre'>;
};
type RepresentationGroupes = {
  numero: number;
  questions: RepresentationQuestion[];
}[];
export type RepresentationTypeDeSaisie =
  | 'choixMultiple'
  | 'choixUnique'
  | 'saisieLibre'
  | 'liste';
type RepresentationThematique = {
  groupes: RepresentationGroupes;
};
type RepresentationReferentiel = {
  [clef: string]: RepresentationThematique;
};
type RepresentationDiagnostic = {
  identifiant: UUID;
  referentiel: RepresentationReferentiel;
  actions: Action[];
};

export const enDiagnostic = (json: Promise<RepresentationDiagnostic>) =>
  json.then((corps) => {
    const referentiel = Object.entries(corps.referentiel).reduce(
      (accumulateur, [clef, thematique]) => {
        const groupes = thematique.groupes.flatMap((groupe) => {
          const questions = groupe.questions.map((question) => ({
            ...question,
            reponseDonnee: {
              valeur: question.reponseDonnee.valeur,
              reponses: question.reponseDonnee.reponses.map((rep) => ({
                identifiant: rep.identifiant,
                reponses: new Set(rep.reponses),
              })),
            },
          }));
          return { numero: groupe.numero, questions };
        });
        return {
          ...accumulateur,
          [clef]: { ...thematique, groupes },
        };
      },
      {},
    );
    return {
      ...corps,
      referentiel,
    };
  });
