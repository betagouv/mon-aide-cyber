import {
  Diagnostic,
  Indicateurs,
  RecommandationPriorisee,
} from '../diagnostic/Diagnostic';
import { ContenuHtml } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';

const estRecommandationPriorisee = (
  recommandationPriorisee: RecommandationPriorisee[] | undefined,
): recommandationPriorisee is RecommandationPriorisee[] => {
  return (
    recommandationPriorisee !== undefined && recommandationPriorisee.length > 0
  );
};

export abstract class AdaptateurDeRestitution<T> {
  genereRestitution(diagnostic: Diagnostic): Promise<T> {
    const indicateurs = this.genereIndicateurs(
      diagnostic.restitution?.indicateurs,
    );
    const recommandations = this.genereRecommandationsPrioritaires(
      diagnostic.restitution?.recommandations?.recommandationsPrioritaires,
    );

    const autresRecommandations =
      diagnostic.restitution?.recommandations?.autresRecommandations;

    if (estRecommandationPriorisee(autresRecommandations)) {
      return this.genere([
        indicateurs,
        recommandations,
        this.genereRecommandationsAnnexes(autresRecommandations),
      ]);
    }
    return this.genere([indicateurs, recommandations]);
  }

  protected abstract genereRecommandationsAnnexes(
    autresRecommandations: RecommandationPriorisee[],
  ): Promise<ContenuHtml>;

  protected abstract genereRecommandationsPrioritaires(
    recommandationsPrioritaires: RecommandationPriorisee[] | undefined,
  ): Promise<ContenuHtml>;

  protected abstract genere(
    htmlRecommandations: Promise<ContenuHtml>[],
  ): Promise<T>;

  protected abstract genereIndicateurs(
    indicateurs: Indicateurs | undefined,
  ): Promise<ContenuHtml>;
}
