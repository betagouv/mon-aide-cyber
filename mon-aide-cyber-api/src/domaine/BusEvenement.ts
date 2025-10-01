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
  | 'RESTITUTION_DIAGNOSTIC_LIBRE_ACCES_TELECHARGEE'
  | 'REPONSE_AJOUTEE'
  | 'RESTITUTION_LANCEE'
  | 'AIDANT_CREE'
  | 'AIDANT_MIGRE_EN_UTILISATEUR_INSCRIT'
  | 'AIDE_CREE'
  | 'DEMANDE_DEVENIR_AIDANT_CREEE'
  | 'DEMANDE_DEVENIR_AIDANT_MODIFIEE'
  | 'DEMANDE_DEVENIR_AIDANT_ESPACE_AIDANT_CREE'
  | 'ACTIVATION_COMPTE_AIDANT_ECHOUEE'
  | 'DEMANDE_AIDE_POURVUE'
  | 'AFFECTATION_ANNULEE'
  | 'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE'
  | 'MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE'
  | 'PREFERENCES_AIDANT_MODIFIEES'
  | 'PROFIL_AIDANT_MODIFIE'
  | 'AIDE_VIA_SOLLICITATION_AIDANT_CREE'
  | 'REINITIALISATION_MOT_DE_PASSE_DEMANDEE'
  | 'REINITIALISATION_MOT_DE_PASSE_FAITE'
  | 'REINITIALISATION_MOT_DE_PASSE_ERRONEE'
  | 'REPONSE_TALLY_RECUE'
  | 'RESTITUTION_ENVOYEE'
  | 'UTILISATEUR_INSCRIT_CREE';
