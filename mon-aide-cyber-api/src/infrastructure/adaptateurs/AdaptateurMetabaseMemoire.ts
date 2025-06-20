import {
  AdaptateurMetabase,
  ReponseMetabase,
} from '../../adaptateurs/AdaptateurMetabase';

type ReponseDesiree = {
  repartitionDiagnostics: string;
  nombreAidants: number;
  nombreDiagnostics: number;
};

export class AdaptateurMetabaseMemoire implements AdaptateurMetabase {
  private reponse: ReponseDesiree = {
    repartitionDiagnostics: '',
    nombreAidants: 0,
    nombreDiagnostics: 0,
  };

  statistiques(): Promise<ReponseMetabase> {
    return Promise.resolve({
      dashboardRepartitionDiagnosticsParTerritoire:
        this.reponse.repartitionDiagnostics,
      nombreAidants: this.reponse.nombreAidants,
      nombreDiagnostics: this.reponse.nombreDiagnostics,
    });
  }

  retourStatistiques(reponse: {
    repartitionDiagnostics: string;
    nombreAidants: number;
    nombreDiagnostics: number;
  }) {
    this.reponse = reponse;
  }
}
