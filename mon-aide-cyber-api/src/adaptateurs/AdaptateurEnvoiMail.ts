export type AdresseEmail = string;

export type Email = {
  objet: string;
  corps: string;
  destinataire: { nom?: string; email: AdresseEmail };
  copie?: string;
  copieInvisible?: string;
};

export interface AdaptateurEnvoiMail {
  envoie(email: Email): Promise<void>;
}
