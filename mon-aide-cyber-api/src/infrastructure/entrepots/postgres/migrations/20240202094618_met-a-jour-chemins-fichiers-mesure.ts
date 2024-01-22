import { Knex } from 'knex';
import crypto from 'crypto';
import { Valeur } from '../../../../diagnostic/Indice';

type RecommandationPriorisee = {
  titre: string;
  pourquoi: string;
  comment: string;
  valeurObtenue: Valeur;
  priorisation: number;
};

type Restitution = {
  recommandations: {
    autresRecommandations: RecommandationPriorisee[];
    recommandationsPrioritaires: RecommandationPriorisee[];
  };
};

export async function up(knex: Knex): Promise<void> {
  const metsAJour = (mesures: RecommandationPriorisee) => {
    if (!mesures.comment.startsWith('../../')) {
      mesures.comment = '../../'.concat(mesures.comment);
      mesures.pourquoi = '../../'.concat(mesures.pourquoi);
    }
  };

  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          restitution?: Restitution;
        };
      }[],
    ) => {
      lignes
        .map((ligne) => ligne.donnees.restitution)
        .filter((restitution): restitution is Restitution => !!restitution)
        .forEach((restitution) => {
          restitution.recommandations.recommandationsPrioritaires.forEach(
            (mesures) => metsAJour(mesures),
          );
          restitution.recommandations.autresRecommandations.forEach((mesures) =>
            metsAJour(mesures),
          );
        });
      const misesAJour = lignes.map((ligne) =>
        knex('diagnostics')
          .where('id', ligne.id)
          .update({ donnees: ligne.donnees }),
      );
      return Promise.all(misesAJour);
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__: Knex): Promise<void> {}
