import { Knex } from 'knex';
import crypto from 'crypto';

export type DTO = { id: crypto.UUID };

type PreferencesDTO = {
  secteursActivite: string[];
  departements: string[];
  typesEntites: string[];
};

type DonneesAidant = {
  email: string;
  nomPrenom: string;
  preferences: PreferencesDTO;
  consentementAnnuaire: boolean;
  dateSignatureCGU?: string;
};

type AidantDTO = DTO & {
  donnees: DonneesAidant;
};

export async function up(knex: Knex): Promise<void> {
  const utilisateurs = await knex('utilisateurs').then(
    (
      utilisateurs: {
        id: crypto.UUID;
        donnees: {
          dateSignatureCGU: string;
        };
      }[]
    ) => {
      return utilisateurs;
    }
  );

  knex('utilisateurs_mac').then((lignes: AidantDTO[]) => {
    const misesAJour = lignes
      .map((ligne) => {
        const utilisateur = utilisateurs.find((u) => u.id === ligne.id);
        if (utilisateur && utilisateur.donnees.dateSignatureCGU) {
          return knex('utilisateurs_mac')
            .where('id', ligne.id)
            .update({
              donnees: {
                ...ligne.donnees,
                dateSignatureCGU: utilisateur.donnees.dateSignatureCGU,
              },
            });
        }
        return undefined;
      })
      .filter((l): l is Knex.QueryBuilder => l !== undefined);
    return Promise.all(misesAJour);
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
