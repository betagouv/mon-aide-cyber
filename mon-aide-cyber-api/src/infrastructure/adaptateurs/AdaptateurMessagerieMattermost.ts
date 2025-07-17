export interface Messagerie {
  envoieMessageMarkdown(message: string): Promise<void>;
}

export class AdaptateurMessagerieMattermost implements Messagerie {
  envoieMessageMarkdown(_message: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
