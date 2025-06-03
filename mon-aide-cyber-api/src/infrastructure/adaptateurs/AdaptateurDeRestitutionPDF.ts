import {
  AdaptateurDeRestitution,
  ContenuHtml,
} from '../../adaptateurs/AdaptateurDeRestitution';
import * as pug from 'pug';
import puppeteer, { Browser, PDFOptions } from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { Restitution, trieLesIndicateurs } from '../../restitution/Restitution';
import { FournisseurHorloge } from '../horloge/FournisseurHorloge';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { libellesDesThematiques } from './transcripteur/traductionThematiques';

const forgeIdentifiant = (identifiant: string): string =>
  `${identifiant.substring(0, 3)} ${identifiant.substring(
    3,
    6
  )} ${identifiant.substring(6, 8)}`.toUpperCase();

type GenerationPDFExterne = {
  verifieConfiguration: () => void;
  endpointWebsocket: () => string;
};
const generationPdfExterne = (): GenerationPDFExterne => {
  const { GENERATION_PDF_URL_DU_SERVICE, GENERATION_PDF_TOKEN_DU_SERVICE } =
    process.env;

  return {
    verifieConfiguration: () => {
      const urlEstDefinie = !!GENERATION_PDF_URL_DU_SERVICE;
      const tokenEstDefini = !!GENERATION_PDF_TOKEN_DU_SERVICE;
      if (!urlEstDefinie || !tokenEstDefini)
        throw new Error(
          "La génération externe de PDF est activée. Mais il manque la configuration de l'URL et du token."
        );
    },
    endpointWebsocket: () =>
      `${GENERATION_PDF_URL_DU_SERVICE}?token=${GENERATION_PDF_TOKEN_DU_SERVICE}`,
  };
};

export class AdaptateurDeRestitutionPDF
  implements AdaptateurDeRestitution<Buffer>
{
  genereRestitution(restitution: Restitution): Promise<Buffer> {
    return this.genereLaRestitution(restitution);
  }

  protected genereLaRestitution(restitution: Restitution): Promise<Buffer> {
    const indicateursRestitution = trieLesIndicateurs(restitution);
    const identifiant = forgeIdentifiant(restitution.identifiant);
    const pageDeGarde = this.genereHtml({
      pugCorps: 'restitution.page-de-garde',
      params: {
        dateGeneration: FournisseurHorloge.formateDate(
          FournisseurHorloge.maintenant()
        ),
        identifiant: identifiant,
        mesures: restitution.mesures.mesuresPrioritaires,
        indicateurs: indicateursRestitution,
        traductions: libellesDesThematiques(),
        mesServicesCyber: adaptateurEnvironnement
          .mesServicesCyber()
          .urlMesServicesCyber(),
      },
    });
    const mesures = this.genereHtml({
      pugCorps: 'restitution.mesures',
      params: {
        mesures: restitution.mesures.mesuresPrioritaires,
        mesServicesCyber: `${adaptateurEnvironnement.mesServicesCyber().urlCyberDepart()}`,
      },
    });

    return Promise.all([pageDeGarde, mesures])
      .then((htmls) => generePdfs(htmls))
      .then((pdfs) => fusionnePdfs(pdfs))
      .catch((erreur) => {
        console.log('Erreur génération restitution', erreur);
        throw new Error(erreur);
      });
  }

  async genereHtml(configuration: {
    pugCorps: string;
    params: any;
  }): Promise<ContenuHtml> {
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
        `src/infrastructure/restitution/pdf/modeles/${configuration.pugCorps}.pug`
      )({
        ...configuration.params,
        include: fonctionInclusionDynamique,
      }),
    ])
      .then(([corps]) => ({
        corps,
        entete: '',
        piedPage: '',
      }))
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

const generePdfs = async (pagesHtml: ContenuHtml[]): Promise<Buffer[]> => {
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
      )({
        mesServicesCyber: adaptateurEnvironnement
          .mesServicesCyber()
          .urlMesServicesCyber(),
      }),
    };
    const resultat = navigateur.newPage().then((page) => {
      return page
        .setContent(contenuFinal.corps)
        .then(async () =>
          Buffer.from(
            await page.pdf(
              formatPdfA4({
                entete: contenuFinal.entete,
                piedDePage: contenuFinal.piedPage,
              })
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

const formatPdfA4 = (configuration: {
  entete: string;
  piedDePage: string;
}): PDFOptions => ({
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: configuration.entete,
  footerTemplate: configuration.piedDePage,
  margin: {
    bottom: '15mm',
    left: '15mm',
    right: '15mm',
    top: '15mm',
  },
});

const lanceNavigateur = (): Promise<Browser> => {
  const generationPDFExterne = generationPdfExterne();
  generationPDFExterne.verifieConfiguration();
  return puppeteer.connect({
    browserWSEndpoint: generationPDFExterne.endpointWebsocket(),
  });
};
