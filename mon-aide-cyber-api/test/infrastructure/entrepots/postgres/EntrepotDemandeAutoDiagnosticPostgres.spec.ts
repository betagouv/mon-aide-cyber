import { beforeEach, describe } from 'vitest';
import { nettoieLaBaseDeDonneesDemandeAutoDiagnostic } from '../../../utilitaires/nettoyeurBDD';
import { EntrepotDemandeAutoDiagnosticPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotDemandeAutoDiagnosticPostgres';
import { DemandeAutoDiagnostic } from '../../../../src/auto-diagnostic/CapteurSagaLanceAutoDiagnostic';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';

describe('Entrepot demande auto diagnostic', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesDemandeAutoDiagnostic();
  });

  it('Persiste une demande d’auto diagnostic', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const demandeAutoDiagnostic = {
      identifiant: crypto.randomUUID(),
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    };

    await new EntrepotDemandeAutoDiagnosticPostgres().persiste(
      demandeAutoDiagnostic
    );

    const demandeAutoDiagnosticRecue =
      await new EntrepotDemandeAutoDiagnosticPostgres().lis(
        demandeAutoDiagnostic.identifiant
      );
    expect(demandeAutoDiagnosticRecue).toStrictEqual<DemandeAutoDiagnostic>({
      identifiant: demandeAutoDiagnostic.identifiant,
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    });
  });
});
