import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import { DiagnosticLibreAccesLance } from './CapteurSagaLanceDiagnosticLibreAcces';
import crypto from 'crypto';
import { DefinitionTuple, Tuple, unTuple } from '../relation/Tuple';

export const demandeInitieDiagnosticLibreAcces = (
  adaptateurRelations: AdaptateurRelations
) =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown> = DiagnosticLibreAccesLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as DiagnosticLibreAccesLance;
      const tuple = unTupleEntiteInitieDiagnosticLibreAcces(
        diagnosticLance.corps.idDemande,
        diagnosticLance.corps.idDiagnostic
      );

      return adaptateurRelations.creeTuple(tuple);
    }
  })();

export const unTupleEntiteInitieDiagnosticLibreAcces = (
  identifiantDemande: crypto.UUID,
  identifiantDiagnostic: crypto.UUID
): Tuple =>
  unTuple<DefinitionEntiteInitieDiagnosticLibreAcces>(
    definitionEntiteInitieDiagnosticLibreAcces
  )
    .avecUtilisateur(identifiantDemande)
    .avecObjet(identifiantDiagnostic)
    .construis();

export type DefinitionEntiteInitieDiagnosticLibreAcces = DefinitionTuple & {
  relation: 'initiateur';
  typeObjet: 'auto-diagnostic';
  typeUtilisateur: 'entité';
};

export const definitionEntiteInitieDiagnosticLibreAcces: {
  definition: DefinitionEntiteInitieDiagnosticLibreAcces;
} = {
  definition: {
    relation: 'initiateur',
    typeObjet: 'auto-diagnostic',
    typeUtilisateur: 'entité',
  },
};
