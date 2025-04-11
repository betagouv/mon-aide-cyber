export type AdresseEmail = string;

export type Destinataire = { nom?: string; email: AdresseEmail };

export type Email = {
  objet: string;
  corps: string;
  destinataire: Destinataire | Destinataire[];
  copie?: string;
  copieInvisible?: string;
  pieceJointe?: PieceJointe;
};
export type PieceJointe = { contenu: string; nom: string };
export type UtilisateurMACEnRelation = { nomPrenom: string; email: string };

export interface AdaptateurEnvoiMail {
  envoie(email: Email, expediteur?: Expediteur): Promise<void>;

  envoieConfirmationDemandeAide(
    email: string,
    utilisateurMACEnRelation: UtilisateurMACEnRelation | undefined
  ): Promise<void>;
}

export type Expediteur = 'MONAIDECYBER' | 'INFO';
