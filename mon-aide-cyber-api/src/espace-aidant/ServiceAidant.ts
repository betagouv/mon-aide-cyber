import crypto from 'crypto';

export type AidantDTO = {
  identifiant: crypto.UUID;
  email: string;
  nomUsage: string;
};

export interface ServiceAidant {
  rechercheParMail(mailAidant: string): Promise<AidantDTO | undefined>;

  parIdentifiant(identifiant: crypto.UUID): Promise<AidantDTO | undefined>;
}
