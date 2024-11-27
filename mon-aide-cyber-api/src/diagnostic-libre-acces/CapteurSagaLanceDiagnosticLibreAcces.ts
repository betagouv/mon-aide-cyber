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

export type DemandeDiagnosticLibreAcces = Aggregat & {
  dateSignatureCGU: Date;
};

export type EntrepotDemandeDiagnosticLibreAcces =
  Entrepot<DemandeDiagnosticLibreAcces>;

type CommandeDemandeDiagnosticLibreAcces = Commande & {
  type: 'CommandeDemandeDiagnosticLibreAcces';
  dateSignatureCGU: Date;
};

export class CapteurCommandeDemandeDiagnosticLibreAcces
  implements CapteurCommande<CommandeDemandeDiagnosticLibreAcces, crypto.UUID>
{
  constructor(private readonly entrepots: Entrepots) {}

  execute(commande: CommandeDemandeDiagnosticLibreAcces): Promise<crypto.UUID> {
    const identifiant: crypto.UUID = adaptateurUUID.genereUUID();
    return this.entrepots
      .demandesDiagnosticLibreAcces()
      .persiste({
        identifiant,
        dateSignatureCGU: commande.dateSignatureCGU,
      })
      .then(() => identifiant);
  }
}

export type SagaLanceDiagnosticLibreAcces = Saga & {
  type: 'SagaLanceDiagnosticLibreAcces';
  dateSignatureCGU: Date;
};

export class CapteurSagaLanceDiagnosticLibreAcces
  implements CapteurSaga<SagaLanceDiagnosticLibreAcces, crypto.UUID>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    private readonly busEvenement: BusEvenement,
    private readonly referentiel: Adaptateur<Referentiel>,
    private readonly referentielDeMesures: Adaptateur<ReferentielDeMesures>
  ) {}

  execute(saga: SagaLanceDiagnosticLibreAcces): Promise<crypto.UUID> {
    return this.busCommande
      .publie<CommandeDemandeDiagnosticLibreAcces, crypto.UUID>({
        type: 'CommandeDemandeDiagnosticLibreAcces',
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
              .publie<DiagnosticLibreAccesLance>({
                type: 'DIAGNOSTIC_LIBRE_ACCES_LANCE',
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

export type DiagnosticLibreAccesLance = Evenement<{
  idDiagnostic: crypto.UUID;
  idDemande: crypto.UUID;
}> & { type: 'DIAGNOSTIC_LIBRE_ACCES_LANCE' };
