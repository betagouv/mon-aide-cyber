export interface RepertoireDeContacts {
  creeAidant(email: string): Promise<void>;
  creeAide(email: string): Promise<void>;
  creeUtilisateurInscrit(email: string): Promise<void>;
}
