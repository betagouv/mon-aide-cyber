import { Knex } from 'knex';
import crypto from 'crypto';

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

export async function up(knex: Knex): Promise<void> {
  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          tableauDesRecommandations: TableauDeRecommandations;
        };
      }[],
    ) => {
      const misesAJour = lignes.map((ligne) => {
        Object.entries(ligne.donnees.tableauDesRecommandations).map(
          ([, objetDeRecommandation]) => {
            objetDeRecommandation.niveau1.pourquoi = '../../'.concat(
              objetDeRecommandation.niveau1.pourquoi,
            );
            objetDeRecommandation.niveau1.comment = '../../'.concat(
              objetDeRecommandation.niveau1.comment,
            );
            if (objetDeRecommandation.niveau2) {
              objetDeRecommandation.niveau2.pourquoi = '../../'.concat(
                objetDeRecommandation.niveau2.pourquoi,
              );
              objetDeRecommandation.niveau2.comment = '../../'.concat(
                objetDeRecommandation.niveau2.comment,
              );
            }
          },
        );
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
