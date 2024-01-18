import { AdaptateurDeRestitution } from './AdaptateurDeRestitution';
import { Indicateurs, RecommandationPriorisee } from '../diagnostic/Diagnostic';
import { ContenuHtml } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import * as pug from 'pug';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { Restitution } from '../restitution/Restitution';

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

  protected async genereInformations(
    restitution: Restitution,
  ): Promise<ContenuHtml> {
    return this.genereHtml('informations', {
      ...this.representeInformations(restitution),
    });
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
  private representeInformations(restitution: Restitution) {
    return {
      dateCreation: FournisseurHorloge.formateDate(
        restitution.informations.dateCreation,
      ),
      dateDerniereModification: FournisseurHorloge.formateDate(
        restitution.informations.dateDerniereModification,
      ),
      identifiant: restitution.identifiant,
      secteurActivite: restitution.informations.secteurActivite,
      zoneGeographique: restitution.informations.zoneGeographique,
    };
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
