import { CapteurSaga, Saga } from '../domaine/commande';
import crypto from 'crypto';
import { Entrepots } from '../domaine/Entrepots';
import { Adaptateur } from '../adaptateurs/Adaptateur';
import { Referentiel } from '../diagnostic/Referentiel';
import { ReferentielDeMesures } from '../diagnostic/ReferentielDeMesures';
import { initialiseDiagnostic } from '../diagnostic/Diagnostic';

export type SagaLanceAutoDiagnostic = Saga & {
  type: 'SagaLanceAutoDiagnostic';
};

export class CapteurSagaLanceAutoDiagnostic
  implements CapteurSaga<SagaLanceAutoDiagnostic, crypto.UUID>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly referentiel: Adaptateur<Referentiel>,
    private readonly referentielDeMesures: Adaptateur<ReferentielDeMesures>
  ) {}

  execute(_saga: SagaLanceAutoDiagnostic): Promise<crypto.UUID> {
    return Promise.all([
      this.referentiel.lis(),
      this.referentielDeMesures.lis(),
    ]).then(([ref, rem]) => {
      const diagnostic = initialiseDiagnostic(ref, rem);
      return this.entrepots
        .diagnostic()
        .persiste(diagnostic)
        .then(() => diagnostic.identifiant);
    });
  }
}
