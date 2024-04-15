import { describe, it } from 'vitest';
import {
  Tuple,
  unObjet,
  unTuple,
  unUtilisateur,
} from '../../src/relation/Tuple';
import { nettoieLaBaseDeDonneesRelations } from '../utilitaires/nettoyeurBDD';
import {
  EntrepotRelationPostgres,
  TupleDTO,
} from '../../src/relation/infrastructure/EntrepotRelationPostgres';
import { AggregatNonTrouve } from '../../src/relation/Aggregat';

class EntrepotRelationPostgresTest extends EntrepotRelationPostgres {
  lis(identifiant: string): Promise<Tuple> {
    return this.knex
      .from(this.nomTable())
      .where('id', identifiant)
      .first()
      .then((ligne: TupleDTO) =>
        ligne !== undefined
          ? this.deDTOAEntite(ligne)
          : Promise.reject(new AggregatNonTrouve(this.typeAggregat())),
      );
  }
}

describe('Entrepot Relation Postgres', () => {
  afterEach(async () => {
    await nettoieLaBaseDeDonneesRelations();
  });

  it('persiste une relation', async () => {
    const tuple = unTuple()
      .avecRelationInitiateur()
      .avecUtilisateur(
        unUtilisateur()
          .avecIdentifiant(crypto.randomUUID())
          .deTypeAidant()
          .construis(),
      )
      .avecObjet(
        unObjet()
          .avecIdentifiant(crypto.randomUUID())
          .deTypeDiagnostic()
          .construis(),
      )
      .construis();

    await new EntrepotRelationPostgres().persiste(tuple);

    const tupleRecu = await new EntrepotRelationPostgresTest().lis(
      tuple.identifiant,
    );

    expect(tupleRecu).toStrictEqual<Tuple>(tuple);
  });
});
