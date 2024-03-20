import { Indicateurs, ORDRE_THEMATIQUES, MesurePriorisee } from '../diagnostic/Diagnostic';
import { ContenuHtml } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import { Restitution } from '../restitution/Restitution';

const estMesurePrioritaire = (
  mesurePrioritaire: MesurePriorisee[] | undefined,
): mesurePrioritaire is MesurePriorisee[] => {
  return mesurePrioritaire !== undefined && mesurePrioritaire.length > 0;
};

export abstract class AdaptateurDeRestitution<T> {
  genereRestitution(restitution: Restitution): Promise<T> {
    const informations = this.genereInformations(restitution);
    const indicateursRestitution: Indicateurs = Object.entries(restitution.indicateurs)
      .sort(([thematiqueA], [thematiqueB]) =>
        ORDRE_THEMATIQUES.indexOf(thematiqueA) > ORDRE_THEMATIQUES.indexOf(thematiqueB) ? 1 : -1,
      )
      .reduce(
        (accumulateur, [thematique, indicateur]) => ({
          ...accumulateur,
          [thematique]: indicateur,
        }),
        {},
      );
    const indicateurs = this.genereIndicateurs(indicateursRestitution);
    const mesuresPrioritaires = this.genereMesuresPrioritaires(restitution.mesures.mesuresPrioritaires);
    const autresMesures = restitution.mesures.autresMesures;

    if (estMesurePrioritaire(autresMesures)) {
      return this.genere([informations, indicateurs, mesuresPrioritaires, this.genereAutresMesures(autresMesures)]);
    }
    return this.genere([informations, indicateurs, mesuresPrioritaires]);
  }

  protected abstract genereAutresMesures(autresMesures: MesurePriorisee[]): Promise<ContenuHtml>;

  protected abstract genereMesuresPrioritaires(
    mesuresPrioritaires: MesurePriorisee[] | undefined,
  ): Promise<ContenuHtml>;

  protected abstract genere(mesures: Promise<ContenuHtml>[]): Promise<T>;

  protected abstract genereIndicateurs(indicateurs: Indicateurs | undefined): Promise<ContenuHtml>;

  protected abstract genereInformations(restitution: Restitution): Promise<ContenuHtml>;
}
