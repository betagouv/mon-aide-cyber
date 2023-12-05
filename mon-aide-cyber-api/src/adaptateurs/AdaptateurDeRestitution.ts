import { Diagnostic, RecommandationPriorisee } from '../diagnostic/Diagnostic';
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
    const recommandations = this.genereRecommandations(
      diagnostic.restitution?.recommandations?.recommandationsPrioritaires,
    );

    const autresRecommandations =
      diagnostic.restitution?.recommandations?.autresRecommandations;

    if (estRecommandationPriorisee(autresRecommandations)) {
      return this.genere([
        recommandations,
        this.genereAnnexes(autresRecommandations),
      ]);
    }
    return this.genere([recommandations]);
  }

  protected abstract genereAnnexes(
    autresRecommandations: RecommandationPriorisee[],
  ): Promise<ContenuHtml>;

  protected abstract genereRecommandations(
    recommandationsPrioritaires: RecommandationPriorisee[] | undefined,
  ): Promise<ContenuHtml>;

  protected abstract genere(
    htmlRecommandations: Promise<ContenuHtml>[],
  ): Promise<Buffer>;
}
