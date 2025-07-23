import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { trouveLesAidantsGendarmes } from './trouveLesAidantsGendarmes';
import { Aidant } from '../../../espace-aidant/Aidant';
import { metAJourLesGendarmesSansEntite } from './metAJourLesGendarmesSansEntite';
import configurationJournalisation from '../../../infrastructure/entrepots/postgres/configurationJournalisation';
import { knex } from 'knex';
import crypto from 'crypto';

type ResultatCommandeAdministration = {
  nombreEvenementsAModifier: number;
  nombreTotalGendarmes: number;
  identifiantsGendarmesAModifier: string[];
};

program
  .description('Rattrape les gendarmes')
  .option('--dry-run <dryRun>', 'Exécute en mode dry-run', 'true')
  .action(async (options) => {
    const dryRunActif = options.dryRun !== 'false';

    const resultatCommandeAdministration: ResultatCommandeAdministration = {
      nombreTotalGendarmes: 0,
      identifiantsGendarmesAModifier: [],
      nombreEvenementsAModifier: 0,
    };

    const serviceDeChiffrement = adaptateurServiceChiffrement();
    const entrepotAidants = new EntrepotAidantPostgres(serviceDeChiffrement);
    const connexionKnexJournal = knex(configurationJournalisation);

    const gendarmesExistants: Aidant[] =
      await trouveLesAidantsGendarmes(entrepotAidants);
    resultatCommandeAdministration.nombreTotalGendarmes =
      gendarmesExistants.length;

    const gendarmesSansEntite = gendarmesExistants.filter(
      (g) => !g.entite || !g.entite.siret
    );

    if (gendarmesSansEntite.length > 0) {
      resultatCommandeAdministration.identifiantsGendarmesAModifier =
        gendarmesSansEntite.map((gse) =>
          crypto.createHash('sha256').update(gse.identifiant).digest('hex')
        );
    }

    if (!dryRunActif) {
      try {
        console.log(
          `Nombre de comptes gendarmes à modifier : ${resultatCommandeAdministration.identifiantsGendarmesAModifier.length} / ${resultatCommandeAdministration.nombreTotalGendarmes} gendarmes`
        );
        await metAJourLesGendarmesSansEntite(
          gendarmesSansEntite,
          entrepotAidants
        );
      } catch (e) {
        console.error(
          "Une erreur est survenue lors de la mise à jour de l'entité pour les gendarmes concernés",
          e
        );
      }
    }

    try {
      const tousLesIdentifiantsDeGendarmesHashes = gendarmesExistants.map(
        (ge) => crypto.createHash('sha256').update(ge.identifiant).digest('hex')
      );

      await connexionKnexJournal.transaction(async (trx) => {
        const evenementsAidantCree = await trx(
          'journal_mac.evenements'
        ).whereRaw(
          `type = 'AIDANT_CREE' AND donnees->>'identifiant' = ANY(?) AND (donnees->>'typeAidant' is null OR donnees->>'typeAidant' <> 'Gendarme')`,
          [tousLesIdentifiantsDeGendarmesHashes]
        );

        resultatCommandeAdministration.nombreEvenementsAModifier =
          evenementsAidantCree.length;

        if (dryRunActif) {
          await trx.rollback();
          console.log(JSON.stringify(resultatCommandeAdministration));
          return;
        }

        console.log(
          `Il y a ${resultatCommandeAdministration.nombreEvenementsAModifier} événements de création d'Aidants à modifier`
        );

        return evenementsAidantCree.map(async ({ id, donnees }, index) => {
          const nouvellesDonnees = {
            ...donnees,
            typeAidant: 'Gendarme',
          };

          return trx('journal_mac.evenements')
            .where({ id })
            .update({ donnees: nouvellesDonnees })
            .then(() => {
              console.log(
                `${((index + 1) / evenementsAidantCree.length) * 100}% (${index + 1} / ${evenementsAidantCree.length}) des événements modifiés`
              );
            });
        });
      });
    } catch (e) {
      console.error(
        'Une erreur est survenue lors de la récupération des événements',
        e
      );
    }

    process.exit(0);
  });

program.parse();
