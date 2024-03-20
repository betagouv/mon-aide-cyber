import { Knex } from 'knex';
import { QuestionATiroir, ReponsePossible } from '../../../../diagnostic/Referentiel';
import { Poids, Valeur } from '../../../../diagnostic/Indice';
import { QuestionDiagnostic, Thematique } from '../../../../diagnostic/Diagnostic';
import crypto from 'crypto';

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

type RepresentationReponsePossible = Omit<ReponsePossible, 'resultat' | 'questions'> & {
  resultat?: {
    recommandations?: Recommandation[];
    indice?: { valeur: Valeur; poids?: Poids };
    valeur?: {
      theorique: Valeur;
      poids?: Poids;
    };
  };
  questions?: RepresentationQuestionTiroir[];
};
type RepresentationQuestionTiroir = Omit<QuestionATiroir, 'reponsesPossibles'> & {
  reponsesPossibles: RepresentationReponsePossible[];
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

type RepresentationRecommandationPriorisee = Omit<Recommandation, 'valeurObtenue'> & {
  noteObtenue?: Valeur;
  valeurObtenue: { theorique?: Valeur; poids?: Poids; indice?: Valeur } | Valeur;
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
    if (reponsePossible.resultat && reponsePossible.resultat.valeur) {
      reponsePossible.resultat = {
        indice: {
          valeur: reponsePossible.resultat.valeur.theorique,
          poids: reponsePossible.resultat.valeur.poids || 1,
        },
        ...(reponsePossible.resultat.recommandations && {
          recommandations: reponsePossible.resultat.recommandations,
        }),
      };
    }
  };

  const metsAJourLesRecommandations = (recommandations: RepresentationRecommandationPriorisee[]) =>
    recommandations.map((recommandation) => {
      if (recommandation.valeurObtenue) {
        const { valeurObtenue, ...reste } = recommandation;
        recommandation = {
          ...reste,
          valeurObtenue: (
            valeurObtenue as {
              theorique?: Valeur;
              poids?: Poids;
              indice?: Valeur;
            }
          ).theorique,
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
