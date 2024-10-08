import { afterEach, describe, expect, it } from 'vitest';
import { unDiagnostic } from '../../../constructeurs/constructeurDiagnostic';
import { nettoieLaBaseDeDonneesDiagnostics } from '../../../utilitaires/nettoyeurBDD';
import {
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from '../../../constructeurs/constructeurReferentiel';
import { EntrepotDiagnosticPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotDiagnosticPostgres';

describe('Entrepot Diagnostic Postgres', () => {
  afterEach(async () => {
    await nettoieLaBaseDeDonneesDiagnostics();
  });
  it('persiste un diagnostic', async () => {
    const diagnostic = unDiagnostic().construis();

    await new EntrepotDiagnosticPostgres().persiste(diagnostic);

    const entrepotDiagnosticPostgresLecture = new EntrepotDiagnosticPostgres();
    expect(
      await entrepotDiagnosticPostgresLecture.lis(diagnostic.identifiant)
    ).toStrictEqual(diagnostic);
  });

  it('persiste un diagnostic avec les réponses données', async () => {
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentiel()
          .sansThematique()
          .ajouteUneThematique('question-set', [
            uneQuestion()
              .aChoixMultiple('Sauvegardes-tu les set?', [
                uneReponsePossible().avecLibelle('Oui').construis(),
                uneReponsePossible().avecLibelle('Un peu').construis(),
                uneReponsePossible().avecLibelle('Beaucoup').construis(),
              ])
              .construis(),
          ])
          .construis()
      )
      .avecLesReponsesDonnees('question-set', [
        { 'sauvegardestu-les-set': ['un-peu', 'beaucoup'] },
      ])
      .construis();

    await new EntrepotDiagnosticPostgres().persiste(diagnostic);

    const entrepotDiagnosticPostgresLecture =
      await new EntrepotDiagnosticPostgres();
    expect(
      await entrepotDiagnosticPostgresLecture.lis(diagnostic.identifiant)
    ).toStrictEqual(diagnostic);
  });

  it('Récupère les diagnostics pour les identifiants donnés', async () => {
    const diagnostic1 = unDiagnostic().construis();
    const diagnostic2 = unDiagnostic().construis();

    await new EntrepotDiagnosticPostgres().persiste(diagnostic1);
    await new EntrepotDiagnosticPostgres().persiste(diagnostic2);

    const entrepotDiagnosticPostgresLecture =
      await new EntrepotDiagnosticPostgres();
    expect(
      await entrepotDiagnosticPostgresLecture.tousLesDiagnosticsAyantPourIdentifiant(
        [diagnostic1.identifiant, diagnostic2.identifiant]
      )
    ).toStrictEqual([diagnostic1, diagnostic2]);
  });
});
