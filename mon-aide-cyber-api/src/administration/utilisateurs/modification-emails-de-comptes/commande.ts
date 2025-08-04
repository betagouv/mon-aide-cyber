import { program } from 'commander';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { EntrepotAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { Aidant } from '../../../espace-aidant/Aidant';
import { AdaptateurRepertoireDeContactsBrevo } from '../../../infrastructure/adaptateurs/AdaptateurRepertoireDeContactsBrevo';
import { EntrepotUtilisateurPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotUtilisateurPostgres';
import { Utilisateur } from '../../../authentification/Utilisateur';

const l = console.log;

function trouveAidant(tousLesAidants: Aidant[], email: string) {
  return tousLesAidants.find(
    (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
  ) as Aidant;
}

function trouveCompteUtilisateur(tousLesComptes: Utilisateur[], email: string) {
  return tousLesComptes.find(
    (c) =>
      c.identifiantConnexion.toLowerCase().trim() === email.toLowerCase().trim()
  ) as Utilisateur;
}

program
  .description("Modifie les emails de comptes d'Utilisateurs")
  .requiredOption(
    '--modifications <specificationsDesModifications>',
    'Tous les changements à fait, séparés par des | et avec " autour\n' +
      'Exemple pour changer "ancien" en "nouveau", et "rouge" en "bleu" : \n' +
      '"ancien@mail.fr,nouveau@mail.fr|rouge@mail.fr,bleu@mail.fr"'
  )
  .option('--dry-run <trueOuFalse>', 'Exécute en mode dry-run', 'true')
  .action(async (options) => {
    const dryRunActif = options.dryRun !== 'false';

    const modifications = options.modifications
      .split('|')
      .map((m: string) => m.trim());

    const todo = modifications.map((m: string) => {
      const [ancien, nouveau] = m.split(',');
      return { ancien, nouveau };
    });

    l(`🗒️  Vous avez demandé les changements d'email suivants :`);
    l(todo);

    if (dryRunActif) {
      l(`🧪 Le mode dry-run est actif ! On s'arrête là…`);
      process.exit(0);
    }

    l(`🚚 C'est parti…`);

    const chiffrement = adaptateurServiceChiffrement();
    const entrepotAidants = new EntrepotAidantPostgres(chiffrement);
    const comptesUtilisateursMAC = new EntrepotUtilisateurPostgres(chiffrement);

    const brevo = new AdaptateurRepertoireDeContactsBrevo();
    const tousLesAidants: Aidant[] = await entrepotAidants.tous();
    const tousLesComptes = await comptesUtilisateursMAC.tous();

    for (const { ancien, nouveau } of todo) {
      const aidantAncien = trouveAidant(tousLesAidants, ancien);

      if (!aidantAncien) {
        l(`🔴 ${ancien} : email non trouvé parmi les AIDANTS MAC`);
        continue;
      }

      const aidantNouveau = trouveAidant(tousLesAidants, nouveau);
      if (aidantNouveau) {
        l(
          `🔴 ${ancien} : le mail cible ${nouveau} est DÉJÀ un AIDANT MAC… on ne fait rien, il faut se concerter`
        );
        continue;
      }

      const utilisateurNouveau = trouveCompteUtilisateur(
        tousLesComptes,
        nouveau
      );
      if (utilisateurNouveau) {
        l(
          `🔴 ${ancien} : le mail cible ${nouveau} a DÉJÀ un compte UTILISATEUR INSCRIT MAC… on ne fait rien, il faut se concerter`
        );
        continue;
      }

      try {
        l(`⚫️⚫️⚫️ ${ancien} : démarrage de la modification vers ${nouveau}`);

        // On commence par Brevo car ça semble le plus fragile…
        await brevo.modifieEmail(ancien, nouveau);
        l(`🟢⚫️⚫️ ${ancien} : email modifié en ${nouveau} chez Brevo`);

        await entrepotAidants.persiste({ ...aidantAncien, email: nouveau });
        l(`🟢🟢⚫️ ${ancien} : email modifié en ${nouveau} chez nous`);

        const compteMAC = trouveCompteUtilisateur(tousLesComptes, ancien);
        if (compteMAC) {
          const aJour = { ...compteMAC, identifiantConnexion: nouveau };
          await comptesUtilisateursMAC.persiste(aJour);
          l(
            `🟢🟢🟢️ ${ancien} : compte d'authentification modifié en ${nouveau} chez nous`
          );
        } else {
          l(
            `🟢🟢🔵 ${ancien} : pas de compte d'authentification à modifier chez nous`
          );
        }
      } catch (e) {
        l(
          `💥 ${ancien} : problème lors de la mise à jour… sûrement à cause de Brevo`
        );
        l(e);
      }
    }

    process.exit(0);
  });

program.parse();
