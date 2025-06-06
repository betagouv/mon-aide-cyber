import { beforeEach, describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonneesRelations } from '../../../utilitaires/nettoyeurBDD';
import { Tuple, unTuple } from '../../../../src/relation/Tuple';
import {
  definitionEntiteAideeBeneficieDiagnostic,
  DefinitionEntiteAideeBeneficieDiagnostic,
} from '../../../../src/diagnostic/tuples';
import crypto from 'crypto';
import { EntrepotRelationRattrapagePostgres } from '../../../../src/administration/diagnostics/rattrapage-entites-diagnostics/EntrepotRelationRattrapagePostgres';

describe('Entrepôt relation rattrapage Postgres', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesRelations();
  });

  const creeUneEntiteAideeBeneficiantDuDiagnostic = async (
    identifiantDiagnostic: crypto.UUID,
    identifiantEntiteAidee: any
  ) => {
    return unTuple<DefinitionEntiteAideeBeneficieDiagnostic>(
      definitionEntiteAideeBeneficieDiagnostic
    )
      .avecUtilisateur(identifiantEntiteAidee)
      .avecObjet(identifiantDiagnostic)
      .construis();
  };

  it('Lit une relation', async () => {
    const entrepotRelation = new EntrepotRelationRattrapagePostgres();
    const tuple = await creeUneEntiteAideeBeneficiantDuDiagnostic(
      crypto.randomUUID(),
      'un-identifiant'
    );
    await entrepotRelation.persiste(tuple);

    const tupleRecu = await entrepotRelation.parIdentifiant(tuple.identifiant);

    expect(tupleRecu).toStrictEqual<Tuple>(tuple);
  });

  it('Renvoie une erreur si la relation n’existe pas', async () => {
    const entrepotRelation = new EntrepotRelationRattrapagePostgres();

    expect(() =>
      entrepotRelation.parIdentifiant(crypto.randomUUID())
    ).rejects.toThrow("Le relation demandé n'existe pas.");
  });

  it('Met à jour une relation', async () => {
    const entrepotRelation = new EntrepotRelationRattrapagePostgres();
    const tuple = await creeUneEntiteAideeBeneficiantDuDiagnostic(
      crypto.randomUUID(),
      'un-identifiant'
    );
    await entrepotRelation.persiste(tuple);

    tuple.utilisateur.identifiant = 'nouvel-identifiant';
    await entrepotRelation.persiste(tuple);
    const tupleRecu = await entrepotRelation.parIdentifiant(tuple.identifiant);

    expect(tupleRecu.utilisateur.identifiant).toBe('nouvel-identifiant');
  });
});
