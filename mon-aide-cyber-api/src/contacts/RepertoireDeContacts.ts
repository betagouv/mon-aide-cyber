export interface RepertoireDeContacts {
  creeAidant(email: string): Promise<void>;
  creeAide(email: string): Promise<void>;
  creeUtilisateurInscrit(email: string): Promise<void>;
  modifieEmail(ancienEmail: string, nouvelEmail: string): Promise<void>;
  emetsEvenement(evenement: Evenement): Promise<void>;
}

export type TypeEvenement = 'DIAGNOSTIC_DEMARRE' | 'RESTITUTION_ENVOYEE';

export type Evenement = {
  email: string;
  type: TypeEvenement;
};
