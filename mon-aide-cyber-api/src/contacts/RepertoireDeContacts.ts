import { Aidant } from '../espace-aidant/Aidant';
import { DemandeAide } from '../gestion-demandes/aide/DemandeAide';

export interface RepertoireDeContacts {
  creeAidant: (aidant: Aidant) => Promise<void>;
  creeAide(aide: DemandeAide): Promise<void>;
}
