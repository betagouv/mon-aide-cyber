import { AdaptateurMetabase, ReponseMetabase } from './AdaptateurMetabase';
import jwt from 'jsonwebtoken';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';

type ReponseQuestionAPIMetabase = {
  data: {
    rows: string[][];
  };
};

export class AdaptateurAPIMetabase implements AdaptateurMetabase {
  constructor(private readonly clefSecrete: string) {}

  private readonly url: string = adaptateurEnvironnement.metabase().url;

  async recupereResultat(idQuestion: number): Promise<number> {
    const reponse = await fetch(`${this.url}/api/card/${idQuestion}/query`, {
      method: 'POST',
      headers: {
        'x-api-key': adaptateurEnvironnement.metabase().clefApi,
        accept: 'application/json',
        'content-type': 'application/json',
      },
    });

    const corpsReponse: ReponseQuestionAPIMetabase = await reponse.json();
    return Number(corpsReponse.data.rows[0][0]);
  }

  async statistiques(): Promise<ReponseMetabase> {
    const dashboardRepartitionDiagnosticsParTerritoire =
      this.genereLienDashboardRepartitionDesDiagnostics();

    const [nombreAidants, nombreDiagnostics, niveauDeSatisfactionDuDiagnostic] =
      await Promise.all(
        [
          adaptateurEnvironnement.metabase().identifiantQuestionNombreAidants,
          adaptateurEnvironnement.metabase()
            .identifiantQuestionNombreDiagnostics,
          adaptateurEnvironnement.metabase()
            .identifiantQuestionNiveauSatifactionDiagnostic,
        ].map((id) => this.recupereResultat(id))
      );

    return {
      dashboardRepartitionDiagnosticsParTerritoire,
      nombreAidants,
      nombreDiagnostics,
      niveauDeSatisfactionDuDiagnostic,
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
    return `${this.url}/embed/dashboard/${token}#bordered=true&titled=true`;
  }
}
