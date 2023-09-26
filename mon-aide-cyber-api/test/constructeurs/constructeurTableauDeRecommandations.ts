import { ConstructeurDeTableau } from "./constructeur";
import { TableauDeRecommandations } from "../../src/diagnostic/TableauDeRecommandations";

class ConstructeurDeTableauDeRecommandations extends ConstructeurDeTableau<TableauDeRecommandations> {
  avecLesRecommandations(
    recommandations: {
      [identifiant: string]: {
        niveau1: string;
        niveau2?: string;
        priorisation: number;
      };
    }[],
  ): ConstructeurDeTableauDeRecommandations {
    recommandations.forEach((rec) => {
      this.tableau.push(
        ...Object.entries(rec).map(([question, recommandation]) => ({
          [question]: {
            niveau1: {
              titre: recommandation.niveau1,
              pourquoi: "parce-que",
              comment: "comme ça",
            },
            ...(recommandation.niveau2 && {
              niveau2: {
                titre: recommandation.niveau2,
                pourquoi: "parce-que",
                comment: "comme ça",
              },
            }),
            priorisation: recommandation.priorisation,
          },
        })),
      );
    });
    return this;
  }
}

export const unTableauDeRecommandations = () =>
  new ConstructeurDeTableauDeRecommandations();
