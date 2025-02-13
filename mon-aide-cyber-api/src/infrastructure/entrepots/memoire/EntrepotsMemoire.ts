import { Entrepots } from '../../../domaine/Entrepots';

import {
  EntrepotAidantMemoire,
  EntrepotAideMemoire,
  EntrepotAnnuaireAidantsMemoire,
  EntrepotDemandeDiagnosticLibreAccesMemoire,
  EntrepotDemandeDevenirAidantMemoire,
  EntrepotDiagnosticMemoire,
  EntrepotProfilAidantMemoire,
  EntrepotRestitutionMemoire,
  EntrepotStatistiquesMemoire,
  EntrepotUtilisateurMemoire,
  EntrepotUtilisateurMACMemoire,
  EntrepotUtilisateurInscritMemoire,
  EntrepotDemandeAideLectureMemoire,
} from './EntrepotMemoire';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotRestitution } from '../../../restitution/Restitution';
import { EntrepotStatistiques } from '../../../statistiques/statistiques';
import { EntrepotAnnuaireAidants } from '../../../annuaire-aidants/annuaireAidants';
import { EntrepotUtilisateur } from '../../../authentification/Utilisateur';
import { EntrepotAidant } from '../../../espace-aidant/Aidant';
import { EntrepotProfilAidant } from '../../../espace-aidant/profil/profilAidant';
import { EntrepotDemandeDiagnosticLibreAcces } from '../../../diagnostic-libre-acces/CapteurSagaLanceDiagnosticLibreAcces';
import { EntrepotUtilisateursMAC } from '../../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { EntrepotUtilisateurInscrit } from '../../../espace-utilisateur-inscrit/UtilisateurInscrit';
import {
  EntrepotDemandeAide,
  EntrepotDemandeAideLecture,
} from '../../../gestion-demandes/aide/DemandeAide';

export class EntrepotsMemoire implements Entrepots {
  private entrepotDiagnostic: EntrepotDiagnostic =
    new EntrepotDiagnosticMemoire();
  private entrepotAidants: EntrepotAidant = new EntrepotAidantMemoire();
  private entrepotUtilisateursInscrits: EntrepotUtilisateurInscrit =
    new EntrepotUtilisateurInscritMemoire();
  private entrepotRestitution: EntrepotRestitution =
    new EntrepotRestitutionMemoire();
  private entrepotAides: EntrepotDemandeAide = new EntrepotAideMemoire();
  private entrepotDemandeDevenirAidant =
    new EntrepotDemandeDevenirAidantMemoire();
  private entrepotStatistiques: EntrepotStatistiques =
    new EntrepotStatistiquesMemoire();
  private entrepotAnnuaireAidants: EntrepotAnnuaireAidants =
    new EntrepotAnnuaireAidantsMemoire();
  private entrepotUtilisateurs: EntrepotUtilisateur =
    new EntrepotUtilisateurMemoire();
  private entrepotProfilAidant: EntrepotProfilAidant =
    new EntrepotProfilAidantMemoire(
      this.entrepotAidants,
      this.entrepotUtilisateurs
    );
  private entrepotDemandesDiagnosticLibreAcces: EntrepotDemandeDiagnosticLibreAcces =
    new EntrepotDemandeDiagnosticLibreAccesMemoire();
  private entrepotUtilisateursMAC: EntrepotUtilisateursMAC =
    new EntrepotUtilisateurMACMemoire({
      aidant: this.entrepotAidants,
      utilisateurInscrit: this.entrepotUtilisateursInscrits,
    });
  private entrepotDemandesAideLecture: EntrepotDemandeAideLecture =
    new EntrepotDemandeAideLectureMemoire();

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants() {
    return this.entrepotAidants;
  }

  restitution(): EntrepotRestitution {
    return this.entrepotRestitution;
  }

  demandesAides() {
    return this.entrepotAides;
  }

  demandesDevenirAidant() {
    return this.entrepotDemandeDevenirAidant;
  }

  statistiques() {
    return this.entrepotStatistiques;
  }

  annuaireAidants() {
    return this.entrepotAnnuaireAidants;
  }

  utilisateurs(): EntrepotUtilisateur {
    return this.entrepotUtilisateurs;
  }

  profilAidant(): EntrepotProfilAidant {
    return this.entrepotProfilAidant;
  }

  demandesDiagnosticLibreAcces() {
    return this.entrepotDemandesDiagnosticLibreAcces;
  }

  utilisateursMAC(): EntrepotUtilisateursMAC {
    return this.entrepotUtilisateursMAC;
  }

  utilisateursInscrits(): EntrepotUtilisateurInscrit {
    return this.entrepotUtilisateursInscrits;
  }

  demandesAideLecture(): EntrepotDemandeAideLecture {
    return this.entrepotDemandesAideLecture;
  }
}
