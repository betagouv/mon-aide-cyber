import {
  AdaptateurMessagerieMattermost,
  Messagerie,
} from '../infrastructure/adaptateurs/AdaptateurMessagerieMattermost';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';
import { AdaptateurMessagerieMemoire } from '../infrastructure/adaptateurs/AdaptateurMessagerieMemoire';

export const adaptateurMessagerie = (): Messagerie =>
  adaptateurEnvironnement.mattermost().clefWebhook() !== ''
    ? new AdaptateurMessagerieMattermost()
    : new AdaptateurMessagerieMemoire();
