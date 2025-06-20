import {
  AdaptateurMetabase,
  ReponseMetabase,
} from '../../adaptateurs/AdaptateurMetabase';

export class AdaptateurMetabaseMemoire implements AdaptateurMetabase {
  private reponse = '';

  statistiques(): Promise<ReponseMetabase> {
    return Promise.resolve({
      dashboardRepartitionDiagnosticsParTerritoire: this.reponse,
    });
  }

  retourStatistiques(reponse: string) {
    this.reponse = reponse;
  }
}
