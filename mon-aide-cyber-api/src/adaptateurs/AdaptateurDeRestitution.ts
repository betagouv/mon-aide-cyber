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

export abstract class AdaptateurDeRestitution {
  genereRestitution(diagnostic: Diagnostic): Promise<Buffer> {
    const pageDeGarde = this.genereIndicateurs(
      diagnostic.restitution?.indicateurs,
    );
    const recommandations = this.genereRecommandationsPrioritaires(
      diagnostic.restitution?.recommandations?.recommandationsPrioritaires,
    );

    const autresRecommandations =
      diagnostic.restitution?.recommandations?.autresRecommandations;

    if (estRecommandationPriorisee(autresRecommandations)) {
      return this.genere([
        pageDeGarde,
        recommandations,
        this.genereRecommandationsAnnexes(autresRecommandations),
      ]);
    }
    return this.genere([pageDeGarde, recommandations]);
  }

  protected abstract genereRecommandationsAnnexes(
    autresRecommandations: RecommandationPriorisee[],
  ): Promise<ContenuHtml>;

  protected abstract genereRecommandationsPrioritaires(
    recommandationsPrioritaires: RecommandationPriorisee[] | undefined,
  ): Promise<ContenuHtml>;

  protected abstract genere(
    htmlRecommandations: Promise<ContenuHtml>[],
  ): Promise<Buffer>;

  protected abstract genereIndicateurs(
    indicateurs: Indicateurs | undefined,
  ): Promise<ContenuHtml>;
}
