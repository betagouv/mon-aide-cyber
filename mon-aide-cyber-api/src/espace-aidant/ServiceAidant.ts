import crypto from 'crypto';
import { Siret } from './Aidant';

export type AidantDTO = {
  identifiant: crypto.UUID;
  email: string;
  nomUsage: string;
  siret?: Siret;
  dateSignatureCGU?: Date;
};

export interface ServiceAidant {
  rechercheParMail(mailAidant: string): Promise<AidantDTO | undefined>;

  parIdentifiant(identifiant: crypto.UUID): Promise<AidantDTO | undefined>;

  valideLesCGU(identifiantAidant: crypto.UUID): Promise<void>;
}
