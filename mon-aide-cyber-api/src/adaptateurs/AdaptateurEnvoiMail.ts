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

export interface AdaptateurEnvoiMail {
  envoie(email: Email, expediteur?: Expediteur): Promise<void>;

  envoieConfirmationDemandeAide(
    email: string,
    raisonSociale: string | undefined,
    nomDepartement: string,
    relationUtilisateur: string | undefined
  ): any;
}

export type Expediteur = 'MONAIDECYBER' | 'INFO';
