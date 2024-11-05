import crypto from 'crypto';

interface EntrepotLecture<T> {
  lis(identifiant: string): Promise<T>;
}

export type ProfilAidant = {
  identifiant: crypto.UUID;
  nomPrenom: string;
  dateSignatureCGU?: Date;
  consentementAnnuaire: boolean;
  email: string;
};

export type EntrepotProfilAidant = EntrepotLecture<ProfilAidant>;
