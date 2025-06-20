export type ReponseMetabase = {
  dashboardRepartitionDiagnosticsParTerritoire: string;
  nombreAidants: number;
};

export interface AdaptateurMetabase {
  statistiques(): Promise<ReponseMetabase>;
}
