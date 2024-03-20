import { Knex } from 'knex';
import crypto from 'crypto';
import { QuestionDiagnostic, Thematique } from '../../../../diagnostic/Diagnostic';
import { Valeur } from '../../../../diagnostic/Indice';

type NiveauRecommandation = 1 | 2;

type Recommandation = {
  identifiant: string;
  niveau: NiveauRecommandation;
};

type NiveauDeRecommandation = {
  titre: string;
  pourquoi: string;
  comment: string;
};
type ObjetDeRecommandation = {
  niveau1: NiveauDeRecommandation;
  niveau2?: NiveauDeRecommandation;
  priorisation: number;
};
type TableauDeRecommandations = {
  [identifiantQuestion: string]: ObjetDeRecommandation;
};

type TypeQuestion = 'choixMultiple' | 'choixUnique';

export type Indice = {
  valeur: Valeur;
};

export type Poids = Omit<Valeur, 'null' | 'undefined'>;

type Question = {
  identifiant: string;
  libelle: string;
  type: TypeQuestion;
  reponsesPossibles: ReponsePossible[];
  poids: Poids;
};

type QuestionATiroir = Omit<Question, 'reponsesPossibles'> & {
  reponsesPossibles: Omit<ReponsePossible, 'questions'>[];
};

type Resultat = {
  recommandations?: Recommandation[];
  indice: Indice;
};

type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  questions?: QuestionATiroir[];
  resultat?: Resultat;
};

type RepresentationReponsePossible = Omit<ReponsePossible, 'resultat'> & {
  resultat?: {
    recommandations?: Recommandation[];
    valeur?:
      | {
          theorique: Valeur;
        }
      | undefined;
    note?: Valeur;
  };
};

type RepresentationQuestionDiagnostic = Omit<QuestionDiagnostic, 'reponsesPossibles'> & {
  reponsesPossibles: RepresentationReponsePossible[];
};
type RepresentationQuestionsThematique = {
  questions: RepresentationQuestionDiagnostic[];
};

type RepresentationReferentiel = {
  [clef: Thematique]: RepresentationQuestionsThematique;
};

export type RecommandationPriorisee = {
  titre: string;
  pourquoi: string;
  comment: string;
  valeurObtenue: Valeur;
  priorisation: number;
};

type RepresentationRecommandationPriorisee = Omit<RecommandationPriorisee, 'valeurObtenue'> & {
  noteObtenue?: Valeur;
  valeurObtenue: { theorique: Valeur };
};

type RepresentationRecommandations = {
  recommandationsPrioritaires: RepresentationRecommandationPriorisee[];
  autresRecommandations: RepresentationRecommandationPriorisee[];
};

type RepresentationRestitution = {
  recommandations?: RepresentationRecommandations;
};

export async function up(knex: Knex): Promise<void> {
  const metsAJour = (reponsePossible: RepresentationReponsePossible) => {
    if (reponsePossible.resultat && !reponsePossible.resultat.valeur) {
      reponsePossible.resultat = {
        valeur: { theorique: reponsePossible.resultat.note },
        ...(reponsePossible.resultat.recommandations && {
          recommandations: reponsePossible.resultat.recommandations,
        }),
      };
    }
  };

  const metsAJourLesRecommandations = (recommandations: RepresentationRecommandationPriorisee[]) =>
    recommandations.map((recommandation) => {
      if (recommandation.noteObtenue) {
        const { noteObtenue, ...reste } = recommandation;
        recommandation = {
          ...reste,
          valeurObtenue: { theorique: noteObtenue },
        };
      }
      return recommandation;
    });

  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          dateCreation: Date;
          dateDerniereModification: Date;
          identifiant: crypto.UUID;
          restitution?: RepresentationRestitution;
          referentiel: RepresentationReferentiel;
          tableauDesRecommandations: TableauDeRecommandations;
        };
      }[],
    ) => {
      const misesAJour = lignes.map((ligne) => {
        Object.entries(ligne.donnees.referentiel)
          .filter(([thematique]) => thematique !== 'contexte')
          .forEach(([, questions]) => {
            questions.questions.forEach((question) => {
              question.reponsesPossibles.forEach((reponsePossible) => {
                metsAJour(reponsePossible);
                reponsePossible.questions?.forEach((question) => {
                  question.reponsesPossibles.forEach((reponsePossible) => metsAJour(reponsePossible));
                });
              });
            });
          });
        if (ligne.donnees.restitution && ligne.donnees.restitution.recommandations) {
          ligne.donnees.restitution.recommandations.recommandationsPrioritaires = metsAJourLesRecommandations(
            ligne.donnees.restitution.recommandations.recommandationsPrioritaires,
          );
          ligne.donnees.restitution.recommandations.autresRecommandations = metsAJourLesRecommandations(
            ligne.donnees.restitution.recommandations.autresRecommandations,
          );
        }
        return knex('diagnostics').where('id', ligne.id).update({ donnees: ligne.donnees });
      });
      return Promise.all(misesAJour);
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__: Knex): Promise<void> {}
