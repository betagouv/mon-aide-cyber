import { program } from 'commander';
import crypto from 'crypto';
import { EntrepotJournalisationPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotJournalisationPostgres';
import configurationJournalisation from '../../../infrastructure/entrepots/postgres/configurationJournalisation';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { Publication } from '../../../journalisation/Publication';

const entrepotJournalisation = new EntrepotJournalisationPostgres(
  configurationJournalisation
);

const command = program.description(
  'Exécute le rattrapage des événements (diagnostics Excel et environnement de Démo)'
);

command.action(async () => {
  console.log('Démarrage du rattrapage Excel');
  for (let i = 0; i < 300; i++) {
    console.log(`${i}/199`);
    const evt: Publication = {
      identifiant: crypto.randomUUID(),
      type: 'DIAGNOSTIC_LANCE',
      date: FournisseurHorloge.enDate('2024-04-10T08:00:00'),
      donnees: {
        identifiantDiagnostic: crypto.randomUUID(),
        profil: 'AIDANT',
        identifiantUtilisateur: 'AIDANT_RATTRAPAGE_EXCEL',
      },
    };
    await entrepotJournalisation.persiste(evt);
  }

  console.log('Démarrage du rattrapage Démo');
  for (let i = 0; i < 200; i++) {
    console.log(`${i}/199`);
    const evt: Publication = {
      identifiant: crypto.randomUUID(),
      type: 'DIAGNOSTIC_LANCE',
      date: FournisseurHorloge.enDate('2024-04-10T08:00:00'),
      donnees: {
        identifiantDiagnostic: crypto.randomUUID(),
        profil: 'AIDANT',
        identifiantUtilisateur: 'AIDANT_RATTRAPAGE_DEMO',
      },
    };
    await entrepotJournalisation.persiste(evt);
  }

  process.exit(0);
});

program.parse();
