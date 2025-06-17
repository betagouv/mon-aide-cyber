import crypto from 'crypto';

export type Corps<T> = T;

export type Evenement<T> = {
  identifiant: crypto.UUID;
  type: TypeEvenement;
  date: Date;
  corps: Corps<T>;
};

export interface BusEvenement {
  publie<E extends Evenement<unknown>>(evenement: E): Promise<void>;
}

export interface ConsommateurEvenement {
  consomme<E extends Evenement<unknown>>(evenement: E): Promise<void>;
}

export type TypeEvenement =
  | 'DIAGNOSTIC_LIBRE_ACCES_LANCE'
  | 'DIAGNOSTIC_LANCE'
  | 'REPONSE_AJOUTEE'
  | 'RESTITUTION_LANCEE'
  | 'AIDANT_CREE'
  | 'AIDANT_MIGRE_EN_UTILISATEUR_INSCRIT'
  | 'AIDE_CREE'
  | 'DEMANDE_DEVENIR_AIDANT_CREEE'
  | 'DEMANDE_DEVENIR_AIDANT_MODIFIEE'
  | 'DEMANDE_DEVENIR_AIDANT_ESPACE_AIDANT_CREE'
  | 'DEMANDE_AIDE_POURVUE'
  | 'MAIL_CREATION_COMPTE_AIDANT_ENVOYE'
  | 'MAIL_CREATION_COMPTE_AIDANT_NON_ENVOYE'
  | 'PREFERENCES_AIDANT_MODIFIEES'
  | 'PROFIL_AIDANT_MODIFIE'
  | 'AIDE_VIA_SOLLICITATION_AIDANT_CREE'
  | 'REINITIALISATION_MOT_DE_PASSE_DEMANDEE'
  | 'REINITIALISATION_MOT_DE_PASSE_FAITE'
  | 'REINITIALISATION_MOT_DE_PASSE_ERRONEE'
  | 'RESTITUTION_ENVOYEE'
  | 'UTILISATEUR_INSCRIT_CREE';
