import { Aggregat, AggregatNonTrouve } from '../../../domaine/Aggregat';
import { Entrepot } from '../../../domaine/Entrepot';
import { Diagnostic, EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { cloneDeep } from 'lodash';
import crypto, { UUID } from 'crypto';

import {
  EntrepotEvenementJournal,
  Publication,
} from '../../../journalisation/Publication';
import { Aidant, EntrepotAidant } from '../../../authentification/Aidant';
import {
  EntrepotRestitution,
  Restitution,
} from '../../../restitution/Restitution';
import { Aide, EntrepotAide } from '../../../aide/Aide';
import {
  DemandeDevenirAidant,
  EntrepotDemandeDevenirAidant,
} from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';

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
  async rechercheParIdentifiantConnexionEtMotDePasse(
    identifiantConnexion: string,
    motDePasse: string
  ): Promise<Aidant> {
    const aidantTrouve = Array.from(this.entites.values()).find(
      (aidant) =>
        aidant.identifiantConnexion === identifiantConnexion &&
        aidant.motDePasse === motDePasse
    );
    if (!aidantTrouve) {
      throw new AggregatNonTrouve('aidant');
    }
    return Promise.resolve(aidantTrouve);
  }

  rechercheParIdentifiantDeConnexion(
    identifiantConnexion: string
  ): Promise<Aidant> {
    const aidantTrouve = Array.from(this.entites.values()).find(
      (aidant) => aidant.identifiantConnexion === identifiantConnexion
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
  rechercheParMail(mail: string): Promise<DemandeDevenirAidant | undefined> {
    return Promise.resolve(
      Array.from(this.entites.values()).find((demande) => demande.mail === mail)
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
