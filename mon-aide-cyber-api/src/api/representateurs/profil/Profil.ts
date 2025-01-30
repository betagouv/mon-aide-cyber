import { ReponseHATEOAS } from '../../hateoas/hateoas';

export type Profil = ReponseHATEOAS & {
  nomPrenom: string;
  dateSignatureCGU: string;
  identifiantConnexion: string;
  consentementAnnuaire?: boolean;
};
