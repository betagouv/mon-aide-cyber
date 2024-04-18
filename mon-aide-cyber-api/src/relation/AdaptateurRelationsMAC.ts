import { unObjet, unTuple, unUtilisateur } from './Tuple';
import crypto from 'crypto';
import { AdaptateurRelations } from './AdaptateurRelations';
import { EntrepotRelation } from './EntrepotRelation';
import { EntrepotRelationMemoire } from './EntrepotRelationMemoire';

const fabriqueEntrepotRelations = (): EntrepotRelation =>
  new EntrepotRelationMemoire();

export class AdaptateurRelationsMAC implements AdaptateurRelations {
  private tupleEntrepot: EntrepotRelation;
  constructor(tupleEntrepot: EntrepotRelation = fabriqueEntrepotRelations()) {
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

  diagnosticsInitiePar(identifiantAidant: crypto.UUID): Promise<string[]> {
    return this.tupleEntrepot
      .trouveDiagnosticsInitiePar(identifiantAidant)
      .then((tuples) => tuples.map((tuple) => tuple.objet.identifiant));
  }
}
