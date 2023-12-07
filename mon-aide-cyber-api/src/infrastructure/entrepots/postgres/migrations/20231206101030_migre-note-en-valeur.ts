import { Knex } from 'knex';
import crypto from 'crypto';
import {
  QuestionDiagnostic,
  RecommandationPriorisee,
  Thematique,
} from '../../../../diagnostic/Diagnostic';
import { TableauDeRecommandations } from '../../../../diagnostic/TableauDeRecommandations';
import {
  Recommandation,
  ReponsePossible,
} from '../../../../diagnostic/Referentiel';
import { Valeur, ValeurPossible } from '../../../../diagnostic/Valeur';

type RepresentationReponsePossible = Omit<ReponsePossible, 'resultat'> & {
  resultat?: {
    recommandations?: Recommandation[];
    valeur?: Valeur;
    note?: ValeurPossible;
  };
};

type RepresentationQuestionDiagnostic = Omit<
  QuestionDiagnostic,
  'reponsesPossibles'
> & {
  reponsesPossibles: RepresentationReponsePossible[];
};
type RepresentationQuestionsThematique = {
  questions: RepresentationQuestionDiagnostic[];
};

type RepresentationReferentiel = {
  [clef: Thematique]: RepresentationQuestionsThematique;
};

type RepresentationRecommandationPriorisee = Omit<
  RecommandationPriorisee,
  'valeurObtenue'
> & {
  noteObtenue?: ValeurPossible;
  valeurObtenue: { theorique: ValeurPossible };
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

  const metsAJourLesRecommandations = (
    recommandations: RepresentationRecommandationPriorisee[],
  ) =>
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
                  question.reponsesPossibles.forEach((reponsePossible) =>
                    metsAJour(reponsePossible),
                  );
                });
              });
            });
          });
        if (
          ligne.donnees.restitution &&
          ligne.donnees.restitution.recommandations
        ) {
          ligne.donnees.restitution.recommandations.recommandationsPrioritaires =
            metsAJourLesRecommandations(
              ligne.donnees.restitution.recommandations
                .recommandationsPrioritaires,
            );
          ligne.donnees.restitution.recommandations.autresRecommandations =
            metsAJourLesRecommandations(
              ligne.donnees.restitution.recommandations.autresRecommandations,
            );
        }
        return knex('diagnostics')
          .where('id', ligne.id)
          .update({ donnees: ligne.donnees });
      });
      return Promise.all(misesAJour);
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__: Knex): Promise<void> {}
