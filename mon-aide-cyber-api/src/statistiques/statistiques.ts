import { AdaptateurMetabase } from '../adaptateurs/AdaptateurMetabase';

export type RepresentationStatistiques = {
  metabase: string;
};

export class ServiceStatistiques {
  constructor(private readonly metabase: AdaptateurMetabase) {}

  async statistiques(): Promise<RepresentationStatistiques> {
    return this.metabase.appelle().then((reponse) => ({
      metabase: reponse.corps,
    }));
  }
}
