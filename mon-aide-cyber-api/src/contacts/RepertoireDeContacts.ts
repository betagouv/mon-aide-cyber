import { Aidant } from '../espace-aidant/Aidant';
import { DemandeAide } from '../gestion-demandes/aide/DemandeAide';
import { UtilisateurInscrit } from '../espace-utilisateur-inscrit/UtilisateurInscrit';

export interface RepertoireDeContacts {
  creeAidant: (aidant: Aidant) => Promise<void>;
  creeAide(aide: DemandeAide): Promise<void>;
  creeUtilisateurInscrit(utilisateur: UtilisateurInscrit): Promise<void>;
}
