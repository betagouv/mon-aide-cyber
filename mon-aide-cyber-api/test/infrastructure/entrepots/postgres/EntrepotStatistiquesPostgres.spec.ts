import { afterEach, beforeEach, describe, it } from 'vitest';
import { nettoieLaBaseDeDonneesStatistiques } from '../../../utilitaires/nettoyeurBDD';
import { EntrepotAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { ServiceDeChiffrementClair } from '../../securite/ServiceDeChiffrementClair';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';
import { EntrepotDiagnosticPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotDiagnosticPostgres';
import { unDiagnostic } from '../../../constructeurs/constructeurDiagnostic';
import { EntrepotStatistiquesPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotStatistiquesPostgres';
import { Statistiques } from '../../../../src/statistiques/statistiques';

describe('Entrepot Statistiques Postgres', () => {
  beforeEach(async () => await nettoieLaBaseDeDonneesStatistiques());
  afterEach(async () => await nettoieLaBaseDeDonneesStatistiques());

  it('Retourne les statistiques', async () => {
    const entrepotAidant = new EntrepotAidantPostgres(
      new ServiceDeChiffrementClair()
    );
    await entrepotAidant.persiste(unAidant().construis());
    await entrepotAidant.persiste(unAidant().construis());
    const entrepotDiagnostic = new EntrepotDiagnosticPostgres();
    await entrepotDiagnostic.persiste(unDiagnostic().construis());
    await entrepotDiagnostic.persiste(unDiagnostic().construis());
    await entrepotDiagnostic.persiste(unDiagnostic().construis());
    await entrepotDiagnostic.persiste(unDiagnostic().construis());

    const statistiques = await new EntrepotStatistiquesPostgres().lis();

    expect(statistiques).toStrictEqual<Statistiques>({
      identifiant: expect.any(String),
      nombreDiagnostics: 4,
      nombreAidants: 2,
    });
  });
});
