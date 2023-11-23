import { EntrepotAidantPostgres } from './src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { ServiceDeChiffrement } from './src/infrastructure/securite/ServiceChiffrement';
import crypto from 'crypto';

if (process.env.CREE_UTILISATEUR_DEMO) {
  const entrepot = new EntrepotAidantPostgres(new ServiceDeChiffrement());

  entrepot
    .rechercheParIdentifiantConnexionEtMotDePasse(
      process.env.IDENTIFIANT_UTILISATEUR_DEMO!,
      process.env.MOT_DE_PASSE_UTILISATEUR_DEMO!,
    )
    .then((aidant) => {
      console.log("L'aidant '%s' existe déjà", aidant.nomPrenom);
      process.exit(0);
    })
    .catch(async () => {
      await entrepot.persiste({
        identifiant: crypto.randomUUID(),
        identifiantConnexion: process.env.IDENTIFIANT_UTILISATEUR_DEMO!,
        motDePasse: process.env.MOT_DE_PASSE_UTILISATEUR_DEMO!,
        nomPrenom: process.env.NOM_PRENOM_UTILISATEUR_DEMO!,
      });
      console.log(
        'Utilisateur %s créé',
        process.env.NOM_PRENOM_UTILISATEUR_DEMO,
      );
      process.exit(0);
    });
}
