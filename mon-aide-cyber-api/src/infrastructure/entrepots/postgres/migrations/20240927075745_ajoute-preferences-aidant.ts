import { Knex } from 'knex';
import crypto from 'crypto';
import { adaptateurServiceChiffrement } from '../../../adaptateurs/adaptateurServiceChiffrement';
import { EntrepotDemandeDevenirAidantPostgres } from '../EntrepotDemandeDevenirAidantPostgres';

type AidantDTO = {
  type: 'AIDANT';
  dateSignatureCharte?: string;
  dateSignatureCGU?: string;
  identifiantConnexion: string;
  nomPrenom: string;
  motDePasse: string;
};
type RepresentationAidant = {
  id: crypto.UUID;
  donnees: AidantDTO;
};

type Preferences = {
  secteursActivite: string[];
  departements: string[];
  typesEntites: string[];
};

type NouvelAidant = AidantDTO & {
  preferences: Preferences;
};

export async function up(knex: Knex): Promise<void | number[]> {
  const entrepotAidant = new EntrepotDemandeDevenirAidantPostgres(
    adaptateurServiceChiffrement()
  );
  return knex('utilisateurs').then(async (lignes: RepresentationAidant[]) => {
    const misesAJour = lignes.map(async (ligne) => {
      const nouvellesDonneesAidant: NouvelAidant = {
        ...ligne.donnees,
        preferences: {
          secteursActivite: [],
          departements: [],
          typesEntites: [],
        },
      };

      const demandes = await entrepotAidant.tous();
      demandes
        .filter((d) => nouvellesDonneesAidant.identifiantConnexion === d.mail)
        .forEach((d) =>
          nouvellesDonneesAidant.preferences.departements.push(
            d.departement.nom
          )
        );
      return knex('utilisateurs').where('id', ligne.id).update({
        donnees: nouvellesDonneesAidant,
      });
    });
    return Promise.all(misesAJour);
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__knex: Knex): Promise<void> {}
