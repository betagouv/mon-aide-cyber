import { AdaptateurDeRestitution } from './AdaptateurDeRestitution';
import { Indicateurs, RecommandationPriorisee } from '../diagnostic/Diagnostic';
import { ContenuHtml } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';

export type RestitutionHTML = {
  autresMesures: string;
  indicateurs: string;
  mesuresPrioritaires: string;
};

export class AdaptateurDeRestitutionHTML extends AdaptateurDeRestitution<RestitutionHTML> {
  protected genereRecommandationsAnnexes(
    _: RecommandationPriorisee[],
  ): Promise<ContenuHtml> {
    throw new Error('Method not implemented.');
  }

  protected genereRecommandationsPrioritaires(
    _: RecommandationPriorisee[] | undefined,
  ): Promise<ContenuHtml> {
    return Promise.resolve({} as ContenuHtml);
  }

  protected async genere(
    htmlRecommandations: Promise<ContenuHtml>[],
  ): Promise<RestitutionHTML> {
    const autresMesures = await htmlRecommandations[2];
    return Promise.resolve({
      autresMesures: autresMesures ? autresMesures.corps : '',
      indicateurs: (await htmlRecommandations[0]).corps,
      mesuresPrioritaires: (await htmlRecommandations[1]).corps,
    });
  }

  protected genereIndicateurs(
    _: Indicateurs | undefined,
  ): Promise<ContenuHtml> {
    return Promise.resolve({} as ContenuHtml);
  }
}
