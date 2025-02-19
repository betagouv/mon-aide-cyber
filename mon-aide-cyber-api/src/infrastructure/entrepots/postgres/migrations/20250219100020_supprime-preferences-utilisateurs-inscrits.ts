import { Knex } from 'knex';
import crypto from 'crypto';

type EntiteUtilisateurInscrit = {
  siret?: string;
};

type UtilisateurDTO = {
  email: string;
  nomPrenom: string;
  preferences: Preferences;
  dateSignatureCGU?: string;
  entite?: EntiteUtilisateurInscrit;
};
type RepresentationUtilisateurInscrit = {
  id: crypto.UUID;
  donnees: UtilisateurDTO;
};

type Preferences = {
  nomAffichageAnnuaire: string;
};

export async function up(knex: Knex): Promise<void | number[]> {
  return knex('utilisateurs_mac')
    .where('type', 'UTILISATEUR_INSCRIT')
    .then(async (lignes: RepresentationUtilisateurInscrit[]) => {
      const misesAJour = lignes.map(async (ligne) => {
        const { preferences, ...reste } = ligne.donnees;
        return knex('utilisateurs_mac')
          .where('id', ligne.id)
          .update({
            donnees: {
              ...reste,
            },
          });
      });
      return Promise.all(misesAJour);
    });
}

export async function down(_knex: Knex): Promise<void> {}
