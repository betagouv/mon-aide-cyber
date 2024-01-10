import {
  AdaptateurDeRestitution,
  estRecommandationPriorisee,
} from './AdaptateurDeRestitution';
import {
  Diagnostic,
  Indicateurs,
  RecommandationPriorisee,
} from '../diagnostic/Diagnostic';
import { ContenuHtml } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import * as pug from 'pug';

export type RestitutionHTML = {
  autresMesures: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
};

export class AdaptateurDeRestitutionHTML extends AdaptateurDeRestitution<RestitutionHTML> {
  constructor(private readonly traductionThematiques: Map<string, string>) {
    super();
  }

  genereRestitution(diagnostic: Diagnostic): Promise<RestitutionHTML> {
    const indicateurs = this.genereIndicateurs(
      diagnostic.restitution?.indicateurs,
    );
    const recommandations = this.genereMesuresPrioritaires(
      diagnostic.restitution?.recommandations?.recommandationsPrioritaires,
    );

    const autresRecommandations =
      diagnostic.restitution?.recommandations?.autresRecommandations;

    if (estRecommandationPriorisee(autresRecommandations)) {
      return this.genere([
        this.genereInformations(diagnostic),
        indicateurs,
        recommandations,
        this.genereAutresMesures(autresRecommandations),
      ]);
    }
    return this.genere([
      this.genereInformations(diagnostic),
      indicateurs,
      recommandations,
    ]);
  }

  protected async genereInformations(
    _: Diagnostic | undefined,
  ): Promise<ContenuHtml> {
    throw new Error('non implémenté');
  }

  protected async genere(
    htmlRecommandations: Promise<ContenuHtml>[],
  ): Promise<RestitutionHTML> {
    const autresMesures = await htmlRecommandations[3];
    return Promise.resolve({
      informations: (await htmlRecommandations[0]).corps,
      indicateurs: (await htmlRecommandations[1]).corps,
      mesuresPrioritaires: (await htmlRecommandations[2]).corps,
      autresMesures: autresMesures ? autresMesures.corps : '',
    });
  }

  protected genereIndicateurs(
    indicateurs: Indicateurs | undefined,
  ): Promise<ContenuHtml> {
    return this.genereHtml('indicateurs', {
      indicateurs,
      traductions: this.traductionThematiques,
    });
  }

  protected genereMesuresPrioritaires(
    mesuresPrioritaires: RecommandationPriorisee[] | undefined,
  ): Promise<ContenuHtml> {
    return this.genereHtml('mesures', {
      recommandations: mesuresPrioritaires,
    });
  }

  protected genereAutresMesures(
    autresMesures: RecommandationPriorisee[],
  ): Promise<ContenuHtml> {
    return this.genereHtml('autres-mesures', {
      recommandations: autresMesures,
    });
  }

  async genereHtml(pugCorps: string, paramsCorps: any): Promise<ContenuHtml> {
    const fonctionInclusionDynamique = (
      cheminTemplatePug: string,
      options = {},
    ) => {
      return pug.renderFile(
        `src/infrastructure/restitution/html/modeles/${cheminTemplatePug}`,
        options,
      );
    };

    return Promise.all([
      pug.compileFile(
        `src/infrastructure/restitution/html/modeles/${pugCorps}.pug`,
      )({
        ...paramsCorps,
        include: fonctionInclusionDynamique,
      }),
    ])
      .then(([corps]) => ({ entete: '', corps, piedPage: '' }))
      .catch((erreur) => {
        console.log('Erreur génération HTML', erreur);
        throw new Error(erreur);
      });
  }
}
