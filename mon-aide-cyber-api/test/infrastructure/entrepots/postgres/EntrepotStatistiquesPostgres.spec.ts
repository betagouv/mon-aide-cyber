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
import {
  unDiagnostic,
  unDiagnosticEnGironde,
} from '../../../constructeurs/constructeurDiagnostic';
import { EntrepotDiagnosticPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotDiagnosticPostgres';

describe('Entrepot Statistiques Postgres', () => {
  beforeEach(async () => await nettoieLaBaseDeDonneesStatistiques());
  afterEach(async () => await nettoieLaBaseDeDonneesStatistiques());

  const unTupleDiagnostic = (identifiant: UUID): Tuple => ({
    identifiant,
    relation: 'initiateur',
    objet: { type: 'diagnostic', identifiant: identifiant },
    utilisateur: { type: 'aidant', identifiant: '' },
  });

  it('Retourne les statistiques', async () => {
    const premierDiagnosticEnGironde = unDiagnosticEnGironde().construis();
    const deuxiemeDiagnosticEnGironde = unDiagnosticEnGironde().construis();
    const troisiemeDiagnosticEnGironde = unDiagnosticEnGironde().construis();
    const unDiagnosticSansDepartement = unDiagnostic().construis();
    const quatriemeDiagnosticEnGironde = unDiagnosticEnGironde().construis();
    const entrepotAidant = new EntrepotAidantPostgres(
      new ServiceDeChiffrementClair()
    );
    await entrepotAidant.persiste(unAidant().construis());
    await entrepotAidant.persiste(unAidant().construis());
    await new EntrepotDiagnosticPostgres().persiste(premierDiagnosticEnGironde);
    await new EntrepotDiagnosticPostgres().persiste(
      deuxiemeDiagnosticEnGironde
    );
    await new EntrepotDiagnosticPostgres().persiste(
      troisiemeDiagnosticEnGironde
    );
    await new EntrepotDiagnosticPostgres().persiste(
      quatriemeDiagnosticEnGironde
    );
    await new EntrepotDiagnosticPostgres().persiste(
      unDiagnosticSansDepartement
    );
    await new EntrepotRelationPostgres().persiste(
      unTupleDiagnostic(premierDiagnosticEnGironde.identifiant)
    );
    await new EntrepotRelationPostgres().persiste(
      unTupleDiagnostic(deuxiemeDiagnosticEnGironde.identifiant)
    );
    await new EntrepotRelationPostgres().persiste(
      unTupleDiagnostic(troisiemeDiagnosticEnGironde.identifiant)
    );
    await new EntrepotRelationPostgres().persiste(
      unTupleDiagnostic(quatriemeDiagnosticEnGironde.identifiant)
    );
    await new EntrepotRelationPostgres().persiste(
      unTupleDiagnostic(unDiagnosticSansDepartement.identifiant)
    );

    const statistiques = await new EntrepotStatistiquesPostgres().lis();

    expect(statistiques).toStrictEqual<Statistiques>({
      identifiant: expect.any(String),
      nombreDiagnostics: 4,
      nombreAidants: 2,
    });
  });
});
