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
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

export type DemandeAutoDiagnostic = Aggregat & {
  dateSignatureCGU: Date;
};

export type EntrepotDemandeAutoDiagnostic = Entrepot<DemandeAutoDiagnostic>;

type CommandeDemandeAutoDiagnostic = Commande & {
  type: 'CommandeDemandeAutoDiagnostic';
  dateSignatureCGU: Date;
};

export class CapteurCommandeDemandeAutoDiagnostic
  implements CapteurCommande<CommandeDemandeAutoDiagnostic, crypto.UUID>
{
  constructor(private readonly entrepots: Entrepots) {}

  execute(commande: CommandeDemandeAutoDiagnostic): Promise<crypto.UUID> {
    const identifiant: crypto.UUID = adaptateurUUID.genereUUID();
    return this.entrepots
      .demandesAutoDiagnostic()
      .persiste({
        identifiant,
        dateSignatureCGU: commande.dateSignatureCGU,
      })
      .then(() => identifiant);
  }
}

export type SagaLanceAutoDiagnostic = Saga & {
  type: 'SagaLanceAutoDiagnostic';
  dateSignatureCGU: Date;
};

export class CapteurSagaLanceAutoDiagnostic
  implements CapteurSaga<SagaLanceAutoDiagnostic, crypto.UUID>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    private readonly busEvenement: BusEvenement,
    private readonly referentiel: Adaptateur<Referentiel>,
    private readonly referentielDeMesures: Adaptateur<ReferentielDeMesures>
  ) {}

  execute(saga: SagaLanceAutoDiagnostic): Promise<crypto.UUID> {
    return this.busCommande
      .publie<CommandeDemandeAutoDiagnostic, crypto.UUID>({
        type: 'CommandeDemandeAutoDiagnostic',
        dateSignatureCGU: saga.dateSignatureCGU,
      })
      .then((identifiantDemande) => {
        return Promise.all([
          this.referentiel.lis(),
          this.referentielDeMesures.lis(),
        ])
          .then(([ref, rem]) => {
            const diagnostic = initialiseDiagnostic(ref, rem);
            return this.entrepots
              .diagnostic()
              .persiste(diagnostic)
              .then(() => diagnostic.identifiant);
          })
          .then((identifiantDiagnostic) => {
            return this.busEvenement
              .publie<AutoDiagnosticLance>({
                type: 'AUTO_DIAGNOSTIC_LANCE',
                date: FournisseurHorloge.maintenant(),
                corps: {
                  idDiagnostic: identifiantDiagnostic,
                  idDemande: identifiantDemande,
                },
                identifiant: adaptateurUUID.genereUUID(),
              })
              .then(() => identifiantDiagnostic);
          });
      });
  }
}

export type AutoDiagnosticLance = Evenement<{
  idDiagnostic: crypto.UUID;
  idDemande: crypto.UUID;
}> & { type: 'AUTO_DIAGNOSTIC_LANCE' };
