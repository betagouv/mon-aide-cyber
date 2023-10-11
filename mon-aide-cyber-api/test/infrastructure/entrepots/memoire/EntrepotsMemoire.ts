import { Aggregat, AggregatNonTrouve } from '../../../../src/domaine/Aggregat';
import { Entrepot } from '../../../../src/domaine/Entrepot';
import {
  Diagnostic,
  EntrepotDiagnostic,
} from '../../../../src/diagnostic/Diagnostic';
import { cloneDeep } from 'lodash';
import crypto from 'crypto';

class EntrepotMemoire<T extends Aggregat> implements Entrepot<T> {
  private entites: Map<crypto.UUID, T> = new Map();

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
}
