import { beforeEach, describe } from 'vitest';
import { nettoieLaBaseDeDonneesDemandeDiagnosticLibreAcces } from '../../../utilitaires/nettoyeurBDD';
import { EntrepotDemandeDiagnosticLibreAccesPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotDemandeDiagnosticLibreAccesPostgres';
import { DemandeDiagnosticLibreAcces } from '../../../../src/diagnostic-libre-acces/CapteurSagaLanceDiagnosticLibreAcces';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';

describe('Entrepot de demande de diagnostic en libre accès', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesDemandeDiagnosticLibreAcces();
  });

  it('Persiste une demande de diagnostic en libre accès', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const demandeDiagnosticLibreAcces = {
      identifiant: crypto.randomUUID(),
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    };

    await new EntrepotDemandeDiagnosticLibreAccesPostgres().persiste(
      demandeDiagnosticLibreAcces
    );

    const demandeDiagnosticLibreAccesRecue =
      await new EntrepotDemandeDiagnosticLibreAccesPostgres().lis(
        demandeDiagnosticLibreAcces.identifiant
      );
    expect(
      demandeDiagnosticLibreAccesRecue
    ).toStrictEqual<DemandeDiagnosticLibreAcces>({
      identifiant: demandeDiagnosticLibreAcces.identifiant,
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    });
  });
});
