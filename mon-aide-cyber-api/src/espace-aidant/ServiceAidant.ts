import crypto from 'crypto';
import { Siret } from './Aidant';
import { AdaptateurEnvoiMail } from '../adaptateurs/AdaptateurEnvoiMail';

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
    nom?: string;
    siret?: string;
    type: 'ServicePublic' | 'ServiceEtat' | 'Association';
  };
};

export interface ServiceAidant {
  rechercheParMail(mailAidant: string): Promise<AidantDTO | undefined>;

  parIdentifiant(identifiant: crypto.UUID): Promise<AidantDTO | undefined>;

  valideLesConditionsMAC(
    identifiantAidant: crypto.UUID,
    pixelDeSuiviAutorise: boolean
  ): Promise<void>;

  valideProfilAidant(
    identifiantAidant: crypto.UUID,
    informationsProfil: InformationsProfil,
    adaptateurEnvoiMail: AdaptateurEnvoiMail
  ): Promise<void>;
}
