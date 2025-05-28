import {
  Indicateurs,
  MesurePriorisee,
  ORDRE_THEMATIQUES,
} from '../diagnostic/Diagnostic';
import { Restitution } from '../restitution/Restitution';

export const estMesurePrioritaire = (
  mesurePrioritaire: MesurePriorisee[] | undefined
): mesurePrioritaire is MesurePriorisee[] => {
  return mesurePrioritaire !== undefined && mesurePrioritaire.length > 0;
};

export type ContenuHtml = { corps: string; entete: string; piedPage: string };

export abstract class AdaptateurDeRestitution<T> {
  constructor(protected readonly traductionThematiques: Map<string, string>) {}

  public abstract genereRestitution(restitution: Restitution): Promise<T>;

  protected trieLesIndicateurs(restitution: Restitution) {
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
    return indicateursRestitution;
  }
}
