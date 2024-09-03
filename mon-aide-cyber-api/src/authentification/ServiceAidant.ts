import crypto from 'crypto';

export type AidantDTO = {
  identifiant: crypto.UUID;
  identifiantConnexion: string;
};

export interface ServiceAidant {
  rechercheParMail(mailAidant: string): Promise<AidantDTO | undefined>;
}
