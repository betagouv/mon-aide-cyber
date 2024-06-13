import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { ServiceDeChiffrementChacha20 } from '../../../infrastructure/securite/ServiceDeChiffrementChacha20';
import crypto from 'crypto';
import { migreAidants } from './migreAidants';
import * as fs from 'node:fs';
import { ServiceDeChiffrementClair } from './ServiceDeChiffrementClair';

const command = program
  .description('Migre les aidants')
  .argument(
    '<cheminFichier>',
    'le chemin du fichier contenant les aidants à migrer (au format json)\n' +
      "Requête pour avoir les Aidants au bon format SELECT json_agg(json_build_object('identifiant', u.id, 'aidant', u.donnees)) FROM utilisateurs u;"
  );

const serviceChiffrementOrigine =
  process.env.CLEF_SECRETE_CHIFFREMENT_ORIGINE !== undefined
    ? new ServiceDeChiffrementChacha20(
        crypto.randomBytes(12),
        crypto.randomBytes(16),
        process.env.CLEF_SECRETE_CHIFFREMENT_ORIGINE
      )
    : new ServiceDeChiffrementClair();

command.action(async (...args: any[]) => {
  try {
    const entrepot = new EntrepotAidantPostgres(adaptateurServiceChiffrement());
    const aidantsMigres = await migreAidants(
      entrepot,
      serviceChiffrementOrigine,
      JSON.parse(fs.readFileSync(args[0], { encoding: 'utf-8' }))
    );

    const erreurs = aidantsMigres.erreurs
      ? `Aidants non migrés :\n${aidantsMigres.erreurs.join('\n')}`
      : '';
    console.log(
      `${aidantsMigres.migres} migrés sur ${aidantsMigres.total} ${erreurs}`
    );

    process.exit(0);
  } catch (erreur) {
    console.log('ERREUR', erreur);
  }
});

program.parse();
