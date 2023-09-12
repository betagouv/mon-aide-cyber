import { ConstructeurDeTableau } from "./constructeur";
import {
  Recommandation,
  TableauDeRecommandations,
} from "../../src/diagnostic/TableauDeRecommandations";

class ConstructeurDeTableauDeRecommandations extends ConstructeurDeTableau<TableauDeRecommandations> {
  avecLesRecommandations(
    recommandations: { [identifiant: string]: Recommandation }[],
  ): ConstructeurDeTableauDeRecommandations {
    this.tableau.push(...recommandations);
    return this;
  }
}

export const unTableauDeRecommandations = () =>
  new ConstructeurDeTableauDeRecommandations();
