import { EntrepotDiagnostic } from '../diagnostic/Diagnostic';
import { EntrepotRestitution } from '../restitution/Restitution';
import { EntrepotAide } from '../aide/Aide';

import { EntrepotDemandeDevenirAidant } from '../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { EntrepotStatistiques } from '../statistiques/statistiques';
import { EntrepotAnnuaireAidants } from '../annuaire-aidants/annuaireAidants';
import { EntrepotUtilisateur } from '../authentification/Utilisateur';
import { EntrepotAidant } from '../espace-aidant/Aidant';
import { EntrepotProfilAidant } from '../espace-aidant/profil/profilAidant';

export interface Entrepots {
  diagnostic(): EntrepotDiagnostic;

  aidants(): EntrepotAidant;

  restitution(): EntrepotRestitution;

  aides(): EntrepotAide;

  demandesDevenirAidant(): EntrepotDemandeDevenirAidant;

  statistiques(): EntrepotStatistiques;

  annuaireAidants(): EntrepotAnnuaireAidants;

  utilisateurs(): EntrepotUtilisateur;

  profilAidant(): EntrepotProfilAidant;
}
