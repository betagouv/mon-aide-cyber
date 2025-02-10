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
    REPRESENTATION_RAPPORT extends RepresentationRapport<REPRESENTATION_VALEUR>,
  >(representation: REPRESENTATION_RAPPORT): void {
    const sheet = this.workbookWriter.addWorksheet(representation.intitule);
    if (isArray(representation.valeur)) {
      sheet.columns = Object.keys(representation.valeur[0]).map(
        (entete, index) => ({
          header: representation.entete[index],
          key: entete,
        })
      );
      representation.valeur.forEach((demande, index) => {
        sheet.addRow({ id: index, ...demande }).commit();
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
    .then(() => 'OK' as Resultat)
    .catch((erreur) => {
      console.error(
        'Une erreur a eu lieu pendant l’envoi planifié du rapport COT',
        erreur
      );
      return 'KO';
    });
};

main().then((resultat) => {
  Sentry.captureCheckIn({
    checkInId: Sentry.captureCheckIn({
      monitorSlug: 'envoi-rapport-cot',
      status: 'in_progress',
    }),
    monitorSlug: 'envoi-rapport-cot',
    status: resultat === 'OK' ? 'ok' : 'error',
  });
});
