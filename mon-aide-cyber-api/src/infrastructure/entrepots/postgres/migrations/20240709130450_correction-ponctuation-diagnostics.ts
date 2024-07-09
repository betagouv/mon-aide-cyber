import { Knex } from 'knex';
import { Thematique } from '../../../../diagnostic/Diagnostic';
import crypto from 'crypto';

type ReponsePossible = {
  libelle: string;
};

type Question = {
  reponsesPossibles: ReponsePossible[];
};

type QuestionsThematique = {
  questions: Question[];
};

type RepresentationReferentiel = {
  [clef: Thematique]: QuestionsThematique;
};

export async function up(knex: Knex): Promise<void> {
  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          referentiel: RepresentationReferentiel;
        };
      }[]
    ) => {
      const misesAJour = lignes.map((ligne) => {
        Object.entries(ligne.donnees.referentiel).forEach(([, questions]) => {
          questions.questions.forEach((question) => {
            question.reponsesPossibles.forEach((reponse) => {
              if (reponse.libelle.endsWith('.')) {
                reponse.libelle = reponse.libelle.substring(
                  0,
                  reponse.libelle.lastIndexOf('.')
                );
              }
            });
          });
        });
        return knex('diagnostics')
          .where('id', ligne.id)
          .update({ donnees: ligne.donnees });
      });

      return Promise.all(misesAJour);
    }
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_: Knex): Promise<void> {}
