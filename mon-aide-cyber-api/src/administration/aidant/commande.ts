import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { creeAidant, DonneesAidant } from './creeAidant';
import { BusEvenementMAC } from '../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../adaptateurs/fabriqueConsommateursEvenements';
import { adaptateurServiceChiffrement } from '../../infrastructure/adaptateurs/adaptateurServiceChiffrement';

const command = program
  .description('Crée un aidant')
  .argument(
    '<identifiantConnexion>',
    'Un identifiant de connexion (adresse email par exemple',
  )
  .argument('<motDePasse>', 'Un mot de passe (Robuste!)')
  .argument('<nomPrenom>', 'Nom et Prénom séparé par un espace');

command.action(async (...args: any[]) => {
  const identifiants: DonneesAidant = {
    identifiantConnexion: args[0].toLowerCase(),
    motDePasse: args[1],
    nomPrenom: args[2],
  };

  const entrepot = new EntrepotAidantPostgres(adaptateurServiceChiffrement());

  const aidant = await creeAidant(
    entrepot,
    new BusEvenementMAC(fabriqueConsommateursEvenements()),
    identifiants,
  );
  if (aidant) {
    console.log('Utilisateur %s créé', aidant.nomPrenom);
  } else {
    console.log("L'aidant '%s' existe déjà", identifiants.nomPrenom);
  }
  process.exit(0);
});

program.parse();
