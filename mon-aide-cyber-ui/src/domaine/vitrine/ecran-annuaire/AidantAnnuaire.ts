import { UUID } from '../../../types/Types.ts';
import { Departement } from '../../gestion-demandes/departement.ts';

export type AidantAnnuaire = {
  identifiant: UUID;
  nomPrenom: string;
};
export type ReponseAnnuaire = {
  aidants?: AidantAnnuaire[];
  departements: Departement[];
  nombreAidants: number;
};
