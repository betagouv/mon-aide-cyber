import { afterEach, describe, expect, it } from 'vitest';
import { unDiagnostic } from '../../../constructeurs/constructeurDiagnostic';
import { nettoieLaBaseDeDonnees } from '../../../utilitaires/nettoyeurBDD';
import {
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from '../../../constructeurs/constructeurReferentiel';
import { EntrepotDiagnosticPostgres } from '../../../../src/infrastructure/entrepots/postgres/diagnostic/EntrepotDiagnosticPostgres';
import { ReponseDonnee } from '../../../../src/diagnostic/Diagnostic';

describe('Entrepot Diagnostic Postgres', () => {
  afterEach(async () => {
    await nettoieLaBaseDeDonnees();
  });
  it('persiste un diagnostic', async () => {
    const diagnostic = unDiagnostic().construis();

    await new EntrepotDiagnosticPostgres().persiste(diagnostic);

    const entrepotDiagnosticPostgresLecture =
      await new EntrepotDiagnosticPostgres();
    expect(
      await entrepotDiagnosticPostgresLecture.lis(diagnostic.identifiant),
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
          .construis(),
      )
      .avecLesReponsesDonnees('question-set', [
        { 'sauvegardestu-les-set': ['un-peu', 'beaucoup'] },
      ])
      .construis();

    await new EntrepotDiagnosticPostgres().persiste(diagnostic);

    const diagnosticLu = await new EntrepotDiagnosticPostgres().lis(
      diagnostic.identifiant,
    );
    expect(diagnosticLu.identifiant).toStrictEqual(diagnostic.identifiant);
    expect(diagnosticLu.recommandations).toStrictEqual(
      diagnostic.recommandations,
    );
    expect(diagnosticLu.tableauDesRecommandations).toStrictEqual(
      diagnostic.tableauDesRecommandations,
    );
    expect(
      diagnosticLu.referentiel['question-set'].questions[0].reponseDonnee,
    ).toStrictEqual<ReponseDonnee>({
      reponse: {
        identifiant: null,
        reponses: [
          {
            identifiant: 'sauvegardestu-les-set',
            reponses: new Set(['un-peu', 'beaucoup']),
          },
        ],
      },
      reponseUnique: null,
      reponsesMultiples: [],
    });
  });

  it('persiste un diagnostic avec les réponses données avec le nouveau modèle de réponse ', async () => {
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
          .construis(),
      )
      .avecLaReponseDonnee('question-set', {
        'sauvegardestu-les-set': ['un-peu', 'beaucoup'],
      })
      .construis();

    await new EntrepotDiagnosticPostgres().persiste(diagnostic);

    const entrepotDiagnosticPostgresLecture =
      await new EntrepotDiagnosticPostgres();
    expect(
      await entrepotDiagnosticPostgresLecture.lis(diagnostic.identifiant),
    ).toStrictEqual(diagnostic);
  });
});
