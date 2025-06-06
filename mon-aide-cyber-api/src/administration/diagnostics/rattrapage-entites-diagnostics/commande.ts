import { program } from 'commander';
import { chiffreLesIdentifiantsDesEntitesAidesDansLesRelations } from './rattrapage';
import { knex } from 'knex';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import knexfile from '../../../infrastructure/entrepots/postgres/knexfile';
import { Objet, Relation, Tuple, Utilisateur } from '../../../relation/Tuple';
import crypto from 'crypto';
import { EntrepotRelationPostgres } from '../../../relation/infrastructure/EntrepotRelationPostgres';
import { EntrepotRelation } from '../../../relation/EntrepotRelation';

export type DonneesRelation = {
  objet: Objet;
  relation: Relation;
  utilisateur: Utilisateur;
};
export type Ligne = {
  id: crypto.UUID;
  donnees: DonneesRelation;
};

export type EntiteAidee = {
  id: crypto.UUID;
  identifiant: string;
};

export interface EntrepotRelationRattrapage extends EntrepotRelation {
  parIdentifiant(id: crypto.UUID): Promise<Tuple>;
}

class EntrepotRelationRattrapagePostgres
  extends EntrepotRelationPostgres
  implements EntrepotRelationRattrapage
{
  parIdentifiant(__id: crypto.UUID): Promise<Tuple> {
    throw new Error('Method not implemented.');
  }
}

const command = program.description(
  'Exécute le rattrapage des relations entre les diagnostics et les entités Aidées'
);

command.action(async () => {
  console.log('Lance le rattrapage');

  const connexionKnex = knex(knexfile);

  const relationsEntiteAidees: EntiteAidee[] = await connexionKnex
    .from('relations')
    .whereRaw("(donnees->>'relation') = ?", 'destinataire')
    .andWhereRaw("(donnees->'utilisateur'->>'type')", 'entiteAidee')
    .select('relations.*')
    .then((lignes: Ligne[]) =>
      lignes.map((l) => ({
        id: l.id,
        identifiant: l.donnees.utilisateur.identifiant,
      }))
    );
  const entrepotRelation = new EntrepotRelationRattrapagePostgres();
  const serviceDeChiffrement = adaptateurServiceChiffrement();

  try {
    await chiffreLesIdentifiantsDesEntitesAidesDansLesRelations(
      entrepotRelation,
      serviceDeChiffrement,
      relationsEntiteAidees
    );
  } catch (error) {
    console.log('Une erreur a eu lieu durant le rattrapage', error);
  }

  process.exit(0);
});

program.parse();
