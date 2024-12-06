import { ReponseHATEOAS } from '../../Lien.ts';
import { Departement } from '../departement.ts';
import { UUID } from '../../../types/Types.ts';

export type CorpsDemandeEtreAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  relationAidant: boolean;
};

export type CorpsDemandeSolliciterAidant = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  aidantSollicite: UUID;
};

export type ReponseDemandeEtreAide = ReponseHATEOAS & {
  departements: Departement[];
};
