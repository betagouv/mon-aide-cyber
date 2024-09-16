import { Knex } from 'knex';
import crypto from 'crypto';
import { adaptateurServiceChiffrement } from '../../../adaptateurs/adaptateurServiceChiffrement';

export async function up(knex: Knex): Promise<void> {
  const serviceDeChiffrement = adaptateurServiceChiffrement();
  const utilisateurs = await knex('utilisateurs').then(
    (
      utilisateurs: {
        donnees: {
          identifiantConnexion: string;
        };
      }[]
    ) => {
      return utilisateurs.map((u) =>
        serviceDeChiffrement.dechiffre(u.donnees.identifiantConnexion)
      );
    }
  );
  knex('demandes-devenir-aidant').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          mail: string;
        };
        statut: string;
      }[]
    ) => {
      const misesAJour = lignes
        .map((ligne) => {
          const utilisateurExistant = utilisateurs.find(
            (u) => u === serviceDeChiffrement.dechiffre(ligne.donnees.mail)
          );

          if (utilisateurExistant) {
            ligne.statut = 'TRAITEE';
            return knex('demandes-devenir-aidant')
              .where('id', ligne.id)
              .update({ statut: ligne.statut });
          }
          return undefined;
        })
        .filter((l): l is Knex.QueryBuilder => l !== undefined);

      return Promise.all(misesAJour);
    }
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_: Knex): Promise<void> {}
