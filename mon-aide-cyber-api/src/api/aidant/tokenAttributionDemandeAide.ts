import crypto from 'crypto';
import { DemandeAide } from '../../gestion-demandes/aide/DemandeAide';

type TokenAttributionDemandeAide = {
  demande: crypto.UUID;
  aidant: crypto.UUID;
};
export const tokenAttributionDemandeAide = (): {
  dechiffre: (token: string) => TokenAttributionDemandeAide;
  chiffre: (demandeAide: DemandeAide, identifiantAidant: crypto.UUID) => string;
} => ({
  chiffre(demandeAide: DemandeAide, identifiantAidant: crypto.UUID): string {
    return btoa(
      JSON.stringify({
        demande: demandeAide.identifiant,
        aidant: identifiantAidant,
      })
    );
  },
  dechiffre(token: string): TokenAttributionDemandeAide {
    return JSON.parse(atob(token));
  },
});
