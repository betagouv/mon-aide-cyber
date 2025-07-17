import { Messagerie } from './AdaptateurMessagerieMattermost';

export class AdaptateurMessagerieMemoire implements Messagerie {
  async envoieMessageMarkdown(message: string): Promise<void> {
    console.log(message);
  }
}
