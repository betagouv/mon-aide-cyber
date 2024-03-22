export type AdresseEmail = string;

export type Email = {
  objet: string;
  corps: string;
  destinataire: { nom?: string; email: AdresseEmail };
};

export interface AdaptateurEnvoiMail {
  envoie(email: Email): Promise<void>;
}
