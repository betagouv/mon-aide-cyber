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

const main = async (): Promise<Resultat> => {
  const debutExtraction = FournisseurHorloge.maintenant();
  console.log(`Début tâche extraction COT à ${debutExtraction.toISOString()}`);
  const entrepots = fabriqueEntrepots();
  const adaptateurEnvoiMessage = fabriqueAdaptateurEnvoiMail();
  const annuaireCOT = fabriqueAnnuaireCOT();
  const rapport = await uneExtraction({
    entrepotDemandes: entrepots.demandesDevenirAidant(),
  }).extrais<string>(new RapportExcel());

  const date = FournisseurHorloge.formateDate(
    FournisseurHorloge.maintenant()
  ).date;

  return adaptateurEnvoiMessage
    .envoie({
      corps:
        'Vous trouverez ci-joint le dernier rapport concernant les demandes pour devenir Aidant en attente.',
      objet: `Rapport MonAideCyber du ${date}`,
      destinataire: annuaireCOT
        .annuaireCOT()
        .tous()
        .map((cot) => ({ email: cot })),
      pieceJointe: { contenu: rapport, nom: `${date}_Rapport_COT.xlsx` },
    })
    .then(() => {
      console.log(
        'Extraction faite en : %s',
        formatDistance(FournisseurHorloge.maintenant(), debutExtraction)
      );
      return 'OK' as Resultat;
    })
    .catch((erreur) => {
      console.error(
        'Une erreur a eu lieu pendant l’envoi planifié du rapport COT',
        erreur
      );
      console.log(
        'Extraction échouée en : %s',
        formatDistance(FournisseurHorloge.maintenant(), debutExtraction)
      );
      return 'KO';
    });
};

main()
  .then((resultat) => {
    Sentry.captureCheckIn({
      checkInId: Sentry.captureCheckIn({
        monitorSlug: 'envoi-rapport-cot',
        status: 'in_progress',
      }),
      monitorSlug: 'envoi-rapport-cot',
      status: resultat === 'OK' ? 'ok' : 'error',
    });
    process.exit(0);
  })
  .catch((erreur) => console.error('Une erreur s’est produite', erreur));
