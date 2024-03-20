import { GestionnaireDeJeton } from './GestionnaireDeJeton';
import { ErreurMAC } from '../domaine/erreurMAC';
import { AidantAuthentifie, EntrepotAidant, ErreurAuthentification } from './Aidant';

export const authentifie = (
  entrepotAidant: EntrepotAidant,
  gestionnaireDeJeton: GestionnaireDeJeton,
  identifiant: string,
  motDePasse: string,
): Promise<AidantAuthentifie> => {
  return entrepotAidant
    .rechercheParIdentifiantConnexionEtMotDePasse(identifiant, motDePasse)
    .then((aidant) => ({
      ...aidant,
      jeton: gestionnaireDeJeton.genereJeton({
        identifiant: aidant.identifiant,
      }),
    }))
    .catch((erreur) => {
      return Promise.reject(ErreurMAC.cree("Demande d'Authentification", new ErreurAuthentification(erreur)));
    });
};
