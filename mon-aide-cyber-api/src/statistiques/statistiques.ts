import { AdaptateurMetabase } from '../adaptateurs/AdaptateurMetabase';

export type RepresentationStatistiques = {
  metabase: string;
  nombreAidants: number;
  nombreDiagnostics: number;
};

export class ServiceStatistiques {
  constructor(private readonly metabase: AdaptateurMetabase) {}

  async statistiques(): Promise<RepresentationStatistiques> {
    return this.metabase.statistiques().then((reponse) => ({
      metabase: reponse.dashboardRepartitionDiagnosticsParTerritoire,
      nombreAidants: reponse.nombreAidants,
      nombreDiagnostics: reponse.nombreDiagnostics,
    }));
  }
}
