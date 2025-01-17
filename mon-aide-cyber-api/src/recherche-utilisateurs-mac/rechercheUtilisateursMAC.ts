import crypto from 'crypto';
import { Aggregat } from '../domaine/Aggregat';
import { Entrepot } from '../domaine/Entrepot';

export type UtilisateurMAC = Aggregat & {
  profil: 'Aidant' | 'UtilisateurInscrit' | 'Gendarme';
};

export type UtilisateurMACDTO = UtilisateurMAC;

export interface RechercheUtilisateursMAC {
  rechercheParIdentifiant(identifiant: crypto.UUID): Promise<UtilisateurMAC>;
}

export interface EntrepotUtilisateursMAC extends Entrepot<UtilisateurMAC> {
  rechercheParIdentifiant(identifiant: crypto.UUID): Promise<UtilisateurMAC>;
}

export const uneRechercheUtilisateursMAC = (
  entrepot: EntrepotUtilisateursMAC
): RechercheUtilisateursMAC => ({
  rechercheParIdentifiant(
    identifiant: crypto.UUID
  ): Promise<UtilisateurMACDTO> {
    return entrepot
      .rechercheParIdentifiant(identifiant)
      .then((utilisateur) => ({
        identifiant: utilisateur.identifiant,
        profil: utilisateur.profil,
      }));
  },
});
