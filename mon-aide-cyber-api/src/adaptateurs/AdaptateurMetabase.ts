export type ReponseMetabase = {
  nombreDiagnostics: number;
  dashboardRepartitionDiagnosticsParTerritoire: string;
  nombreAidants: number;
  niveauDeSatisfactionDuDiagnostic: number;
};

export interface AdaptateurMetabase {
  statistiques(): Promise<ReponseMetabase>;
}
