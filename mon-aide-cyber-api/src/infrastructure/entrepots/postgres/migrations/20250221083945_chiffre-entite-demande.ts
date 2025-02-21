import { Knex } from 'knex';
import { Departement } from '../../../../gestion-demandes/departements';
import crypto from 'crypto';
import { adaptateurServiceChiffrement } from '../../../adaptateurs/adaptateurServiceChiffrement';

type TypeEntite = 'ServicePublic' | 'ServiceEtat' | 'Association';
type RepresentationDemandeDevenirAidant = {
  id: crypto.UUID;
  donnees: {
    date: Date;
    nom: string;
    prenom: string;
    mail: string;
    departement: Departement;
    entite?: EntiteDemande;
  };
};

type EntiteDemande = {
  type: TypeEntite;
  nom?: string;
  siret?: string;
};

export async function up(knex: Knex): Promise<void | number[]> {
  const serviceDeChiffrement = adaptateurServiceChiffrement();
  return knex('demandes-devenir-aidant').then(
    async (lignes: RepresentationDemandeDevenirAidant[]) => {
      const misesAJour = lignes.map(async (ligne) => {
        return knex('utilisateurs_mac')
          .where('id', ligne.id)
          .update({
            donnees: {
              ...ligne.donnees,
              entite: {
                ...(ligne.donnees.entite?.type && {
                  type: serviceDeChiffrement.chiffre(ligne.donnees.entite.type),
                }),
                ...(ligne.donnees.entite?.nom && {
                  nom: serviceDeChiffrement.chiffre(ligne.donnees.entite.nom),
                }),
                ...(ligne.donnees.entite?.siret && {
                  siret: serviceDeChiffrement.chiffre(
                    ligne.donnees.entite.siret
                  ),
                }),
              },
            },
          });
      });
      return Promise.all(misesAJour);
    }
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
