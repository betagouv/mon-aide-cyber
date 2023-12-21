import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { creeAidant, DonneesAidant } from './creeAidant';
import { BusEvenementMAC } from '../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../adaptateurs/fabriqueConsommateursEvenements';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurServiceChiffrement } from '../../infrastructure/adaptateurs/adaptateurServiceChiffrement';

const command = program
  .description('Crée un aidant')
  .argument(
    '<identifiantConnexion>',
    'Un identifiant de connexion (adresse email par exemple',
  )
  .argument('<motDePasse>', 'Un mot de passe (Robuste!)')
  .argument('<nomPrenom>', 'Nom et Prénom séparé par un espace')
  .argument(
    '<dateSignatureCGU>',
    'Date de la signature des CGU',
    FournisseurHorloge.enDate,
  )
  .argument(
    '<dateSignatureCharte>',
    'Date de la signature de la charte',
    FournisseurHorloge.enDate,
  );

command.action(async (...args: any[]) => {
  const identifiants: DonneesAidant = {
    identifiantConnexion: args[0],
    motDePasse: args[1],
    nomPrenom: args[2],
    dateSignatureCGU: args[3],
    dateSignatureCharte: args[4],
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
