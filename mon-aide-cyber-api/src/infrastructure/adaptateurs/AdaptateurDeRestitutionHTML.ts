import * as pug from 'pug';
import {
  AdaptateurDeRestitution,
  ContenuHtml,
} from '../../adaptateurs/AdaptateurDeRestitution';

export type RestitutionHTML = {
  autresMesures: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
};

export class AdaptateurDeRestitutionHTML extends AdaptateurDeRestitution<RestitutionHTML> {
  constructor(traductionThematiques: Map<string, string>) {
    super(traductionThematiques);
  }

  protected async genere(
    mesures: Promise<ContenuHtml>[]
  ): Promise<RestitutionHTML> {
    const autresMesures = await mesures[5];
    return Promise.resolve({
      informations: (await mesures[0]).corps,
      indicateurs: (await mesures[1]).corps,
      mesuresPrioritaires: (await mesures[2]).corps,
      autresMesures: autresMesures ? autresMesures.corps : '',
    });
  }

  async genereHtml(pugCorps: string, paramsCorps: any): Promise<ContenuHtml> {
    const fonctionInclusionDynamique = (
      cheminTemplatePug: string,
      options = {}
    ) => {
      return pug.renderFile(
        `src/infrastructure/restitution/html/modeles/${cheminTemplatePug}`,
        options
      );
    };
    return Promise.all([
      pug.compileFile(
        `src/infrastructure/restitution/html/modeles/${pugCorps}.pug`
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
