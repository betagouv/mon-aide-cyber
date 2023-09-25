import { ConstructeurDeTableau } from "./constructeur";
import {
  ObjetDeRecommandation,
  TableauDeRecommandations,
} from "../../src/diagnostic/TableauDeRecommandations";

class ConstructeurDeTableauDeRecommandations extends ConstructeurDeTableau<TableauDeRecommandations> {
  avecLesRecommandations(
    recommandations: { [identifiant: string]: ObjetDeRecommandation }[],
  ): ConstructeurDeTableauDeRecommandations {
    this.tableau.push(...recommandations);
    return this;
  }
}

export const unTableauDeRecommandations = () =>
  new ConstructeurDeTableauDeRecommandations();
