import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

export interface Messagerie {
  envoieMessageMarkdown(message: string): Promise<void>;
}

export class AdaptateurMessagerieMattermost implements Messagerie {
  async envoieMessageMarkdown(message: string): Promise<void> {
    const urlWebhook = adaptateurEnvironnement
      .messagerie()
      .mattermost()
      .webhookActivationCompteAidant();
    await fetch(urlWebhook, {
      method: 'POST',
      body: JSON.stringify({
        text: message,
      }),
    });
  }
}
