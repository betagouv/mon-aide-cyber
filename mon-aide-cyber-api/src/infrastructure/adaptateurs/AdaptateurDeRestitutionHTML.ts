import * as pug from 'pug';
import {
  AdaptateurDeRestitution,
  ContenuHtml,
  estMesurePrioritaire,
} from '../../adaptateurs/AdaptateurDeRestitution';
import { Restitution, trieLesIndicateurs } from '../../restitution/Restitution';
import { Indicateurs, MesurePriorisee } from '../../diagnostic/Diagnostic';
import { FournisseurHorloge } from '../horloge/FournisseurHorloge';

export type RestitutionHTML = {
  autresMesures: string;
  contactsEtLiensUtiles: string;
  ressources: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
};

export class AdaptateurDeRestitutionHTML extends AdaptateurDeRestitution<RestitutionHTML> {
  constructor(traductionThematiques: Map<string, string>) {
    super(traductionThematiques);
  }

  public genereRestitution(restitution: Restitution): Promise<RestitutionHTML> {
    return this.genereLaRestitution(restitution);
  }

  protected genereLaRestitution(
    restitution: Restitution
  ): Promise<RestitutionHTML> {
    const informations = this.genereInformations(restitution);
    const indicateursRestitution: Indicateurs = trieLesIndicateurs(restitution);
    const indicateurs = this.genereIndicateurs(indicateursRestitution);
    const mesuresPrioritaires = this.genereMesuresPrioritaires(
      restitution.mesures.mesuresPrioritaires
    );
    const autresMesures = restitution.mesures.autresMesures;

    const contactsLiensUtiles = this.genereContactsEtLiensUtiles();
    const ressources = this.genereRessources();

    if (estMesurePrioritaire(autresMesures)) {
      return this.genere([
        informations,
        indicateurs,
        mesuresPrioritaires,
        contactsLiensUtiles,
        ressources,
        this.genereAutresMesures(autresMesures),
      ]);
    }
    return this.genere([
      informations,
      indicateurs,
      mesuresPrioritaires,
      contactsLiensUtiles,
      ressources,
    ]);
  }

  protected genereIndicateurs(
    indicateurs: Indicateurs | undefined
  ): Promise<ContenuHtml> {
    return this.genereHtml('indicateurs', {
      indicateurs,
      traductions: this.traductionThematiques,
    });
  }

  protected async genereInformations(
    restitution: Restitution
  ): Promise<ContenuHtml> {
    return this.genereHtml('informations', {
      ...this.representeInformations(restitution),
    });
  }

  protected representeInformations(restitution: Restitution) {
    return {
      dateCreation: FournisseurHorloge.formateDate(
        restitution.informations.dateCreation
      ),
      dateDerniereModification: FournisseurHorloge.formateDate(
        restitution.informations.dateDerniereModification
      ),
      identifiant: restitution.identifiant,
      secteurActivite: restitution.informations.secteurActivite,
      secteurGeographique: restitution.informations.secteurGeographique,
    };
  }

  protected genereAutresMesures(
    autresMesures: MesurePriorisee[] | undefined
  ): Promise<ContenuHtml> {
    return this.genereHtml('autres-mesures', {
      mesures: autresMesures,
    });
  }

  protected genereMesuresPrioritaires(
    mesuresPrioritaires: MesurePriorisee[] | undefined
  ): Promise<ContenuHtml> {
    return this.genereHtml('mesures', {
      mesures: mesuresPrioritaires,
    });
  }

  protected genereContactsEtLiensUtiles(): Promise<ContenuHtml> {
    return this.genereHtml('contacts-liens-utiles', {});
  }

  protected genereRessources(): Promise<ContenuHtml> {
    return this.genereHtml('ressources', {});
  }

  protected async genere(
    mesures: Promise<ContenuHtml>[]
  ): Promise<RestitutionHTML> {
    const autresMesures = await mesures[5];
    return Promise.resolve({
      informations: (await mesures[0]).corps,
      indicateurs: (await mesures[1]).corps,
      mesuresPrioritaires: (await mesures[2]).corps,
      contactsEtLiensUtiles: (await mesures[3]).corps,
      ressources: (await mesures[4]).corps,
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
