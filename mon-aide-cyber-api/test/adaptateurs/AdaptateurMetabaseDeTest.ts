import {
  AdaptateurMetabase,
  ReponseMetabase,
} from '../../src/adaptateurs/AdaptateurMetabase';

export class AdaptateurMetabaseDeTest implements AdaptateurMetabase {
  private reponse = '';

  appelle(): Promise<ReponseMetabase> {
    return Promise.resolve({ corps: this.reponse });
  }

  retourReponse(reponse: string) {
    this.reponse = reponse;
  }
}
