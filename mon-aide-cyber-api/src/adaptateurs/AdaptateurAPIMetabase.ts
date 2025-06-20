import { AdaptateurMetabase, ReponseMetabase } from './AdaptateurMetabase';
import jwt from 'jsonwebtoken';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';

export class AdaptateurAPIMetabase implements AdaptateurMetabase {
  constructor(private readonly clefSecrete: string) {}

  async statistiques(): Promise<ReponseMetabase> {
    const dashboardRepartitionDiagnosticsParTerritoire =
      this.genereLienDashboardRepartitionDesDiagnostics();
    return {
      dashboardRepartitionDiagnosticsParTerritoire,
    };
  }

  private genereLienDashboardRepartitionDesDiagnostics() {
    const dashboard =
      adaptateurEnvironnement.metabase().repartitionDesDiagnosticsParTerritoire;
    const token = jwt.sign(
      {
        resource: { dashboard },
        params: {},
        exp: Math.round(Date.now() / 1000) + 10 * 60,
      },
      this.clefSecrete
    );
    return `${process.env.METABASE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;
  }
}
