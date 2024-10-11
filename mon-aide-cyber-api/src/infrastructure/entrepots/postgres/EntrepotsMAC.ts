import { Entrepots } from '../../../domaine/Entrepots';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotDiagnosticPostgres } from './EntrepotDiagnosticPostgres';
import { EntrepotAidant } from '../../../authentification/Aidant';
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
    throw new Error('Method not implemented.');
  }
}
