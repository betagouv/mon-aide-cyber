import { Aggregat } from '../../domaine/Aggregat';
import { Departement } from '../../gestion-demandes/departements';

export type StatistiquesAidant = {
  email: string;
  nomPrenom: string;
  compteCree?: Date;
  nombreDiagnostics?: number;
  entite: string;
  departements: Departement[];
} & Aggregat;

export interface EntrepotStatistiquesAidant {
  rechercheAidantSansDiagnostic(): Promise<StatistiquesAidant[]>;

  rechercheAidantAyantAuMoinsNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<StatistiquesAidant[]>;

  rechercheAidantAyantExactementNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<StatistiquesAidant[]>;

  rechercheAidantAvecNombreDeDiagnostics(): Promise<StatistiquesAidant[]>;
}
