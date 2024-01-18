import { Indicateurs, RecommandationPriorisee } from '../diagnostic/Diagnostic';
import { ContenuHtml } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import { Restitution } from '../restitution/Restitution';

const estRecommandationPriorisee = (
  recommandationPriorisees: RecommandationPriorisee[] | undefined,
): recommandationPriorisees is RecommandationPriorisee[] => {
  return (
    recommandationPriorisees !== undefined &&
    recommandationPriorisees.length > 0
  );
};

export abstract class AdaptateurDeRestitution<T> {
  genereRestitution(restitution: Restitution): Promise<T> {
    const informations = this.genereInformations(restitution);
    const indicateurs = this.genereIndicateurs(restitution.indicateurs);
    const recommandations = this.genereMesuresPrioritaires(
      restitution.recommandations.recommandationsPrioritaires,
    );
    const autresRecommandations =
      restitution.recommandations.autresRecommandations;

    if (estRecommandationPriorisee(autresRecommandations)) {
      return this.genere([
        informations,
        indicateurs,
        recommandations,
        this.genereAutresMesures(autresRecommandations),
      ]);
    }
    return this.genere([informations, indicateurs, recommandations]);
  }

  protected abstract genereAutresMesures(
    autresRecommandations: RecommandationPriorisee[],
  ): Promise<ContenuHtml>;

  protected abstract genereMesuresPrioritaires(
    recommandationsPrioritaires: RecommandationPriorisee[] | undefined,
  ): Promise<ContenuHtml>;

  protected abstract genere(
    htmlRecommandations: Promise<ContenuHtml>[],
  ): Promise<T>;

  protected abstract genereIndicateurs(
    indicateurs: Indicateurs | undefined,
  ): Promise<ContenuHtml>;

  protected abstract genereInformations(
    restitution: Restitution,
  ): Promise<ContenuHtml>;
}
