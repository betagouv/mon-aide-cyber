import { Aggregat } from '../../domaine/Aggregat';

export type StatistiquesUtilisateurInscrit = Aggregat & {
  nomPrenom: string;
  email: string;
  nombreDiagnostics: number;
};

export interface EntrepotStatistiquesUtilisateurInscrit {
  rechercheUtilisateursInscritsAvecNombreDeDiagnostics(): Promise<
    StatistiquesUtilisateurInscrit[]
  >;
}
