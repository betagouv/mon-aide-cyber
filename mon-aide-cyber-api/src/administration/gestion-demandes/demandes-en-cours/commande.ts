import { program } from 'commander';
import { EntrepotDemandeDevenirAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotDemandeDevenirAidantPostgres';
import { compareAsc, endOfMonth, format } from 'date-fns';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import fs from 'fs';

const command = program
  .description('Obtenir la liste des demandes pour un mois donné')
  .argument(
    '<dateDebutPeriode>',
    'Une date au format YYYY-MM-DD pour obtenir les demandes pour un mois donné (i.e : 2024-09-01 pour les demandes du mois de Septembre 2024)'
  );

command.action(async (...args: any[]) => {
  const dateDebutPeriode: Date = new Date(Date.parse(args[0].toLowerCase()));

  const rapport: string[] = ['Date;Email;Nom - Prénom;Département;Statut;\n'];

  const entrepot = new EntrepotDemandeDevenirAidantPostgres(
    adaptateurServiceChiffrement()
  );

  const demandes = await entrepot.tous().then((demandes) =>
    demandes
      .filter(
        (d) =>
          d.date >= dateDebutPeriode && d.date <= endOfMonth(dateDebutPeriode)
      )
      .sort((demandeA, demandeB) => compareAsc(demandeA.date, demandeB.date))
      .map((demande) => ({
        date: demande.date,
        nom: demande.nom,
        prenom: demande.prenom,
        mail: demande.mail,
        departement: demande.departement.nom,
        statut: demande.statut,
      }))
  );

  demandes.forEach((demande) => {
    rapport.push(
      `${format(demande.date, 'dd-MM-yyyy')};${demande.mail};${demande.prenom} ${demande.nom};${demande.departement};${demande.statut}\n`
    );
  });

  fs.writeFileSync(
    `/tmp/${format(dateDebutPeriode, 'yyyy_MM')}_demandes_aidant.csv`,
    rapport.join(''),
    {
      encoding: 'utf-8',
    }
  );

  process.exit(0);
});

program.parse();
