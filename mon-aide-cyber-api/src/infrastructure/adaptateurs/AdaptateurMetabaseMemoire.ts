import {
  AdaptateurMetabase,
  ReponseMetabase,
} from '../../adaptateurs/AdaptateurMetabase';

type ReponseDesiree = {
  repartitionDiagnostics: string;
  nombreAidants: number;
  nombreDiagnostics: number;
  niveauDeSatisfactionDuDiagnostic: number;
};

export class AdaptateurMetabaseMemoire implements AdaptateurMetabase {
  private reponse: ReponseDesiree = {
    repartitionDiagnostics: '',
    nombreAidants: 0,
    nombreDiagnostics: 0,
    niveauDeSatisfactionDuDiagnostic: 0,
  };

  statistiques(): Promise<ReponseMetabase> {
    return Promise.resolve({
      dashboardRepartitionDiagnosticsParTerritoire:
        this.reponse.repartitionDiagnostics,
      nombreAidants: this.reponse.nombreAidants,
      nombreDiagnostics: this.reponse.nombreDiagnostics,
      niveauDeSatisfactionDuDiagnostic:
        this.reponse.niveauDeSatisfactionDuDiagnostic,
    });
  }

  retourStatistiques(reponse: {
    repartitionDiagnostics: string;
    nombreAidants: number;
    nombreDiagnostics: number;
    niveauDeSatisfactionDuDiagnostic: number;
  }) {
    this.reponse = reponse;
  }
}
