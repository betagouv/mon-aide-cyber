import { EntrepotDiagnostic } from '../diagnostic/Diagnostic';
import { EntrepotRestitution } from '../restitution/Restitution';
import { EntrepotDemandeDevenirAidant } from '../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { EntrepotStatistiques } from '../statistiques/statistiques';
import { EntrepotAnnuaireAidants } from '../annuaire-aidants/annuaireAidants';
import { EntrepotUtilisateur } from '../authentification/Utilisateur';
import { EntrepotAidant } from '../espace-aidant/Aidant';
import { EntrepotProfilAidant } from '../espace-aidant/profil/profilAidant';
import { EntrepotDemandeDiagnosticLibreAcces } from '../diagnostic-libre-acces/CapteurSagaLanceDiagnosticLibreAcces';
import { EntrepotUtilisateursMAC } from '../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { EntrepotUtilisateurInscrit } from '../espace-utilisateur-inscrit/UtilisateurInscrit';
import {
  EntrepotDemandeAide,
  EntrepotDemandeAideLecture,
} from '../gestion-demandes/aide/DemandeAide';
import { EntrepotStatistiquesAidant } from '../statistiques/aidant/StastistiquesAidant';

export interface Entrepots {
  diagnostic(): EntrepotDiagnostic;

  aidants(): EntrepotAidant;

  restitution(): EntrepotRestitution;

  demandesAides(): EntrepotDemandeAide;

  demandesDevenirAidant(): EntrepotDemandeDevenirAidant;

  statistiques(): EntrepotStatistiques;

  annuaireAidants(): EntrepotAnnuaireAidants;

  utilisateurs(): EntrepotUtilisateur;

  profilAidant(): EntrepotProfilAidant;

  demandesDiagnosticLibreAcces(): EntrepotDemandeDiagnosticLibreAcces;

  utilisateursMAC(): EntrepotUtilisateursMAC;

  utilisateursInscrits(): EntrepotUtilisateurInscrit;

  demandesAideLecture(): EntrepotDemandeAideLecture;

  statistiquesAidant(): EntrepotStatistiquesAidant;
}
