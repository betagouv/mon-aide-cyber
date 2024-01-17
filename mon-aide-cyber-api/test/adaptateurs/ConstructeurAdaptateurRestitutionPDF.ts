import { ContenuHtml } from '../../src/infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import {
  Diagnostic,
  RecommandationPriorisee,
} from '../../src/diagnostic/Diagnostic';
import { AdaptateurDeRestitution } from '../../src/adaptateurs/AdaptateurDeRestitution';
import { Entrepots } from '../../src/domaine/Entrepots';

export const unAdaptateurRestitutionPDF = () =>
  ({
    genere: (__: Promise<ContenuHtml>[]) =>
      Promise.resolve(Buffer.from('genere')),
    genereAnnexes: (__: RecommandationPriorisee[]) =>
      Promise.resolve({} as unknown as ContenuHtml),
    genereRecommandations: (__: RecommandationPriorisee[] | undefined) =>
      Promise.resolve({} as unknown as ContenuHtml),
    genereRestitution: (__: Diagnostic, ___: Entrepots) =>
      Promise.resolve(Buffer.from('PDF généré')),
  }) as unknown as AdaptateurDeRestitution<Buffer>;
