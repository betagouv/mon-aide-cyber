import { ContenuHtml } from '../../src/infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import { Diagnostic, MesurePriorisee } from '../../src/diagnostic/Diagnostic';
import { AdaptateurDeRestitution } from '../../src/adaptateurs/AdaptateurDeRestitution';
import { Entrepots } from '../../src/domaine/Entrepots';

export const unAdaptateurRestitutionPDF = () =>
  ({
    genere: (__: Promise<ContenuHtml>[]) =>
      Promise.resolve(Buffer.from('genere')),
    genereAnnexes: (__: MesurePriorisee[]) =>
      Promise.resolve({} as unknown as ContenuHtml),
    genereMesures: (__: MesurePriorisee[] | undefined) =>
      Promise.resolve({} as unknown as ContenuHtml),
    genereRestitution: (__: Diagnostic, ___: Entrepots) =>
      Promise.resolve(Buffer.from('PDF généré')),
  }) as unknown as AdaptateurDeRestitution<Buffer>;
