type Message = {
  nom: string;
  email: string;
  message: string;
};
export interface EntrepotContact {
  envoie(message: Message): Promise<void>;
}
export class APIEntrepotContact implements EntrepotContact {
  envoie(message: Message): Promise<void> {
    console.log(message);
    return Promise.resolve();
  }
}
