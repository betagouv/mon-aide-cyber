import { Entrepot } from '../domaine/Entrepot';
import { Tuple, unObjet, unTuple, unUtilisateur } from './Tuple';
import crypto from 'crypto';
import { AdaptateurRelations } from './AdaptateurRelations';

export class AdaptateurRelationsMAC implements AdaptateurRelations {
  private tupleEntrepot: Entrepot<Tuple>;

  constructor(tupleEntrepot: Entrepot<Tuple>) {
    this.tupleEntrepot = tupleEntrepot;
  }

  async aidantInitieDiagnostic(
    identifiantAidant: crypto.UUID,
    identifiantDiagnostic: crypto.UUID,
  ) {
    await this.tupleEntrepot.persiste(
      unTuple()
        .avecUtilisateur(
          unUtilisateur()
            .deTypeAidant()
            .avecIdentifiant(identifiantAidant)
            .construis(),
        )
        .avecRelationInitiateur()
        .avecObjet(
          unObjet()
            .deTypeDiagnostic()
            .avecIdentifiant(identifiantDiagnostic)
            .construis(),
        )
        .construis(),
    );
  }
}
