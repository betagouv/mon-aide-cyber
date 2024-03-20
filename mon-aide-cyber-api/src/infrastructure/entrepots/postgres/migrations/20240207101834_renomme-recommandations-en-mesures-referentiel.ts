import { Knex } from 'knex';
import { Question, QuestionATiroir } from '../../../../diagnostic/Referentiel';
import { QuestionDiagnostic, Thematique } from '../../../../diagnostic/Diagnostic';
import crypto from 'crypto';

interface RepresentationRecommandation {
  identifiant: string;
  niveau: 1 | 2;
}

interface RepresentationMesure {
  identifiant: string;
  niveau: 1 | 2;
}

type Resultat = {
  recommandations?: RepresentationRecommandation[];
  mesures?: RepresentationMesure[];
};

type RepresentationReponsePossible = {
  resultat?: Resultat;
  questions?: RepresentationQuestionTiroir[];
};

type RepresentationQuestionTiroir = Omit<QuestionATiroir, 'reponsesPossibles'> & {
  reponsesPossibles: RepresentationReponsePossible[];
};
type RepresentationQuestionDiagnostic = Omit<QuestionDiagnostic, 'reponsesPossibles'> & {
  reponsesPossibles: RepresentationReponsePossible[];
};

type RepresentationQuestionThematique = Question & {
  reponsesPossibles: RepresentationQuestionDiagnostic[];
};

type QuestionsThematique = {
  questions: RepresentationQuestionThematique[];
};

type RepresentationReferentiel = {
  [clef: Thematique]: QuestionsThematique;
};

const metsAJour = (reponsePossible: RepresentationReponsePossible) => {
  if (reponsePossible.resultat && reponsePossible.resultat.recommandations) {
    reponsePossible.resultat.mesures = reponsePossible.resultat.recommandations;

    delete reponsePossible.resultat.recommandations;
  }
};

export async function up(knex: Knex): Promise<void> {
  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          referentiel: RepresentationReferentiel;
        };
      }[],
    ) => {
      const misesAJour = lignes.map((ligne) => {
        Object.entries(ligne.donnees.referentiel)
          .filter(([thematique]) => thematique !== 'contexte')
          .forEach(([, questions]) => {
            questions.questions.forEach((question) => {
              question.reponsesPossibles.forEach((reponsePossible: RepresentationReponsePossible) => {
                metsAJour(reponsePossible);
                reponsePossible.questions?.forEach((question) => {
                  question.reponsesPossibles.forEach((reponsePossible) => metsAJour(reponsePossible));
                });
              });
            });
          });

        return knex('diagnostics').where('id', ligne.id).update({ donnees: ligne.donnees });
      });

      return Promise.all(misesAJour);
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_: Knex): Promise<void> {}
