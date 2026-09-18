import { Knex } from 'knex';
import { UUID } from 'crypto';
import { ServiceDeChiffrementChacha20 } from '../../../securite/ServiceDeChiffrementChacha20';

type Utilisateur = {
  id: UUID;
  donnees: {
    nomPrenom: string;
    motDePasse: string;
    dateSignatureCGU: Date;
    identifiantConnexion: string;
  };
};

export async function up(knex: Knex): Promise<void> {
  const serviceDeChiffrement = new ServiceDeChiffrementChacha20();
  const misesAJour = knex('utilisateurs').then(
    (utilisateurs: Utilisateur[]) => {
      const misesAJour = utilisateurs.map(async (u) => {
        const motDePasse = serviceDeChiffrement.dechiffre(u.donnees.motDePasse);
        const motDePasseChiffre = await serviceDeChiffrement.hache(motDePasse);
        return knex('utilisateurs')
          .where('id', u.id)
          .update({
            donnees: {
              ...u.donnees,
              motDePasse: motDePasseChiffre,
            },
          });
      });
      return Promise.all(misesAJour);
    }
  );
  await Promise.resolve(misesAJour);
  return;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
