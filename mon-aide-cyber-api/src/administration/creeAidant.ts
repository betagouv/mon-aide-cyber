import { program } from 'commander';
import { EntrepotAidantPostgres } from '../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import crypto from 'crypto';
import { ServiceDeChiffrementChacha20 } from '../infrastructure/securite/ServiceDeChiffrementChacha20';

const command = program
  .description('Crée un aidant')
  .argument(
    '<identifiantConnexion>',
    'Un identifiant de connexion (adresse email par exemple',
  )
  .argument('<motDePasse>', 'Un mot de passe (Robuste!)')
  .argument('<nomPrenom>', 'Nom et Prénom séparé par un espace');

type Identifiants = {
  identifiantConnexion: string;
  motDePasse: string;
  nomPrenom: string;
};
command.action((...args: any[]) => {
  const identifiants = {
    identifiantConnexion: args[0],
    motDePasse: args[1],
    nomPrenom: args[2],
  } as Identifiants;
  console.log('IDENTIFIANTS', identifiants.identifiantConnexion);

  const entrepot = new EntrepotAidantPostgres(
    new ServiceDeChiffrementChacha20(),
  );

  entrepot
    .rechercheParIdentifiantConnexionEtMotDePasse(
      identifiants.identifiantConnexion,
      identifiants.motDePasse,
    )
    .then((aidant) => {
      console.log("L'aidant '%s' existe déjà", aidant.nomPrenom);
      process.exit(0);
    })
    .catch(async () => {
      await entrepot.persiste({
        identifiant: crypto.randomUUID(),
        identifiantConnexion: identifiants.identifiantConnexion,
        motDePasse: identifiants.motDePasse,
        nomPrenom: identifiants.nomPrenom,
      });
      console.log('Utilisateur %s créé', identifiants.nomPrenom);
      process.exit(0);
    });
});

program.parse();
