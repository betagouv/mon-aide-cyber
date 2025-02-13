import { EntrepotEcriture } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';
import { AdaptateurMetabase } from '../adaptateurs/AdaptateurMetabase';

export type Statistiques = Aggregat & {
  nombreDiagnostics: number;
  nombreAidants: number;
};

export type RepresentationStatistiques = Omit<Statistiques, 'identifiant'> & {
  metabase: string;
};

export type EntrepotStatistiques = Omit<
  EntrepotEcriture<Statistiques>,
  'lis' | 'typeAggregat' | 'persiste' | 'tous'
> & {
  lis: () => Promise<Statistiques>;
};

export class ServiceStatistiques {
  constructor(
    private readonly entrepot: EntrepotStatistiques,
    private readonly metabase: AdaptateurMetabase
  ) {}

  statistiques(): Promise<RepresentationStatistiques> {
    return this.entrepot.lis().then((statistiques) => {
      return this.metabase.appelle().then((reponse) => ({
        nombreDiagnostics: 500 + statistiques.nombreDiagnostics,
        nombreAidants: statistiques.nombreAidants,
        metabase: reponse.corps,
      }));
    });
  }
}
