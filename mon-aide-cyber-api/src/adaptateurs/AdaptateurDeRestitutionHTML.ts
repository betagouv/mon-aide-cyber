import { AdaptateurDeRestitution } from './AdaptateurDeRestitution';
import {
  Diagnostic,
  Indicateurs,
  RecommandationPriorisee,
} from '../diagnostic/Diagnostic';
import { ContenuHtml } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import * as pug from 'pug';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

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
    diagnostic: Diagnostic,
  ): Promise<ContenuHtml> {
    return this.genereHtml('informations', {
      ...this.representeInformations(diagnostic),
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

  private trouveLibelleReponseUniqueDonnee(
    diagnostic: Diagnostic,
    thematique: string,
    identifiantQuestion: string,
  ) {
    const questionDiagnostic = diagnostic.referentiel[
      thematique
    ].questions.find(
      (question) => question.identifiant === identifiantQuestion,
    );

    return questionDiagnostic?.reponsesPossibles.find(
      (reponse) =>
        reponse.identifiant === questionDiagnostic.reponseDonnee.reponseUnique,
    )?.libelle;
  }

  private representeZoneGeographique(diagnostic: Diagnostic) {
    const region = this.trouveLibelleReponseUniqueDonnee(
      diagnostic,
      'contexte',
      'contexte-region-siege-social',
    );
    const departement = this.trouveLibelleReponseUniqueDonnee(
      diagnostic,
      'contexte',
      'contexte-departement-tom-siege-social',
    );
    return ''
      .concat(!departement && !region ? 'non renseigné' : '')
      .concat(departement || '')
      .concat(departement && region ? ', '.concat(region || '') : region || '');
  }

  representeInformations(diagnostic: Diagnostic) {
    const secteurActivite =
      this.trouveLibelleReponseUniqueDonnee(
        diagnostic,
        'contexte',
        'contexte-secteur-activite',
      ) || 'non renseigné';

    return {
      dateCreation: FournisseurHorloge.formateDate(diagnostic.dateCreation),
      dateDerniereModification: FournisseurHorloge.formateDate(
        diagnostic.dateDerniereModification,
      ),
      identifiant: diagnostic.identifiant,
      secteurActivite,
      zoneGeographique: this.representeZoneGeographique(diagnostic),
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
