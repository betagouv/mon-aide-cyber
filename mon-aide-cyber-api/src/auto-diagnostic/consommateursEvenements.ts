import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import { AutoDiagnosticLance } from './CapteurSagaLanceAutoDiagnostic';
import crypto from 'crypto';
import { DefinitionTuple, Tuple, unTuple } from '../relation/Tuple';

export const demandeInitieAutoDiagnostic = (
  adaptateurRelations: AdaptateurRelations
) =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown> = AutoDiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as AutoDiagnosticLance;
      const tuple = unTupleEntiteInitieAutoDiagnostic(
        diagnosticLance.corps.idDemande,
        diagnosticLance.corps.idDiagnostic
      );

      return adaptateurRelations.creeTuple(tuple);
    }
  })();

const unTupleEntiteInitieAutoDiagnostic = (
  identifiantDemande: crypto.UUID,
  identifiantDiagnostic: crypto.UUID
): Tuple =>
  unTuple<DefinitionEntiteInitieAutoDiagnostic>(
    definitionEntiteInitieAutoDiagnostic
  )
    .avecUtilisateur(identifiantDemande)
    .avecObjet(identifiantDiagnostic)
    .construis();

type DefinitionEntiteInitieAutoDiagnostic = DefinitionTuple & {
  relation: 'initiateur';
  typeObjet: 'auto-diagnostic';
  typeUtilisateur: 'entité';
};

const definitionEntiteInitieAutoDiagnostic: {
  definition: DefinitionEntiteInitieAutoDiagnostic;
} = {
  definition: {
    relation: 'initiateur',
    typeObjet: 'auto-diagnostic',
    typeUtilisateur: 'entité',
  },
};
