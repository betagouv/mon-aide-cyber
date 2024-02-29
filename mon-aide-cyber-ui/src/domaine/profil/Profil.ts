import { ReponseHATEOAS } from '../Lien.ts';

export type Profil = ReponseHATEOAS & {
  nomPrenom: string;
  dateSignatureCGU: string;
  identifiantConnexion: string;
};
