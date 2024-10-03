import { AdaptateurMetabaseDeTest } from '../../../test/adaptateurs/AdaptateurMetabaseDeTest';
import { AdaptateurMetabase } from '../../adaptateurs/AdaptateurMetabase';
import { AdaptateurAPIMetabase } from '../../adaptateurs/AdaptateurAPIMetabase';

export const adaptateurMetabase = (): AdaptateurMetabase => {
  return process.env.METABASE_CLEF_SECRETE !== undefined
    ? new AdaptateurAPIMetabase(process.env.METABASE_CLEF_SECRETE)
    : new AdaptateurMetabaseDeTest();
};
