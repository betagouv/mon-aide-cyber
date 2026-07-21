export interface RepertoireDeContacts {
  creeAidant(email: string, pixelDeSuiviAutorise: boolean): Promise<void>;
  creeAide(email: string): Promise<void>;
  creeUtilisateurInscrit(
    email: string,
    pixelDeSuiviAutorise: boolean
  ): Promise<void>;
  modifieEmail(ancienEmail: string, nouvelEmail: string): Promise<void>;
  emetsEvenement(evenement: Evenement): Promise<void>;
}

export type TypeEvenement = 'DIAGNOSTIC_DEMARRE' | 'RESTITUTION_ENVOYEE';

export type Evenement = {
  email: string;
  type: TypeEvenement;
};
