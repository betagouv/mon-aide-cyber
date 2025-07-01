import { MesurePriorisee } from '../diagnostic/Diagnostic';
import { Restitution } from '../restitution/Restitution';

export const estMesurePrioritaire = (
  mesurePrioritaire: MesurePriorisee[] | undefined
): mesurePrioritaire is MesurePriorisee[] => {
  return mesurePrioritaire !== undefined && mesurePrioritaire.length > 0;
};

export type ContenuHtml = {
  corps: string;
  entete: string;
  piedPage: string;
};

export interface AdaptateurDeRestitution<T> {
  genereRestitution(restitution: Restitution): Promise<T>;

  genereAnnexe(restitution: Restitution): Promise<T>;
}
