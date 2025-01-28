import crypto from 'crypto';
import { Siret } from './Aidant';

export type AidantDTO = {
  identifiant: crypto.UUID;
  email: string;
  nomUsage: string;
  nomComplet: string;
  siret?: Siret;
  dateSignatureCGU?: Date;
};

export type InformationsProfil = {
  entite: {
    nom: string;
    siret: string;
    type: 'ServicePublic' | 'ServiceEtat' | 'Association';
  };
};

export interface ServiceAidant {
  rechercheParMail(mailAidant: string): Promise<AidantDTO | undefined>;

  parIdentifiant(identifiant: crypto.UUID): Promise<AidantDTO | undefined>;

  valideLesCGU(identifiantAidant: crypto.UUID): Promise<void>;

  valideProfilAidant(
    identifiantAidant: crypto.UUID,
    informationsProfil: InformationsProfil
  ): Promise<void>;
}
