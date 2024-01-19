import { Aggregat } from '../../../src/domaine/Aggregat';
import {
  ActionBase,
  ActionReponseDiagnostic,
  Diagnostic,
  EntrepotDiagnostic,
  Reponse,
} from '../../../src/domaine/diagnostic/Diagnostic.ts';
import { Entrepot } from '../../../src/domaine/Entrepots';
import { unDiagnostic } from '../../constructeurs/constructeurDiagnostic.ts';
import { LienRoutage } from '../../../src/domaine/LienRoutage.ts';
import {
  Diagnostics,
  EntrepotDiagnostics,
} from '../../../src/domaine/diagnostic/Diagnostics.ts';
import { expect } from '@storybook/jest';
import { Restitution } from '../../../src/domaine/diagnostic/Restitution.ts';
import { RessourceActionRestituer } from 'mon-aide-cyber-api/src/api/representateurs/types.ts';

class EntrepotMemoire<T extends Aggregat> implements Entrepot<T> {
  protected entites: T[] = [];

  async lis(identifiant: string): Promise<T> {
    const entiteTrouvee = this.entites.find(
      (entite) => entite.identifiant === identifiant,
    );
    if (entiteTrouvee !== undefined) {
      return Promise.resolve(entiteTrouvee);
    }
    return Promise.reject({ message: `Entitée ${identifiant} non trouvée.` });
  }

  async persiste(entite: T) {
    this.entites.push(entite);
  }
}

export class EntrepotDiagnosticMemoire
  extends EntrepotMemoire<Diagnostic>
  implements EntrepotDiagnostic
{
  private actionRepondre: ActionReponseDiagnostic | undefined = undefined;
  private reponseDonnee: Reponse | undefined = undefined;
  private reponseEnvoyee = false;
  lancer(): Promise<LienRoutage> {
    const diagnostic = unDiagnostic().construis();
    return this.persiste(diagnostic).then(
      () => new LienRoutage(`/api/diagnostic/${diagnostic.identifiant}`),
    );
  }

  repond(
    action: ActionReponseDiagnostic,
    reponseDonnee: Reponse,
  ): Promise<void> {
    this.actionRepondre = action;
    this.reponseDonnee = reponseDonnee;
    this.reponseEnvoyee = true;
    return Promise.resolve();
  }

  verifieEnvoiReponse(
    actionRepondre: ActionReponseDiagnostic,
    reponseDonnee: Reponse,
  ) {
    expect(this.actionRepondre).toStrictEqual(actionRepondre);
    expect(this.reponseDonnee).toStrictEqual(reponseDonnee);
  }

  async verifieReponseNonEnvoyee() {
    return Promise.resolve(!this.reponseEnvoyee);
  }

  termine(__: ActionBase): Promise<void> {
    return Promise.reject();
  }

  restitution(__: string, ___: RessourceActionRestituer): Promise<Restitution> {
    return Promise.reject();
  }
}

export class EntrepotDiagnosticsMemoire
  extends EntrepotMemoire<Diagnostics>
  implements EntrepotDiagnostics
{
  tous(): Promise<Diagnostics> {
    return Promise.resolve(
      this.entites.flatMap((diagnostic) =>
        diagnostic.map((diag) => diag),
      ) as Diagnostics,
    );
  }
}
