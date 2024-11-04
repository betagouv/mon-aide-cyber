import { program } from 'commander';
import { EntrepotDemandeDevenirAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotDemandeDevenirAidantPostgres';
import { compareAsc } from 'date-fns';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';

const command = program
  .description('Obtenir le détail de la demande pour un Aidant donné')
  .argument('<nomPrenomAidant>', 'Le nom ou prénom de l’Aidant');

command.action(async (...args: any[]) => {
  const nomPrenom: string = args[0].toLowerCase().trim();

  const entrepot = new EntrepotDemandeDevenirAidantPostgres(
    adaptateurServiceChiffrement()
  );

  const demandes = await entrepot
    .tous()
    .then((demandes) =>
      demandes
        .filter(
          (d) =>
            d.nom.toLowerCase().trim().includes(nomPrenom) ||
            d.prenom.toLowerCase().trim().includes(nomPrenom)
        )
        .sort((demandeA, demandeB) => compareAsc(demandeA.date, demandeB.date))
    );

  console.log(`Il y a %s demandes trouvée(s)`, demandes.length);
  console.log(JSON.stringify(demandes, undefined, 2));

  process.exit(0);
});

program.parse();
