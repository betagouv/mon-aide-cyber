import {
  Indicateurs,
  MesurePriorisee,
  ORDRE_THEMATIQUES,
} from '../diagnostic/Diagnostic';
import { Restitution } from '../restitution/Restitution';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

export const estMesurePrioritaire = (
  mesurePrioritaire: MesurePriorisee[] | undefined
): mesurePrioritaire is MesurePriorisee[] => {
  return mesurePrioritaire !== undefined && mesurePrioritaire.length > 0;
};

export type ContenuHtml = { corps: string; entete: string; piedPage: string };

export abstract class AdaptateurDeRestitution<T> {
  constructor(private readonly traductionThematiques: Map<string, string>) {}

  genereRestitution(restitution: Restitution): Promise<T> {
    const informations = this.genereInformations(restitution);
    const indicateursRestitution: Indicateurs = Object.entries(
      restitution.indicateurs
    )
      .sort(([thematiqueA], [thematiqueB]) =>
        ORDRE_THEMATIQUES.indexOf(thematiqueA) >
        ORDRE_THEMATIQUES.indexOf(thematiqueB)
          ? 1
          : -1
      )
      .reduce(
        (accumulateur, [thematique, indicateur]) => ({
          ...accumulateur,
          [thematique]: indicateur,
        }),
        {}
      );
    const indicateurs = this.genereIndicateurs(indicateursRestitution);
    const mesuresPrioritaires = this.genereMesuresPrioritaires(
      restitution.mesures.mesuresPrioritaires
    );
    const autresMesures = restitution.mesures.autresMesures;

    if (estMesurePrioritaire(autresMesures)) {
      return this.genere([
        informations,
        indicateurs,
        mesuresPrioritaires,
        this.genereAutresMesures(autresMesures),
      ]);
    }
    return this.genere([informations, indicateurs, mesuresPrioritaires]);
  }

  protected abstract genere(mesures: Promise<ContenuHtml>[]): Promise<T>;

  protected genereIndicateurs(
    indicateurs: Indicateurs | undefined
  ): Promise<ContenuHtml> {
    return this.genereHtml('indicateurs', {
      indicateurs,
      traductions: this.traductionThematiques,
    });
  }

  abstract genereHtml(pugCorps: string, paramsCorps: any): Promise<ContenuHtml>;

  protected async genereInformations(
    restitution: Restitution
  ): Promise<ContenuHtml> {
    return this.genereHtml('informations', {
      ...this.representeInformations(restitution),
    });
  }

  private representeInformations(restitution: Restitution) {
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
}
