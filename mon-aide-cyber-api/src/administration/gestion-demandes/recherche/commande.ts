import { program } from 'commander';
import { EntrepotDemandeDevenirAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotDemandeDevenirAidantPostgres';
import { compareAsc } from 'date-fns';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { DemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';

const command = program
  .description('Obtenir le détail de la demande pour un Aidant donné')
  .option('-n, --nom <nom>', 'Le nom ou prénom de l’Aidant')
  .option('-m, --mail <mail>', "Tout ou partie de l'email recherché");

type Predicat = (d: DemandeDevenirAidant) => boolean;

command.action(async (options) => {
  console.log('Options', options);

  const entrepot = new EntrepotDemandeDevenirAidantPostgres(
    adaptateurServiceChiffrement()
  );
  let predicat: Predicat;
  if (options.nom) {
    const nomPrenom: string = options.nom.toLowerCase().trim();
    predicat = (d: DemandeDevenirAidant) =>
      d.nom.toLowerCase().trim().includes(nomPrenom) ||
      d.prenom.toLowerCase().trim().includes(nomPrenom);
  }
  if (options.mail) {
    const mail: string = options.mail.toLowerCase().trim();
    predicat = (d: DemandeDevenirAidant) =>
      d.mail.toLowerCase().trim().includes(mail);
  }

  const demandes = await entrepot
    .tous()
    .then((demandes) =>
      demandes
        .filter((d) => predicat(d))
        .sort((demandeA, demandeB) => compareAsc(demandeA.date, demandeB.date))
    );

  console.log(`Il y a %s demandes trouvée(s)`, demandes.length);
  console.log(JSON.stringify(demandes, undefined, 2));

  process.exit(0);
});

program.parse();
