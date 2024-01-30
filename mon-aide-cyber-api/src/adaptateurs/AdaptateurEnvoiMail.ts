export type Message = {
  email: string;
  nom: string;
  message: string;
};
export type Email = string;

export interface AdaptateurEnvoiMail {
  envoie(message: Message, destination: Email): Promise<void>;
}
