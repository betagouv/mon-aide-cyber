import { Entrepots } from '../../../domaine/Entrepots';

import {
  EntrepotAidantMemoire,
  EntrepotAideMemoire,
  EntrepotAnnuaireAidantsMemoire,
  EntrepotDemandeAideLectureMemoire,
  EntrepotDemandeDevenirAidantMemoire,
  EntrepotDemandeDiagnosticLibreAccesMemoire,
  EntrepotDiagnosticMemoire,
  EntrepotProfilAidantMemoire,
  EntrepotRestitutionMemoire,
  EntrepotStatistiquesAidantMemoire,
  EntrepotStatistiquesUtilisateursInscritsMemoire,
  EntrepotUtilisateurInscritMemoire,
  EntrepotUtilisateurMACMemoire,
  EntrepotUtilisateurMemoire,
} from './EntrepotMemoire';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotRestitution } from '../../../restitution/Restitution';
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
import { EntrepotStatistiquesAidant } from '../../../statistiques/aidant/StastistiquesAidant';
import { EntrepotRelationMemoire } from '../../../relation/infrastructure/EntrepotRelationMemoire';
import { EntrepotStatistiquesUtilisateurInscrit } from '../../../statistiques/utilisateur-inscrit/StatistiquesUtilisateurInscrit';

export class EntrepotsMemoire implements Entrepots {
  private entrepotDiagnostic: EntrepotDiagnostic =
    new EntrepotDiagnosticMemoire();
  private entrepotUtilisateursInscrits: EntrepotUtilisateurInscrit =
    new EntrepotUtilisateurInscritMemoire();
  private entrepotRestitution: EntrepotRestitution =
    new EntrepotRestitutionMemoire();
  private entrepotAides: EntrepotDemandeAide = new EntrepotAideMemoire();
  private entrepotAidants: EntrepotAidant = new EntrepotAidantMemoire(
    this.entrepotAides as EntrepotAideMemoire,
    new EntrepotRelationMemoire()
  );
  private entrepotDemandeDevenirAidant =
    new EntrepotDemandeDevenirAidantMemoire();
  private entrepotAnnuaireAidants: EntrepotAnnuaireAidants =
    new EntrepotAnnuaireAidantsMemoire(this.entrepotAidants);
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
  private entrepotStatistiquesAidant: EntrepotStatistiquesAidant =
    new EntrepotStatistiquesAidantMemoire(new EntrepotRelationMemoire());
  private entrepotStatistiquesUtilisateurInscrit: EntrepotStatistiquesUtilisateurInscrit =
    new EntrepotStatistiquesUtilisateursInscritsMemoire(
      new EntrepotRelationMemoire()
    );

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

  statistiquesAidant(): EntrepotStatistiquesAidant {
    return this.entrepotStatistiquesAidant;
  }

  statistiquesUtilisateurInscrit(): EntrepotStatistiquesUtilisateurInscrit {
    return this.entrepotStatistiquesUtilisateurInscrit;
  }
}
