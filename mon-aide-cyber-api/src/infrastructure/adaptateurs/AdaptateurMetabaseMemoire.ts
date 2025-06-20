import {
  AdaptateurMetabase,
  ReponseMetabase,
} from '../../adaptateurs/AdaptateurMetabase';

type ReponseDesiree = {
  repartitionDiagnostics: string;
  nombreAidants: number;
};

export class AdaptateurMetabaseMemoire implements AdaptateurMetabase {
  private reponse: ReponseDesiree = {
    repartitionDiagnostics: '',
    nombreAidants: 0,
  };

  statistiques(): Promise<ReponseMetabase> {
    return Promise.resolve({
      dashboardRepartitionDiagnosticsParTerritoire:
        this.reponse.repartitionDiagnostics,
      nombreAidants: this.reponse.nombreAidants,
    });
  }

  retourStatistiques(reponse: ReponseDesiree) {
    this.reponse = reponse;
  }
}
