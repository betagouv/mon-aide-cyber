import { Aggregat } from '../domaine/Aggregat';
import { EntrepotEcriture } from '../domaine/Entrepot';
import crypto from 'crypto';
import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { BusEvenement } from '../domaine/BusEvenement';

export type EntiteUtilisateurInscrit = {
  siret?: string;
};

export type UtilisateurInscrit = Aggregat & {
  email: string;
  nomPrenom: string;
  dateSignatureCGU?: Date;
  entite?: EntiteUtilisateurInscrit;
};

export type EntrepotUtilisateurInscrit = EntrepotEcriture<UtilisateurInscrit>;

export interface ServiceUtilisateurInscrit {
  valideLesCGU(identifiantUtilisateur: crypto.UUID): Promise<void>;

  valideProfil(
    identifiantUtilisateurInscrit: crypto.UUID,
    adaptateurDeRelations: AdaptateurRelations,
    busEvenement: BusEvenement
  ): Promise<void>;
}
