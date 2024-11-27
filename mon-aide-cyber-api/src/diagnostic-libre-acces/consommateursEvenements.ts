import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import { DiagnosticLibreAccesLance } from './CapteurSagaLanceDiagnosticLibreAcces';
import crypto from 'crypto';
import { DefinitionTuple, Tuple, unTuple } from '../relation/Tuple';

export const demandeInitieAutoDiagnostic = (
  adaptateurRelations: AdaptateurRelations
) =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown> = DiagnosticLibreAccesLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as DiagnosticLibreAccesLance;
      const tuple = unTupleEntiteInitieAutoDiagnostic(
        diagnosticLance.corps.idDemande,
        diagnosticLance.corps.idDiagnostic
      );

      return adaptateurRelations.creeTuple(tuple);
    }
  })();

export const unTupleEntiteInitieAutoDiagnostic = (
  identifiantDemande: crypto.UUID,
  identifiantDiagnostic: crypto.UUID
): Tuple =>
  unTuple<DefinitionEntiteInitieAutoDiagnostic>(
    definitionEntiteInitieAutoDiagnostic
  )
    .avecUtilisateur(identifiantDemande)
    .avecObjet(identifiantDiagnostic)
    .construis();

export type DefinitionEntiteInitieAutoDiagnostic = DefinitionTuple & {
  relation: 'initiateur';
  typeObjet: 'auto-diagnostic';
  typeUtilisateur: 'entité';
};

export const definitionEntiteInitieAutoDiagnostic: {
  definition: DefinitionEntiteInitieAutoDiagnostic;
} = {
  definition: {
    relation: 'initiateur',
    typeObjet: 'auto-diagnostic',
    typeUtilisateur: 'entité',
  },
};
