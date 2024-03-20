import { Knex } from 'knex';
import crypto from 'crypto';
import { QuestionATiroir, ReponsePossible } from '../../../../diagnostic/Referentiel';
import { Poids, Valeur } from '../../../../diagnostic/Indice';
import { QuestionDiagnostic, Thematique } from '../../../../diagnostic/Diagnostic';

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

export async function up(knex: Knex): Promise<void> {
  const metsAJour = (reponsePossible: RepresentationReponsePossible) => {
    if (reponsePossible.resultat) {
      reponsePossible.resultat = {
        ...reponsePossible.resultat,
        indice: { valeur: reponsePossible.resultat.indice?.valeur },
      };
    }
  };

  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          dateCreation: Date;
          dateDerniereModification: Date;
          identifiant: crypto.UUID;
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
        return knex('diagnostics').where('id', ligne.id).update({ donnees: ligne.donnees });
      });
      return Promise.all(misesAJour);
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__: Knex): Promise<void> {}
