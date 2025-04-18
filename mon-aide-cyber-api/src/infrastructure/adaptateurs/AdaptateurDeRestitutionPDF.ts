import {
  AdaptateurDeRestitution,
  ContenuHtml,
} from '../../adaptateurs/AdaptateurDeRestitution';
import * as pug from 'pug';
import puppeteer, { Browser, PDFOptions } from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { Restitution } from '../../restitution/Restitution';
import { FournisseurHorloge } from '../horloge/FournisseurHorloge';

const forgeIdentifiant = (identifiant: string): string =>
  `${identifiant.substring(0, 3)} ${identifiant.substring(
    3,
    6
  )} ${identifiant.substring(6, 8)}`.toUpperCase();

export class AdaptateurDeRestitutionPDF extends AdaptateurDeRestitution<Buffer> {
  private identifiant = '';
  constructor(traductionThematiques: Map<string, string>) {
    super(traductionThematiques);
  }

  genereRestitution(restitution: Restitution): Promise<Buffer> {
    this.identifiant = forgeIdentifiant(restitution.identifiant);
    return super.genereRestitution(restitution);
  }

  protected async genereInformations(_: Restitution): Promise<ContenuHtml> {
    return { corps: '', entete: '', piedPage: '' };
  }

  protected genere(mesures: Promise<ContenuHtml>[]) {
    const pageDeGarde = this.genereHtml('restitution.page-de-garde', {
      dateGeneration: FournisseurHorloge.formateDate(
        FournisseurHorloge.maintenant()
      ),
      identifiant: this.identifiant,
    });
    mesures.unshift(pageDeGarde);
    return Promise.all(mesures)
      .then((htmls) => generePdfs(htmls, this.identifiant))
      .then((pdfs) => fusionnePdfs(pdfs))
      .catch((erreur) => {
        console.log('Erreur génération restitution', erreur);
        throw new Error(erreur);
      });
  }

  async genereHtml(pugCorps: string, paramsCorps: any): Promise<ContenuHtml> {
    const fonctionInclusionDynamique = (
      cheminTemplatePug: string,
      options = {}
    ) => {
      return pug.renderFile(
        `src/infrastructure/restitution/pdf/modeles/${cheminTemplatePug}`,
        options
      );
    };
    return Promise.all([
      pug.compileFile(
        `src/infrastructure/restitution/pdf/modeles/${pugCorps}.pug`
      )({
        ...paramsCorps,
        include: fonctionInclusionDynamique,
      }),
    ])
      .then(([corps]) => ({ corps, entete: '', piedPage: '' }))
      .catch((erreur) => {
        console.log('Erreur génération HTML', erreur);
        throw new Error(erreur);
      });
  }
}

const fusionnePdfs = (pdfs: Buffer[]): Promise<Buffer> => {
  const fusionne = (fusion: PDFDocument): Promise<PDFDocument> => {
    return pdfs.reduce(
      (pdfDocument, pdf) =>
        pdfDocument.then((f) =>
          PDFDocument.load(pdf)
            .then((document) =>
              f.copyPages(document, document.getPageIndices())
            )
            .then((copie) => copie.forEach((page) => f.addPage(page)))
            .then(() => pdfDocument)
        ),
      Promise.resolve(fusion)
    );
  };

  return PDFDocument.create()
    .then((fusion) => {
      return fusionne(fusion);
    })
    .then((fusion) => fusion.save())
    .then((pdf) => Buffer.from(pdf));
};

const generePdfs = async (
  pagesHtml: ContenuHtml[],
  identifiant: string
): Promise<Buffer[]> => {
  const pagesHtmlRemplies = pagesHtml.filter(
    (pageHtml) => pageHtml.corps !== ''
  );

  const navigateur = await lanceNavigateur();
  try {
    const contenu = pagesHtmlRemplies.reduce(
      (contenuPrecedent, contenuCourant) => {
        contenuPrecedent.corps += contenuCourant.corps;

        return contenuPrecedent;
      },
      {
        corps: '',
      } as ContenuHtml
    );

    const contenuFinal: ContenuHtml = {
      corps: contenu.corps,
      entete: pug.compileFile(
        'src/infrastructure/restitution/pdf/modeles/restitution.entete.pug'
      )(),
      piedPage: pug.compileFile(
        'src/infrastructure/restitution/pdf/modeles/restitution.piedpage.pug'
      )({ identifiant }),
    };
    const resultat = navigateur.newPage().then((page) => {
      return page
        .setContent(contenuFinal.corps)
        .then(async () =>
          Buffer.from(
            await page.pdf(
              formatPdfA4(contenuFinal.entete, contenuFinal.piedPage)
            )
          )
        )
        .catch((erreur) => {
          console.log(erreur);
          throw erreur;
        });
    });
    return await Promise.all([resultat]);
  } catch (erreur) {
    console.log(erreur);
    throw erreur;
  } finally {
    navigateur.close();
  }
};

const formatPdfA4 = (enteteHtml: string, piedPageHtml: string): PDFOptions => ({
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: enteteHtml,
  footerTemplate: piedPageHtml,
  margin: { bottom: '15mm', left: '15mm', right: '15mm', top: '15mm' },
});

const lanceNavigateur = (): Promise<Browser> =>
  puppeteer.launch({
    // Documentation des arguments : https://peter.sh/experiments/chromium-command-line-switches/
    // Inspiration pour la liste utilisée ici : https://www.bannerbear.com/blog/ways-to-speed-up-puppeteer-screenshots/
    // Le but est d'avoir un Puppeteer le plus léger et rapide à lancer possible.
    args: [
      '--no-sandbox',
      '--font-render-hinting=none',
      '--disable-gpu',
      '--autoplay-policy=user-gesture-required',
      '--disable-accelerated-2d-canvas',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-zygote',
      '--password-store=basic',
      '--single-process',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ],
  });
