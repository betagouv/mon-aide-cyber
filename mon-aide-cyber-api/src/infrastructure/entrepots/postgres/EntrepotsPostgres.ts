import { Entrepots } from '../../../domaine/Entrepots';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotDiagnosticPostgres } from './EntrepotDiagnosticPostgres';
import { EntrepotAidant } from '../../../authentification/Aidant';
import { EntrepotAidantMemoire } from '../memoire/EntrepotMemoire';
import crypto from 'crypto';

export class EntrepotsPostgres implements Entrepots {
  private readonly entrepotDiagnostic = new EntrepotDiagnosticPostgres();

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants(): EntrepotAidant {
    const entrepotAidantMemoire = new EntrepotAidantMemoire();

    entrepotAidantMemoire.persiste({
      identifiant: crypto.randomUUID(),
      identifiantConnexion: 'toto@beta.fr',
      motDePasse: 'mdp',
      nomPrenom: 'toto'
    })

    return entrepotAidantMemoire;
  }
}
