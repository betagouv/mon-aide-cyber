import { beforeEach, describe, expect, it } from 'vitest';
import { Tuple, unTuple } from '../../src/relation/Tuple';
import { nettoieLaBaseDeDonneesRelations } from '../utilitaires/nettoyeurBDD';
import {
  EntrepotRelationPostgres,
  TupleDTO,
} from '../../src/relation/infrastructure/EntrepotRelationPostgres';
import { AggregatNonTrouve } from '../../src/relation/Aggregat';
import {
  definitionAidantInitieDiagnostic,
  DefinitionAidantInitieDiagnostic,
} from '../../src/diagnostic/tuples';
import crypto from 'crypto';

class EntrepotRelationPostgresTest extends EntrepotRelationPostgres {
  lis(identifiant: string): Promise<Tuple> {
    return this.knex
      .from(this.nomTable())
      .where('id', identifiant)
      .first()
      .then((ligne: TupleDTO) =>
        ligne !== undefined
          ? this.deDTOAEntite(ligne)
          : Promise.reject(new AggregatNonTrouve(this.typeAggregat()))
      );
  }
}

describe('Entrepot Relation Postgres', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesRelations();
  });

  it('persiste une relation', async () => {
    const tuple = unTuple<DefinitionAidantInitieDiagnostic>(
      definitionAidantInitieDiagnostic
    )
      .avecUtilisateur(crypto.randomUUID())
      .avecObjet(crypto.randomUUID())
      .construis();

    await new EntrepotRelationPostgres().persiste(tuple);

    const tupleRecu = await new EntrepotRelationPostgresTest().lis(
      tuple.identifiant
    );

    expect(tupleRecu).toStrictEqual<Tuple>(tuple);
  });

  it('Trouve les diagnostics initiés par', async () => {
    const identifiantUtilisateur = crypto.randomUUID();
    const premierTuple = unTuple<DefinitionAidantInitieDiagnostic>(
      definitionAidantInitieDiagnostic
    )
      .avecUtilisateur(identifiantUtilisateur)
      .avecObjet(crypto.randomUUID())
      .construis();
    const deuxiemeTuple = unTuple<DefinitionAidantInitieDiagnostic>(
      definitionAidantInitieDiagnostic
    )
      .avecUtilisateur(identifiantUtilisateur)
      .avecObjet(crypto.randomUUID())
      .construis();
    const troisiemeTuple = unTuple<DefinitionAidantInitieDiagnostic>(
      definitionAidantInitieDiagnostic
    )
      .avecUtilisateur(crypto.randomUUID())
      .avecObjet(crypto.randomUUID())
      .construis();
    await new EntrepotRelationPostgres().persiste(premierTuple);
    await new EntrepotRelationPostgres().persiste(deuxiemeTuple);
    await new EntrepotRelationPostgres().persiste(troisiemeTuple);

    const tuplesRecus =
      await new EntrepotRelationPostgresTest().trouveObjetsLiesAUtilisateur(
        identifiantUtilisateur
      );

    expect(tuplesRecus).toStrictEqual<Tuple[]>([premierTuple, deuxiemeTuple]);
  });

  it('Vérifie l’existence d’une relation', async () => {
    const tuple = unTuple<DefinitionAidantInitieDiagnostic>(
      definitionAidantInitieDiagnostic
    )
      .avecUtilisateur(crypto.randomUUID())
      .avecObjet(crypto.randomUUID())
      .construis();
    await new EntrepotRelationPostgres().persiste(tuple);

    expect(
      await new EntrepotRelationPostgres().relationExiste(
        tuple.relation,
        tuple.utilisateur,
        tuple.objet
      )
    ).toBe(true);
  });
});
