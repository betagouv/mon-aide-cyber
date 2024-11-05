import { Entrepots } from '../../../domaine/Entrepots';

import {
  EntrepotAidantMemoire,
  EntrepotAideMemoire,
  EntrepotAnnuaireAidantsMemoire,
  EntrepotDemandeDevenirAidantMemoire,
  EntrepotDiagnosticMemoire,
  EntrepotProfilAidantMemoire,
  EntrepotRestitutionMemoire,
  EntrepotStatistiquesMemoire,
  EntrepotUtilisateurMemoire,
} from './EntrepotMemoire';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotRestitution } from '../../../restitution/Restitution';
import { EntrepotAide } from '../../../aide/Aide';
import { EntrepotStatistiques } from '../../../statistiques/statistiques';
import { EntrepotAnnuaireAidants } from '../../../annuaire-aidants/annuaireAidants';
import { EntrepotUtilisateur } from '../../../authentification/Utilisateur';
import { EntrepotAidant } from '../../../espace-aidant/Aidant';
import { EntrepotProfilAidant } from '../../../espace-aidant/profil/profilAidant';

export class EntrepotsMemoire implements Entrepots {
  private entrepotDiagnostic: EntrepotDiagnostic =
    new EntrepotDiagnosticMemoire();
  private entrepotAidants: EntrepotAidant = new EntrepotAidantMemoire();
  private entrepotRestitution: EntrepotRestitution =
    new EntrepotRestitutionMemoire();
  private entrepotAides: EntrepotAide = new EntrepotAideMemoire();
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
  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants() {
    return this.entrepotAidants;
  }

  restitution(): EntrepotRestitution {
    return this.entrepotRestitution;
  }

  aides() {
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
}
