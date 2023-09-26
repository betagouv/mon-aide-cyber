import { AdaptateurPDF } from "../../adaptateurs/AdaptateurPDF";
import { Diagnostic } from "../../diagnostic/Diagnostic";
import * as pug from "pug";
import puppeteer, { Browser, PDFOptions } from "puppeteer";
import { PDFDocument } from "pdf-lib";

export class AdaptateurPDFMAC implements AdaptateurPDF {
  genereRecommandations(diagnostic: Diagnostic): Promise<Buffer> {
    return genereHtml("recommandations", {
      recommandations: diagnostic.recommandations,
    })
      .then((html) => generePdfs([html]))
      .then((pdfs) => fusionnePdfs(pdfs));
  }
}

const fusionnePdfs = (pdfs: Buffer[]): Promise<Buffer> => {
  const fusionne = (fusion: PDFDocument): Promise<PDFDocument> => {
    return pdfs.reduce(
      (pdfDocument, pdf) =>
        pdfDocument.then((f) =>
          PDFDocument.load(pdf)
            .then((document) =>
              f.copyPages(document, document.getPageIndices()),
            )
            .then((copie) => copie.forEach((page) => f.addPage(page)))
            .then(() => pdfDocument),
        ),
      Promise.resolve(fusion),
    );
  };

  return PDFDocument.create()
    .then((fusion) => {
      return fusionne(fusion);
    })
    .then((fusion) => fusion.save())
    .then((pdf) => Buffer.from(pdf));
};

type ContenuHtml = { corps: string; entete: string; piedPage: string };
const genereHtml = async (
  pugCorps: string,
  paramsCorps: any,
): Promise<ContenuHtml> => {
  const fonctionInclusionDynamique = (
    cheminTemplatePug: string,
    options = {},
  ) => {
    return pug.renderFile(
      `src/infrastructure/pdf/modeles/${cheminTemplatePug}`,
      options,
    );
  };
  const piedPage = pug.compileFile(
    "src/infrastructure/pdf/modeles/recommandations.piedpage.pug",
  )();
  return Promise.all([
    pug.compileFile(`src/infrastructure/pdf/modeles/${pugCorps}.pug`)({
      ...paramsCorps,
      include: fonctionInclusionDynamique,
    }),
    pug.compileFile(`src/infrastructure/pdf/modeles/${pugCorps}.entete.pug`)(),
  ]).then(([corps, entete]) => ({ corps, entete, piedPage }));
};

const generePdfs = (pagesHtml: ContenuHtml[]): Promise<Buffer[]> => {
  return lanceNavigateur().then((navigateur) =>
    Promise.all(
      pagesHtml.map((pageHtml) =>
        navigateur
          .newPage()
          .then((page) => page.setContent(pageHtml.corps).then(() => page))
          .then((page) =>
            page.pdf(formatPdfA4(pageHtml.entete, pageHtml.piedPage)),
          ),
      ),
    ),
  );
};

const formatPdfA4 = (enteteHtml: string, piedPageHtml: string): PDFOptions => ({
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: enteteHtml,
  footerTemplate: piedPageHtml,
  margin: { bottom: "2cm", left: "1cm", right: "1cm", top: "23mm" },
});

const lanceNavigateur = (): Promise<Browser> =>
  puppeteer.launch({
    headless: "new",
    // Documentation des arguments : https://peter.sh/experiments/chromium-command-line-switches/
    // Inspiration pour la liste utilisée ici : https://www.bannerbear.com/blog/ways-to-speed-up-puppeteer-screenshots/
    // Le but est d'avoir un Puppeteer le plus léger et rapide à lancer possible.
    args: [
      "--no-sandbox",
      "--font-render-hinting=none",
      "--disable-gpu",
      "--autoplay-policy=user-gesture-required",
      "--disable-accelerated-2d-canvas",
      "--disable-background-networking",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-breakpad",
      "--disable-client-side-phishing-detection",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-dev-shm-usage",
      "--disable-domain-reliability",
      "--disable-extensions",
      "--disable-features=AudioServiceOutOfProcess",
      "--disable-hang-monitor",
      "--disable-ipc-flooding-protection",
      "--disable-notifications",
      "--disable-offer-store-unmasked-wallet-cards",
      "--disable-popup-blocking",
      "--disable-print-preview",
      "--disable-prompt-on-repost",
      "--disable-renderer-backgrounding",
      "--disable-setuid-sandbox",
      "--disable-speech-api",
      "--disable-sync",
      "--hide-scrollbars",
      "--ignore-gpu-blacklist",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-default-browser-check",
      "--no-first-run",
      "--no-pings",
      "--no-zygote",
      "--password-store=basic",
      "--single-process",
      "--use-gl=swiftshader",
      "--use-mock-keychain",
    ],
  });
