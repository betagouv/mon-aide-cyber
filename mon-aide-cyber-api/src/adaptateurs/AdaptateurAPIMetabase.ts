import { AdaptateurMetabase, ReponseMetabase } from './AdaptateurMetabase';
import jwt from 'jsonwebtoken';

export class AdaptateurAPIMetabase implements AdaptateurMetabase {
  constructor(private readonly clefSecrete: string) {}

  appelle(): Promise<ReponseMetabase> {
    const token = jwt.sign(
      {
        resource: { dashboard: 5 },
        params: {},
        exp: Math.round(Date.now() / 1000) + 10 * 60,
      },
      this.clefSecrete
    );
    return Promise.resolve({
      corps: `${process.env.METABASE_URL}/embed/dashboard/${token}#bordered=true&titled=true`,
    });
  }
}
