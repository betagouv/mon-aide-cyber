import crypto from 'crypto';
import { Aidant } from '../../espace-aidant/Aidant';
import { DemandeAide } from '../../gestion-demandes/aide/DemandeAide';

type TonkenAttributionDemandeAide = {
  demande: crypto.UUID;
  aidant: crypto.UUID;
};
export const tokenAttributionDemandeAide = (): {
  dechiffre: (token: string) => TonkenAttributionDemandeAide;
  chiffre: (demandeAide: DemandeAide, aidant: Aidant) => string;
} => {
  return {
    chiffre(demandeAide: DemandeAide, aidant: Aidant): string {
      return btoa(
        JSON.stringify({
          demande: demandeAide.identifiant,
          aidant: aidant.identifiant,
        })
      );
    },
    dechiffre(token: string): TonkenAttributionDemandeAide {
      return JSON.parse(atob(token));
    },
  };
};
