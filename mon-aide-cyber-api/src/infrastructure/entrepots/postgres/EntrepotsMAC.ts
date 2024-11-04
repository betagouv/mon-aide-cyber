import { Entrepots } from '../../../domaine/Entrepots';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotDiagnosticPostgres } from './EntrepotDiagnosticPostgres';
import { EntrepotAidantPostgres } from './EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../adaptateurs/adaptateurServiceChiffrement';
import { EntrepotRestitution } from '../../../restitution/Restitution';
import { EntrepotRestitutionPostgres } from './EntrepotRestitutionPostgres';
import { EntrepotAide } from '../../../aide/Aide';
import { EntrepotAideConcret } from './EntrepotAideConcret';
import { EntrepotDemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { EntrepotDemandeDevenirAidantPostgres } from './EntrepotDemandeDevenirAidantPostgres';
import { EntrepotStatistiques } from '../../../statistiques/statistiques';
import { EntrepotStatistiquesPostgres } from './EntrepotStatistiquesPostgres';
import { EntrepotAnnuaireAidants } from '../../../annuaire-aidants/annuaireAidants';
import { EntrepotAnnuaireAidantsPostgres } from './EntrepotAnnuaireAidantsPostgres';
import { EntrepotUtilisateur } from '../../../authentification/Utilisateur';
import { EntrepotUtilisateurPostgres } from './EntrepotUtilisateurPostgres';
import { EntrepotAidant } from '../../../espace-aidant/Aidant';

export class EntrepotsMAC implements Entrepots {
  private readonly entrepotDiagnostic = new EntrepotDiagnosticPostgres();
  private readonly entrepotAidant: EntrepotAidant = new EntrepotAidantPostgres(
    adaptateurServiceChiffrement()
  );
  private entrepotRestitution: EntrepotRestitution =
    new EntrepotRestitutionPostgres();
  private readonly entrepotAide: EntrepotAide = new EntrepotAideConcret(
    adaptateurServiceChiffrement()
  );
  private entrepotDemandeDevenirAidant: EntrepotDemandeDevenirAidant =
    new EntrepotDemandeDevenirAidantPostgres(adaptateurServiceChiffrement());
  private entrepotStatistiques: EntrepotStatistiques =
    new EntrepotStatistiquesPostgres();
  private entrepotAnnuaireAidants: EntrepotAnnuaireAidants =
    new EntrepotAnnuaireAidantsPostgres(adaptateurServiceChiffrement());
  private entrepotUtilisateurs: EntrepotUtilisateur =
    new EntrepotUtilisateurPostgres(adaptateurServiceChiffrement());

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants(): EntrepotAidant {
    return this.entrepotAidant;
  }

  restitution(): EntrepotRestitution {
    return this.entrepotRestitution;
  }

  aides(): EntrepotAide {
    return this.entrepotAide;
  }

  demandesDevenirAidant(): EntrepotDemandeDevenirAidant {
    return this.entrepotDemandeDevenirAidant;
  }

  statistiques(): EntrepotStatistiques {
    return this.entrepotStatistiques;
  }

  annuaireAidants(): EntrepotAnnuaireAidants {
    return this.entrepotAnnuaireAidants;
  }

  utilisateurs(): EntrepotUtilisateur {
    return this.entrepotUtilisateurs;
  }
}
