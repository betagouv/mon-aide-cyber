export interface RepertoireDeContacts {
  creeAidant(email: string): Promise<void>;
  creeAide(email: string): Promise<void>;
  creeUtilisateurInscrit(email: string): Promise<void>;
  emetsEvenement(evenement: Evenement): Promise<void>;
}

export type Evenement = {
  email: string;
  type: 'DIAGNOSTIC_DEMARRE';
};
