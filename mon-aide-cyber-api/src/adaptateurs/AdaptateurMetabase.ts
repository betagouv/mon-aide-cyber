export type ReponseMetabase = {
  dashboardRepartitionDiagnosticsParTerritoire: string;
};
export interface AdaptateurMetabase {
  statistiques(): Promise<ReponseMetabase>;
}
