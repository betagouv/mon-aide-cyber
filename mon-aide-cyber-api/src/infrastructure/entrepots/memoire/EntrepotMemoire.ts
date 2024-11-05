import { Aggregat, AggregatNonTrouve } from '../../../domaine/Aggregat';
import { Entrepot } from '../../../domaine/Entrepot';
import { Diagnostic, EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { cloneDeep } from 'lodash';
import crypto, { UUID } from 'crypto';

import {
  EntrepotEvenementJournal,
  Publication,
} from '../../../journalisation/Publication';
import {
  EntrepotRestitution,
  Restitution,
} from '../../../restitution/Restitution';
import { Aide, EntrepotAide } from '../../../aide/Aide';
import {
  DemandeDevenirAidant,
  EntrepotDemandeDevenirAidant,
  StatutDemande,
} from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  EntrepotStatistiques,
  Statistiques,
} from '../../../statistiques/statistiques';
import {
  Aidant as AnnuaireAidant,
  EntrepotAnnuaireAidants,
} from '../../../annuaire-aidants/annuaireAidants';
import { CriteresDeRecherche } from '../../../annuaire-aidants/ServiceAnnuaireAidants';
import {
  EntrepotUtilisateur,
  Utilisateur,
} from '../../../authentification/Utilisateur';
import { Aidant, EntrepotAidant } from '../../../espace-aidant/Aidant';

export class EntrepotMemoire<T extends Aggregat> implements Entrepot<T> {
  protected entites: Map<crypto.UUID, T> = new Map();

  async lis(identifiant: string): Promise<T> {
    const entiteTrouvee = this.entites.get(identifiant as crypto.UUID);
    if (entiteTrouvee) {
      return Promise.resolve(cloneDeep(entiteTrouvee));
    }
    throw new AggregatNonTrouve(this.typeAggregat());
  }

  async persiste(entite: T) {
    const entiteClonee = cloneDeep(entite);
    this.entites.set(entite.identifiant, entiteClonee);
  }

  tous(): Promise<T[]> {
    return Promise.resolve(Array.from(this.entites.values()));
  }

  typeAggregat(): string {
    throw new Error('Non implémenté');
  }
}

export class EntrepotDiagnosticMemoire
  extends EntrepotMemoire<Diagnostic>
  implements EntrepotDiagnostic
{
  typeAggregat(): string {
    return 'diagnostic';
  }

  tousLesDiagnosticsAyantPourIdentifiant(
    identifiantDiagnosticsLie: UUID[]
  ): Promise<Diagnostic[]> {
    return Promise.resolve(
      identifiantDiagnosticsLie
        .map((id) => this.entites.get(id))
        .filter((d): d is Diagnostic => !!d)
    );
  }
}

export class EntrepotEvenementJournalMemoire
  extends EntrepotMemoire<Publication>
  implements EntrepotEvenementJournal {}

export class EntrepotRestitutionMemoire
  extends EntrepotMemoire<Restitution>
  implements EntrepotRestitution
{
  typeAggregat(): string {
    return 'restitution';
  }
}

export class EntrepotAidantMemoire
  extends EntrepotMemoire<Aidant>
  implements EntrepotAidant
{
  rechercheParIdentifiantDeConnexion(
    identifiantConnexion: string
  ): Promise<Aidant> {
    const aidantTrouve = Array.from(this.entites.values()).find(
      (aidant) => aidant.email === identifiantConnexion
    );
    if (!aidantTrouve) {
      return Promise.reject(new AggregatNonTrouve('aidant'));
    }
    return Promise.resolve(aidantTrouve);
  }

  typeAggregat(): string {
    return 'aidant';
  }
}

export class EntrepotAideMemoire
  extends EntrepotMemoire<Aide>
  implements EntrepotAide
{
  rechercheParEmail(email: string): Promise<Aide | undefined> {
    const aides = Array.from(this.entites.values()).filter(
      (aide) => aide.email === email
    );

    return aides.length > 0
      ? Promise.resolve(aides[0])
      : Promise.resolve(undefined);
  }
}

export class EntrepotDemandeDevenirAidantMemoire
  extends EntrepotMemoire<DemandeDevenirAidant>
  implements EntrepotDemandeDevenirAidant
{
  rechercheDemandeEnCoursParMail(
    mail: string
  ): Promise<DemandeDevenirAidant | undefined> {
    return Promise.resolve(
      Array.from(this.entites.values()).find(
        (demande) =>
          demande.mail === mail && demande.statut === StatutDemande.EN_COURS
      )
    );
  }

  demandeExiste(mail: string): Promise<boolean> {
    return Promise.resolve(
      Array.from(this.entites.values()).some(
        (demandeDevenirAidant) => demandeDevenirAidant.mail === mail
      )
    );
  }

  typeAggregat(): string {
    return 'DemandeDevenirAidant';
  }
}

export class EntrepotStatistiquesMemoire
  extends EntrepotMemoire<Statistiques>
  implements EntrepotStatistiques
{
  lis(): Promise<Statistiques> {
    const statistiques = Object.entries(Object.fromEntries(this.entites)).map(
      ([_, stats]) => stats
    )[0];
    return Promise.resolve({
      identifiant: crypto.randomUUID(),
      nombreDiagnostics: statistiques.nombreDiagnostics,
      nombreAidants: statistiques.nombreAidants,
    });
  }
}

export class EntrepotAnnuaireAidantsMemoire
  extends EntrepotMemoire<AnnuaireAidant>
  implements EntrepotAnnuaireAidants
{
  rechercheParCriteres(
    criteresDeRecherche?: CriteresDeRecherche
  ): Promise<AnnuaireAidant[]> {
    const tousLesAidants = Array.from(this.entites.values());

    if (criteresDeRecherche) {
      return Promise.resolve(
        tousLesAidants.filter((a) =>
          a.departements
            .map((a) => a.nom as string)
            .includes(criteresDeRecherche.departement)
        )
      );
    }
    return Promise.resolve(tousLesAidants);
  }
}

export class EntrepotUtilisateurMemoire
  extends EntrepotMemoire<Utilisateur>
  implements EntrepotUtilisateur
{
  async rechercheParIdentifiantConnexionEtMotDePasse(
    identifiantConnexion: string,
    motDePasse: string
  ): Promise<Utilisateur> {
    const utilisateurTrouve = Array.from(this.entites.values()).find(
      (utilisateur) =>
        utilisateur.identifiantConnexion === identifiantConnexion &&
        utilisateur.motDePasse === motDePasse
    );
    if (!utilisateurTrouve) {
      throw new AggregatNonTrouve('utilisateur');
    }
    return Promise.resolve(utilisateurTrouve);
  }

  typeAggregat(): string {
    return 'utilisateur';
  }
}
