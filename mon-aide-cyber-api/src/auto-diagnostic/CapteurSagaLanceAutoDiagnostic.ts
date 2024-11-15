import {
  BusCommande,
  CapteurCommande,
  CapteurSaga,
  Commande,
  Saga,
} from '../domaine/commande';
import crypto from 'crypto';
import { Entrepots } from '../domaine/Entrepots';
import { Adaptateur } from '../adaptateurs/Adaptateur';
import { Referentiel } from '../diagnostic/Referentiel';
import { ReferentielDeMesures } from '../diagnostic/ReferentielDeMesures';
import { initialiseDiagnostic } from '../diagnostic/Diagnostic';
import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';
import { adaptateurUUID } from '../infrastructure/adaptateurs/adaptateurUUID';

export type DemandeAutoDiagnostic = Aggregat & {
  dateSignatureCGU: Date;
};

export type EntrepotDemandeAutoDiagnostic = Entrepot<DemandeAutoDiagnostic>;

type CommandeDemandeAutoDiagnostic = Commande & {
  type: 'CommandeDemandeAutoDiagnostic';
  dateSignatureCGU: Date;
};

export class CapteurCommandeDemandeAutoDiagnostic
  implements CapteurCommande<CommandeDemandeAutoDiagnostic, void>
{
  constructor(private readonly entrepots: Entrepots) {}

  execute(commande: CommandeDemandeAutoDiagnostic): Promise<void> {
    return this.entrepots
      .demandesAutoDiagnostic()
      .persiste({
        identifiant: adaptateurUUID.genereUUID(),
        dateSignatureCGU: commande.dateSignatureCGU,
      });
  }
}

export type SagaLanceAutoDiagnostic = Saga & {
  type: 'SagaLanceAutoDiagnostic';
  dateSignatureCGU: Date;
  email: string;
};

export class CapteurSagaLanceAutoDiagnostic
  implements CapteurSaga<SagaLanceAutoDiagnostic, crypto.UUID>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    private readonly referentiel: Adaptateur<Referentiel>,
    private readonly referentielDeMesures: Adaptateur<ReferentielDeMesures>
  ) {}

  execute(saga: SagaLanceAutoDiagnostic): Promise<crypto.UUID> {
    this.busCommande.publie<CommandeDemandeAutoDiagnostic, void>({
      type: 'CommandeDemandeAutoDiagnostic',
      dateSignatureCGU: saga.dateSignatureCGU,
    });
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
