import { beforeEach, describe, expect, it } from 'vitest';
import { DefinitionTuple, Tuple, unTuple } from '../../src/relation/Tuple';
import { nettoieLaBaseDeDonneesRelations } from '../utilitaires/nettoyeurBDD';
import {
  EntrepotRelationPostgres,
  TupleDTO,
} from '../../src/relation/infrastructure/EntrepotRelationPostgres';
import { AggregatNonTrouve } from '../../src/relation/Aggregat';
import {
  definitionAidantInitieDiagnostic,
  DefinitionAidantInitieDiagnostic,
  definitionEntiteAideeBeneficieDiagnostic,
  DefinitionEntiteAideeBeneficieDiagnostic,
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

type DefinitionTupleTest = DefinitionTuple & {
  relation: 'ma-relation';
  typeObjet: 'mon-objet';
  typeUtilisateur: 'mon-utilisateur';
};

type DefinitionAutreTupleTest = DefinitionTuple & {
  relation: 'autre-relation';
  typeObjet: 'mon-objet';
  typeUtilisateur: 'mon-utilisateur';
};

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

  it('Vérifie qu’un objet dispose d’une relation du type attendue', async () => {
    const tuple: Tuple = unTuple<DefinitionTupleTest>({
      definition: {
        relation: 'ma-relation',
        typeObjet: 'mon-objet',
        typeUtilisateur: 'mon-utilisateur',
      },
    })
      .avecObjet(crypto.randomUUID())
      .avecUtilisateur(crypto.randomUUID())
      .construis();

    await new EntrepotRelationPostgres().persiste(tuple);

    expect(
      await new EntrepotRelationPostgres().typeRelationExiste(
        'ma-relation',
        tuple.objet
      )
    ).toBe(true);
  });

  it('Supprime les relations', async () => {
    const identifiantUtilisateur = crypto.randomUUID();
    const identifiantObjet1 = crypto.randomUUID();
    const tuple1: Tuple = unTuple<DefinitionTupleTest>({
      definition: {
        relation: 'ma-relation',
        typeObjet: 'mon-objet',
        typeUtilisateur: 'mon-utilisateur',
      },
    })
      .avecObjet(identifiantObjet1)
      .avecUtilisateur(identifiantUtilisateur)
      .construis();
    const identifiantObjet2 = crypto.randomUUID();
    const tuple2: Tuple = unTuple<DefinitionTupleTest>({
      definition: {
        relation: 'ma-relation',
        typeObjet: 'mon-objet',
        typeUtilisateur: 'mon-utilisateur',
      },
    })
      .avecObjet(identifiantObjet2)
      .avecUtilisateur(identifiantUtilisateur)
      .construis();
    const tuple3: Tuple = unTuple<DefinitionAutreTupleTest>({
      definition: {
        relation: 'autre-relation',
        typeObjet: 'mon-objet',
        typeUtilisateur: 'mon-utilisateur',
      },
    })
      .avecObjet(crypto.randomUUID())
      .avecUtilisateur(identifiantUtilisateur)
      .construis();

    const entrepotRelation = new EntrepotRelationPostgres();
    await entrepotRelation.persiste(tuple1);
    await entrepotRelation.persiste(tuple2);
    await entrepotRelation.persiste(tuple3);

    await entrepotRelation.supprimeLesRelations([
      {
        relation: 'ma-relation',
        utilisateur: {
          type: 'mon-utilisateur',
          identifiant: identifiantUtilisateur,
        },
        objet: {
          type: 'mon-objet',
          identifiant: identifiantObjet1,
        },
      },
      {
        relation: 'ma-relation',
        utilisateur: {
          type: 'mon-utilisateur',
          identifiant: identifiantUtilisateur,
        },
        objet: {
          type: 'mon-objet',
          identifiant: identifiantObjet2,
        },
      },
    ]);

    expect(
      await entrepotRelation.trouveObjetsLiesAUtilisateur(
        identifiantUtilisateur
      )
    ).toStrictEqual([tuple3]);
  });

  it('Trouve les relations exsitantes pour un objet donné', async () => {
    const identifiantObjet = crypto.randomUUID();
    const tuple = unTuple<DefinitionEntiteAideeBeneficieDiagnostic>(
      definitionEntiteAideeBeneficieDiagnostic
    )
      .avecUtilisateur(crypto.randomUUID())
      .avecObjet(identifiantObjet)
      .construis();
    await new EntrepotRelationPostgres().persiste(tuple);

    expect(
      await new EntrepotRelationPostgres().trouveLesRelationsPourCetObjet(
        'destinataire',
        { type: 'diagnostic', identifiant: identifiantObjet }
      )
    ).toStrictEqual<Tuple[]>([tuple]);
  });
});
