import { Entrepots } from '../../../domaine/Entrepots';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotDiagnosticPostgres } from './EntrepotDiagnosticPostgres';
import { EntrepotAidantPostgres } from './EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../adaptateurs/adaptateurServiceChiffrement';
import { EntrepotRestitution } from '../../../restitution/Restitution';
import { EntrepotRestitutionPostgres } from './EntrepotRestitutionPostgres';
import { EntrepotAideConcret } from './EntrepotAideConcret';
import { EntrepotDemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { EntrepotDemandeDevenirAidantPostgres } from './EntrepotDemandeDevenirAidantPostgres';
import { EntrepotAnnuaireAidants } from '../../../annuaire-aidants/annuaireAidants';
import { EntrepotAnnuaireAidantsPostgres } from './EntrepotAnnuaireAidantsPostgres';
import { EntrepotUtilisateur } from '../../../authentification/Utilisateur';
import { EntrepotUtilisateurPostgres } from './EntrepotUtilisateurPostgres';
import { EntrepotAidant } from '../../../espace-aidant/Aidant';
import { EntrepotProfilAidant } from '../../../espace-aidant/profil/profilAidant';
import { EntrepotProfilAidantPostgres } from './EntrepotProfilAidantPostgres';
import { EntrepotDemandeDiagnosticLibreAcces } from '../../../diagnostic-libre-acces/CapteurSagaLanceDiagnosticLibreAcces';
import { EntrepotDemandeDiagnosticLibreAccesPostgres } from './EntrepotDemandeDiagnosticLibreAccesPostgres';
import { EntrepotUtilisateursMAC } from '../../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { EntrepotUtilisateurMACPostgres } from './EntrepotUtilisateurMACPostgres';
import { EntrepotUtilisateurInscrit } from '../../../espace-utilisateur-inscrit/UtilisateurInscrit';
import { EntrepotUtilisateurInscritPostgres } from './EntrepotUtilisateurInscritPostgres';
import {
  EntrepotDemandeAide,
  EntrepotDemandeAideLecture,
} from '../../../gestion-demandes/aide/DemandeAide';
import { EntrepotDemandeAideLecturePostgres } from './EntrepotDemandeAideLecturePostgres';
import { EntrepotStatistiquesAidant } from '../../../statistiques/aidant/StastistiquesAidant';
import { EntrepotStatistiquesAidantPostgres } from './EntrepotStatistiquesAidantPostgres';
import { EntrepotStatistiquesUtilisateurInscrit } from '../../../statistiques/utilisateur-inscrit/StatistiquesUtilisateurInscrit';
import { EntrepotStatistiquesUtilisateursInscritsPostgres } from './EntrepotStatistiquesUtilisateursInscritsPostgres';
import { adaptateurRepertoireDeContacts } from '../../../adaptateurs/adaptateurRepertoireDeContacts';

export class EntrepotsMAC implements Entrepots {
  private readonly entrepotDiagnostic = new EntrepotDiagnosticPostgres();
  private readonly entrepotAidant: EntrepotAidant = new EntrepotAidantPostgres(
    adaptateurServiceChiffrement()
  );
  private entrepotUtilisateursInscrits: EntrepotUtilisateurInscrit =
    new EntrepotUtilisateurInscritPostgres(adaptateurServiceChiffrement());
  private entrepotRestitution: EntrepotRestitution =
    new EntrepotRestitutionPostgres();
  private readonly entrepotAide: EntrepotDemandeAide = new EntrepotAideConcret(
    adaptateurServiceChiffrement(),
    adaptateurRepertoireDeContacts()
  );
  private entrepotDemandeDevenirAidant: EntrepotDemandeDevenirAidant =
    new EntrepotDemandeDevenirAidantPostgres(adaptateurServiceChiffrement());
  private entrepotAnnuaireAidants: EntrepotAnnuaireAidants =
    new EntrepotAnnuaireAidantsPostgres(adaptateurServiceChiffrement());
  private entrepotUtilisateurs: EntrepotUtilisateur =
    new EntrepotUtilisateurPostgres(adaptateurServiceChiffrement());
  private entrepotProfilAidant: EntrepotProfilAidant =
    new EntrepotProfilAidantPostgres(adaptateurServiceChiffrement());
  private entrepotDemandeDiagnosticLibreAcces: EntrepotDemandeDiagnosticLibreAcces =
    new EntrepotDemandeDiagnosticLibreAccesPostgres();
  private entrepotUtilisateursMAC: EntrepotUtilisateursMAC =
    new EntrepotUtilisateurMACPostgres(adaptateurServiceChiffrement());
  private entrepotDemandeAideLecture: EntrepotDemandeAideLecture =
    new EntrepotDemandeAideLecturePostgres();
  private entrepotStatistiquesAidant: EntrepotStatistiquesAidant =
    new EntrepotStatistiquesAidantPostgres(adaptateurServiceChiffrement());
  private entrepotStatistiquesUtilisateurInscrit: EntrepotStatistiquesUtilisateurInscrit =
    new EntrepotStatistiquesUtilisateursInscritsPostgres(
      adaptateurServiceChiffrement()
    );
  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants(): EntrepotAidant {
    return this.entrepotAidant;
  }

  restitution(): EntrepotRestitution {
    return this.entrepotRestitution;
  }

  demandesAides(): EntrepotDemandeAide {
    return this.entrepotAide;
  }

  demandesDevenirAidant(): EntrepotDemandeDevenirAidant {
    return this.entrepotDemandeDevenirAidant;
  }

  annuaireAidants(): EntrepotAnnuaireAidants {
    return this.entrepotAnnuaireAidants;
  }

  utilisateurs(): EntrepotUtilisateur {
    return this.entrepotUtilisateurs;
  }

  profilAidant(): EntrepotProfilAidant {
    return this.entrepotProfilAidant;
  }

  demandesDiagnosticLibreAcces(): EntrepotDemandeDiagnosticLibreAcces {
    return this.entrepotDemandeDiagnosticLibreAcces;
  }

  utilisateursMAC(): EntrepotUtilisateursMAC {
    return this.entrepotUtilisateursMAC;
  }

  utilisateursInscrits(): EntrepotUtilisateurInscrit {
    return this.entrepotUtilisateursInscrits;
  }

  demandesAideLecture(): EntrepotDemandeAideLecture {
    return this.entrepotDemandeAideLecture;
  }

  statistiquesAidant(): EntrepotStatistiquesAidant {
    return this.entrepotStatistiquesAidant;
  }

  statistiquesUtilisateurInscrit(): EntrepotStatistiquesUtilisateurInscrit {
    return this.entrepotStatistiquesUtilisateurInscrit;
  }
}
