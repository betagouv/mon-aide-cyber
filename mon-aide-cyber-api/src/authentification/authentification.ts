import { GestionnaireDeJeton } from './GestionnaireDeJeton';
import { ErreurMAC } from '../domaine/erreurMAC';
import {
  EntrepotUtilisateur,
  ErreurAuthentification,
  UtilisateurAuthentifie,
} from './Utilisateur';

export const authentifie = (
  entrepotUtilisateur: EntrepotUtilisateur,
  gestionnaireDeJeton: GestionnaireDeJeton,
  identifiant: string,
  motDePasse: string
): Promise<UtilisateurAuthentifie> => {
  // La date de signature des CGU est remontée pour fournir l’action créer espace aidant obsolète ou rediriger vers le TDB
  // Pas besoin de la signature
  return entrepotUtilisateur
    .rechercheParIdentifiantConnexionEtMotDePasse(identifiant, motDePasse)
    .then((utilisateur) => ({
      identifiant: utilisateur.identifiant,
      nomPrenom: utilisateur.nomPrenom,
      ...(utilisateur.dateSignatureCGU && {
        dateSignatureCGU: utilisateur.dateSignatureCGU,
      }),
      jeton: gestionnaireDeJeton.genereJeton({
        identifiant: utilisateur.identifiant,
      }),
    }))
    .catch((erreur) => {
      return Promise.reject(
        ErreurMAC.cree(
          "Demande d'Authentification",
          new ErreurAuthentification(erreur)
        )
      );
    });
};
