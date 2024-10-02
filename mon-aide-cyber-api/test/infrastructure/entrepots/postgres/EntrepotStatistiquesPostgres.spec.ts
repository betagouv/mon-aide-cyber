import { afterEach, beforeEach, describe, it } from 'vitest';
import { nettoieLaBaseDeDonneesStatistiques } from '../../../utilitaires/nettoyeurBDD';
import { EntrepotAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { ServiceDeChiffrementClair } from '../../securite/ServiceDeChiffrementClair';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';
import { EntrepotStatistiquesPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotStatistiquesPostgres';
import { Statistiques } from '../../../../src/statistiques/statistiques';
import { EntrepotRelationPostgres } from '../../../../src/relation/infrastructure/EntrepotRelationPostgres';
import { Tuple } from '../../../../src/relation/Tuple';
import { UUID } from 'crypto';

describe('Entrepot Statistiques Postgres', () => {
  beforeEach(async () => await nettoieLaBaseDeDonneesStatistiques());
  afterEach(async () => await nettoieLaBaseDeDonneesStatistiques());

  const unTupleDiagnostic = (identifiant: UUID): Tuple => ({
    identifiant,
    relation: 'initiateur',
    objet: { type: 'diagnostic', identifiant: '' },
    utilisateur: { type: 'aidant', identifiant: '' },
  });

  it('Retourne les statistiques', async () => {
    const entrepotAidant = new EntrepotAidantPostgres(
      new ServiceDeChiffrementClair()
    );
    await entrepotAidant.persiste(unAidant().construis());
    await entrepotAidant.persiste(unAidant().construis());
    await new EntrepotRelationPostgres().persiste(
      unTupleDiagnostic(crypto.randomUUID())
    );
    await new EntrepotRelationPostgres().persiste(
      unTupleDiagnostic(crypto.randomUUID())
    );
    await new EntrepotRelationPostgres().persiste(
      unTupleDiagnostic(crypto.randomUUID())
    );
    await new EntrepotRelationPostgres().persiste(
      unTupleDiagnostic(crypto.randomUUID())
    );
    await new EntrepotRelationPostgres().persiste({
      identifiant: crypto.randomUUID(),
      relation: 'initiateur',
      objet: { type: 'autre', identifiant: '' },
      utilisateur: { type: 'aidant', identifiant: '' },
    });

    const statistiques = await new EntrepotStatistiquesPostgres().lis();

    expect(statistiques).toStrictEqual<Statistiques>({
      identifiant: expect.any(String),
      nombreDiagnostics: 4,
      nombreAidants: 2,
    });
  });
});
