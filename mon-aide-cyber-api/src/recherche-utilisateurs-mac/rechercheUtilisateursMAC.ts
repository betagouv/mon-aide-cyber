import crypto from 'crypto';
import { Aggregat } from '../domaine/Aggregat';
import { Entrepot } from '../domaine/Entrepot';

export type ProfilUtilisateurMAC = 'Aidant' | 'UtilisateurInscrit' | 'Gendarme';

export type UtilisateurMAC = Aggregat & {
  profil: ProfilUtilisateurMAC;
};

export type UtilisateurMACDTO = UtilisateurMAC;

export interface RechercheUtilisateursMAC {
  rechercheParIdentifiant(
    identifiant: crypto.UUID
  ): Promise<UtilisateurMAC | undefined>;
}

export interface EntrepotUtilisateursMAC extends Entrepot<UtilisateurMAC> {
  rechercheParIdentifiant(identifiant: crypto.UUID): Promise<UtilisateurMAC>;
}

export const uneRechercheUtilisateursMAC = (
  entrepot: EntrepotUtilisateursMAC
): RechercheUtilisateursMAC => ({
  rechercheParIdentifiant(
    identifiant: crypto.UUID
  ): Promise<UtilisateurMACDTO | undefined> {
    return entrepot
      .rechercheParIdentifiant(identifiant)
      .then((utilisateur) => ({
        identifiant: utilisateur.identifiant,
        profil: utilisateur.profil,
      }))
      .catch((erreur) => {
        console.error(
          'Erreur lors de la recherche de l’utilisateur portant l’id %s. %s',
          identifiant,
          erreur.message
        );
        return undefined;
      });
  },
});
