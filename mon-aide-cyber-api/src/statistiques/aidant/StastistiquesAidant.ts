import { Aggregat } from '../../domaine/Aggregat';

export type Aidant = {
  email: string;
  nomPrenom: string;
  compteCree?: Date;
  nombreDiagnostics?: number;
} & Aggregat;

export interface EntrepotStatistiquesAidant {
  rechercheAidantSansDiagnostic(): Promise<Aidant[]>;

  rechercheAidantAyantAuMoinsNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<Aidant[]>;

  rechercheAidantAyantExactementNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<Aidant[]>;

  rechercheAidantAvecNombreDeDiagnostics(): Promise<Aidant[]>;
}
