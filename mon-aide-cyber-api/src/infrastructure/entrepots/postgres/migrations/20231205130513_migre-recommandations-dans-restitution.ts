import { Knex } from 'knex';
import crypto from 'crypto';
import {
  Recommandations,
  ReferentielDiagnostic,
  Restitution,
} from '../../../../diagnostic/Diagnostic';
import { TableauDeRecommandations } from '../../../../diagnostic/TableauDeRecommandations';

export async function up(knex: Knex): Promise<void> {
  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          dateCreation: Date;
          dateDerniereModification: Date;
          identifiant: crypto.UUID;
          recommandations?: Recommandations;
          restitution?: Restitution;
          referentiel: ReferentielDiagnostic;
          tableauDesRecommandations: TableauDeRecommandations;
        };
      }[],
    ) => {
      const misesAJour = lignes.map((ligne) => {
        if (ligne.donnees.recommandations) {
          const { recommandations, ...reste } = ligne.donnees;
          ligne.donnees = {
            restitution: { recommandations },
            ...reste,
          };
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
