import { program } from 'commander';
import { EntrepotsMAC } from '../../../infrastructure/entrepots/postgres/EntrepotsMAC';
import { Utilisateur } from '../../../authentification/Utilisateur';
import { UtilisateurMAC } from '../../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { EntrepotRelationPostgres } from '../../../relation/infrastructure/EntrepotRelationPostgres';

const l = console.log;

program
  .description("Modifie les emails de comptes d'Utilisateurs")
  .requiredOption(
    '--emailUtilisateur <emailUtilisateur>',
    'L‘adresse mail de l‘utilisateur'
  )
  .requiredOption(
    '--nouveauMotDePasse <nouveauMotDePasse>',
    'Le nouveau mot de passe pour le compte utilisateur'
  )
  .requiredOption(
    '--confirmationNouveauMotDePasse <confirmationNouveauMotDePasse>',
    'La confirmation du nouveau mot de passe pour le compte utilisateur'
  )
  .option('--dry-run <trueOuFalse>', 'Exécute en mode dry-run', 'true')
  .action(async (options) => {
    const {
      emailUtilisateur,
      nouveauMotDePasse,
      confirmationNouveauMotDePasse,
      dryRun,
    } = options;

    if (nouveauMotDePasse !== confirmationNouveauMotDePasse) {
      l(
        `⛔️  Une erreur est survenue, le mot de passe et sa confirmation ne correspondent pas !`
      );
      return process.exit(1);
    }

    l(
      `🗒️ Vous avez demandé à créer un compte de connexion à MAC pour ${emailUtilisateur}...`
    );

    const dryRunActif = dryRun !== 'false';
    const entrepots = new EntrepotsMAC();

    let compteUtilisateur: Utilisateur | undefined;
    try {
      compteUtilisateur = await entrepots
        .utilisateurs()
        .rechercheParIdentifiantDeConnexion(emailUtilisateur);
    } catch (e) {
      compteUtilisateur = undefined;
    }

    if (compteUtilisateur) {
      l(
        `⛔️  Pas besoin de continuer, le compte utilisateur ayant pour mail ${emailUtilisateur} existe déjà !`
      );
      return process.exit(0);
    }

    l(
      `🔍  Le compte utilisateur de ${emailUtilisateur} n'existe pas, vérifions l'existence de son profil...`
    );

    const profilUtilisateur: UtilisateurMAC | undefined = await entrepots
      .utilisateursMAC()
      .rechercheParMail(emailUtilisateur)
      .then((profilUtilisateur) => profilUtilisateur)
      .catch(() => undefined);

    if (!profilUtilisateur) {
      l(
        `⛔️  Il n'a aucun profil chez MAC, on ne fait rien et on invite l'utilisateur à se connecter avec Proconnect !`
      );
      return process.exit(0);
    }

    l(
      '✅  On a bien trouvé un profil pour cet utilisateur, on va pouvoir en faire un compte d‘authentification...'
    );
    l(profilUtilisateur);

    const entrepotRelation = new EntrepotRelationPostgres();

    const relations = await entrepotRelation.trouveObjetsLiesAUtilisateur(
      profilUtilisateur?.identifiant as string
    );
    const lesDiagnosticsInities = relations.filter(
      (r) => r.relation === 'initiateur'
    );
    const nombreDemandesAideAttribuees = relations.filter(
      (r) => r.relation === 'demandeAttribuee'
    ).length;

    const lesDiags = lesDiagnosticsInities.map((r) => r.objet);

    l(
      `L'utilisateur s'est attribué ${nombreDemandesAideAttribuees} demandes d'Aide...`
    );
    l(`... et a initié ${lesDiagnosticsInities.length} diagnostics !`);
    l('Lesquels sont...');
    l(lesDiags.map((d) => d.identifiant));

    if (dryRunActif) {
      l(`🧪 Le mode dry-run est actif ! On s'arrête là…`);
      return process.exit(0);
    }

    try {
      const utilisateur: Utilisateur = {
        identifiant: profilUtilisateur.identifiant,
        identifiantConnexion: profilUtilisateur.email,
        nomPrenom: profilUtilisateur.nomPrenom,
        motDePasse: nouveauMotDePasse,
        ...(profilUtilisateur.dateValidationCGU && {
          dateSignatureCGU: profilUtilisateur.dateValidationCGU,
        }),
      };
      await entrepots.utilisateurs().persiste(utilisateur);

      l(
        `🟢 Le compte de connexion utilisateur pour ${emailUtilisateur} a bien été créé !`
      );
      return process.exit(0);
    } catch (e) {
      l(
        `💥 Un problème est survenu lors de la création du compte de connexion utilisateur !`
      );
      console.error(e);
      return process.exit(1);
    }
  });

program.parse();
