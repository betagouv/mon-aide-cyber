import { GestionnaireDeJeton } from './GestionnaireDeJeton';
import { ErreurMAC } from '../domaine/erreurMAC';
import {
  EntrepotUtilisateur,
  ErreurAuthentification,
  UtilisateurAuthentifie,
} from './Utilisateur';
import { ServiceDeChiffrement } from '../securite/ServiceDeChiffrement';

export const authentifie = async (
  entrepotUtilisateur: EntrepotUtilisateur,
  serviceDeChiffrement: ServiceDeChiffrement,
  gestionnaireDeJeton: GestionnaireDeJeton,
  identifiant: string,
  motDePasse: string
): Promise<UtilisateurAuthentifie> => {
  return entrepotUtilisateur
    .rechercheParIdentifiantDeConnexion(identifiant)
    .then(async (utilisateur) => {
      const motDePasseVerifie = await serviceDeChiffrement.compare(
        utilisateur.motDePasse,
        motDePasse
      );
      if (!motDePasseVerifie) {
        throw new Error('Identifiants incorrects');
      }
      return {
        identifiant: utilisateur.identifiant,
        nomPrenom: utilisateur.nomPrenom,
        ...(utilisateur.dateSignatureCGU && {
          dateSignatureCGU: utilisateur.dateSignatureCGU,
        }),
        jeton: gestionnaireDeJeton.genereJeton({
          identifiant: utilisateur.identifiant,
        }),
      };
    })
    .catch((erreur) => {
      return Promise.reject(
        ErreurMAC.cree(
          "Demande d'Authentification",
          new ErreurAuthentification(erreur)
        )
      );
    });
};
