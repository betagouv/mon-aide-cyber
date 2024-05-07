import { AdaptateurRelations } from '../../src/relation/AdaptateurRelations';
import crypto from 'crypto';
import { Objet, Relation, Utilisateur } from '../../src/relation/Tuple';

export class AdaptateurRelationsTest implements AdaptateurRelations {
  constructor(private readonly relations: Map<string, string[]>) {}

  aidantInitieDiagnostic(_: crypto.UUID, __: crypto.UUID): Promise<void> {
    return Promise.resolve();
  }

  diagnosticsInitiePar(identifiantAidant: crypto.UUID): Promise<string[]> {
    return Promise.resolve(this.relations.get(identifiantAidant) || []);
  }

  relationExiste(
    _relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet,
  ): Promise<boolean> {
    return Promise.resolve(
      !!this.relations
        .get(utilisateur.identifiant)
        ?.filter((d) => d === objet.identifiant),
    );
  }
}
