export type ReponseMetabase = {
  nombreDiagnostics: number;
  dashboardRepartitionDiagnosticsParTerritoire: string;
  nombreAidants: number;
};

export interface AdaptateurMetabase {
  statistiques(): Promise<ReponseMetabase>;
}
