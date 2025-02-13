import crypto from 'crypto';
import { EntrepotLecture } from '../../domaine/Entrepot';

export type ProfilAidant = {
  identifiant: crypto.UUID;
  nomPrenom: string;
  dateSignatureCGU?: Date;
  consentementAnnuaire: boolean;
  nomAffichageAnnuaire: string;
  email: string;
};

export type EntrepotProfilAidant = EntrepotLecture<ProfilAidant>;
