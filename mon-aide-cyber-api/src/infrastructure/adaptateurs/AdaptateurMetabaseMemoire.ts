import {
  AdaptateurMetabase,
  ReponseMetabase,
} from '../../adaptateurs/AdaptateurMetabase';

export class AdaptateurMetabaseMemoire implements AdaptateurMetabase {
  private reponse = '';

  appelle(): Promise<ReponseMetabase> {
    return Promise.resolve({ corps: this.reponse });
  }

  retourReponse(reponse: string) {
    this.reponse = reponse;
  }
}
