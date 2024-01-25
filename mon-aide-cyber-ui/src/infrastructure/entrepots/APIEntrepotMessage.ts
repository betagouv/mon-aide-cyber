type Message = {
  nom: string;
  email: string;
  message: string;
};
export interface EntrepotMessage {
  envoie(message: Message): Promise<void>;
}
export class APIEntrepotMessage implements EntrepotMessage {
  envoie(message: Message): Promise<void> {
    console.log(message);
    return Promise.resolve();
  }
}
