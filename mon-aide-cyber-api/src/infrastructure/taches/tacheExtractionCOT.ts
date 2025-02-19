import { fabriqueEntrepots } from '../../adaptateurs/fabriqueEntrepots';
import {
  Rapport,
  RepresentationRapport,
  uneExtraction,
} from '../../espace-admin/extraction/Extraction';
import { stream } from 'exceljs';
import fs from 'fs';
import { isArray } from 'lodash';
import { fabriqueAdaptateurEnvoiMail } from '../adaptateurs/fabriqueAdaptateurEnvoiMail';
import { fabriqueAnnuaireCOT } from '../adaptateurs/fabriqueAnnuaireCOT';
import { FournisseurHorloge } from '../horloge/FournisseurHorloge';
import * as Sentry from '@sentry/node';
import { formatDistance } from 'date-fns';
import { program } from 'commander';
import {
  alpesDeHauteProvence,
  gironde,
} from '../../gestion-demandes/departements';
import { sentry } from '../../adaptateurs/adaptateurEnvironnement';

class RapportExcel implements Rapport<string> {
  private readonly workbookWriter: stream.xlsx.WorkbookWriter;
  private readonly CHEMIN_RAPPORT = '/tmp/rapport_cot.xlsx';

  constructor() {
    const streamEcriture = fs.createWriteStream(this.CHEMIN_RAPPORT);
    this.workbookWriter = new stream.xlsx.WorkbookWriter({
      stream: streamEcriture,
      useStyles: true,
      useSharedStrings: true,
    });
    streamEcriture.on('finish', () => {
      streamEcriture.close();
    });
  }

  ajoute<
    REPRESENTATION_VALEUR,
    REPRESENTATION_RAPPORT extends RepresentationRapport<
      REPRESENTATION_VALEUR,
      any
    >,
  >(representation: REPRESENTATION_RAPPORT): void {
    const sheet = this.workbookWriter.addWorksheet(representation.intitule);
    if (isArray(representation.valeur)) {
      sheet.columns = representation.entetes.map((entete) => ({
        header: entete.entete,
        key: entete.clef as string,
      }));
      representation.valeur.forEach((ligne, index) => {
        sheet.addRow({ id: index, ...ligne }).commit();
      });
    }
    sheet.commit();
  }

  genere(): Promise<string> {
    return this.workbookWriter.commit().then(() => {
      return fs.readFileSync(this.CHEMIN_RAPPORT, { encoding: 'base64' });
    });
  }
}

type Resultat = 'OK' | 'KO';

const extrais = async (test = false): Promise<Resultat> => {
  const debutExtraction = FournisseurHorloge.maintenant();
  console.log(`Début tâche extraction COT à ${debutExtraction.toISOString()}`);
  const entrepots = fabriqueEntrepots();
  const adaptateurEnvoiMessage = fabriqueAdaptateurEnvoiMail();
  const annuaireCOT = fabriqueAnnuaireCOT();

  return uneExtraction({
    entrepotDemandes: entrepots.demandesDevenirAidant(),
    entrepotDemandesAide: entrepots.demandesAideLecture(),
    entrepotStatistiquesAidant: entrepots.statistiquesAidant(),
    entrepotStatistiquesUtilisateurInscrit:
      entrepots.statistiquesUtilisateurInscrit(),
  })
    .extrais<string>(new RapportExcel())
    .then(async (rapport) => {
      const date = FournisseurHorloge.formateDate(
        FournisseurHorloge.maintenant()
      ).date;

      const emailsCot: string[] = [];
      if (test) {
        emailsCot.push(
          annuaireCOT.annuaireCOT().rechercheEmailParDepartement(gironde)
        );
        emailsCot.push(
          annuaireCOT
            .annuaireCOT()
            .rechercheEmailParDepartement(alpesDeHauteProvence)
        );
      } else {
        emailsCot.push(...annuaireCOT.annuaireCOT().tous());
      }
      try {
        await adaptateurEnvoiMessage.envoie({
          corps:
            'Vous trouverez ci-joint le dernier rapport concernant les demandes pour devenir Aidant en attente.',
          objet: `Rapport MonAideCyber du ${date}`,
          destinataire: emailsCot.map((cot) => ({ email: cot })),
          pieceJointe: { contenu: rapport, nom: `${date}_Rapport_COT.xlsx` },
        });
        console.log(
          'Extraction faite en : %s',
          formatDistance(FournisseurHorloge.maintenant(), debutExtraction)
        );
        return 'OK' as Resultat;
      } catch (erreur) {
        console.error(
          'Une erreur a eu lieu pendant l’envoi planifié du rapport COT',
          erreur
        );
        console.log(
          'Extraction échouée en : %s',
          formatDistance(FournisseurHorloge.maintenant(), debutExtraction)
        );
        return 'KO';
      }
    })
    .catch((erreur) => {
      console.log('Extraction échouée : %s', erreur);
      return 'KO';
    });
};

const commande = program
  .description('Exécute la âche d’extraction planifiée pour les COT')
  .option(
    '-t, --test',
    'Envoie un test pour les régions Nouvelle-Aquitaine et Provences-Alpes-Côte d’Azure'
  );

const SLUG_ENVOI_RAPPORT_COT = 'envoi-rapport-cot';

commande.action(async (options) => {
  Sentry.init({
    dsn: sentry().dsn() || '',
    environment: sentry().environnement() || '',
    debug: true,
  });

  const checkInId = Sentry.captureCheckIn({
    monitorSlug: SLUG_ENVOI_RAPPORT_COT,
    status: 'in_progress',
  });
  await extrais(options.test)
    .then((resultat) => {
      const status = resultat === 'OK' ? 'ok' : 'error';
      Sentry.captureCheckIn({
        checkInId,
        monitorSlug: SLUG_ENVOI_RAPPORT_COT,
        status,
      });
    })
    .catch((erreur) => {
      console.error('Une erreur s’est produite', erreur);
      Sentry.captureCheckIn({
        checkInId,
        monitorSlug: SLUG_ENVOI_RAPPORT_COT,
        status: 'error',
      });
    });
  setInterval(() => process.exit(), 500);
});

program.parse();
