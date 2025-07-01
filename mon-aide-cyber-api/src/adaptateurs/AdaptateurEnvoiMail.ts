import { Departement } from '../gestion-demandes/departements';
import { AidantMisEnRelation } from '../gestion-demandes/aide/MiseEnRelationParCriteres';

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

export type ConfirmationDemandeAideAttribuee = {
  emailAidant: string;
  nomPrenomAidant: string;
  emailEntite: string;
  secteursActivite: string;
  typeEntite: string;
  departement: Departement;
};

export type InformationEntitePourMiseEnRelation = {
  departement: string;
  epci: string;
  typeEntite: string;
  secteursActivite: string;
};

export interface AdaptateurEnvoiMail {
  envoie(email: Email, expediteur?: Expediteur): Promise<void>;

  envoieConfirmationDemandeAide(
    email: string,
    utilisateurMACEnRelation: UtilisateurMACEnRelation | undefined
  ): Promise<void>;

  envoieConfirmationDemandeAideAttribuee(
    confirmation: ConfirmationDemandeAideAttribuee
  ): Promise<void>;

  envoiToutesLesMisesEnRelation(
    matchingAidants: AidantMisEnRelation[],
    informations: InformationEntitePourMiseEnRelation
  ): Promise<void>;

  envoieRestitutionEntiteAidee(
    pdfRestitution: Buffer,
    emailEntiteAidee: string
  ): Promise<void>;

  envoieActivationCompteAidantFaite(mail: string): Promise<void>;
}

export type Expediteur = 'MONAIDECYBER' | 'INFO';
