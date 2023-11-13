import { describe, expect, it } from 'vitest';
import {
  DiagnosticDTO,
  RepresentationReponsesMultiplesDTO,
} from '../../../../../src/infrastructure/entrepots/postgres/diagnostic/EntrepotDiagnosticPostgres';
import { unTableauDeRecommandations } from '../../../../constructeurs/constructeurTableauDeRecommandations';
import {
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from '../../../../constructeurs/constructeurReferentiel';
import { TranscripteurRepresentationVersDiagnostic } from '../../../../../src/infrastructure/entrepots/postgres/diagnostic/TranscripteurRepresentationVersDiagnostic';
import {
  unDiagnostic,
  uneNouvelleReponseDonnee,
} from '../../../../constructeurs/constructeurDiagnostic';
import {
  Diagnostic,
  estReponseMultiple,
  QuestionDiagnostic,
} from '../../../../../src/diagnostic/Diagnostic';

describe('Transcripteur représentation vers diagnostic', () => {
  it('transcris une représentation', () => {
    const question = uneQuestion().construis();
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentiel()
          .sansThematique()
          .ajouteUneThematique('thematique1', [question])
          .construis(),
      )
      .construis();
    const diagnosticDTO = versDTO(diagnostic);

    const diagnosticTranscris =
      new TranscripteurRepresentationVersDiagnostic().transcris(diagnosticDTO);

    expect(diagnosticTranscris).toStrictEqual(diagnostic);
  });

  it('transcris une représentation avec une réponse multiple', () => {
    const question = uneQuestion()
      .aChoixMultiple('q')
      .avecReponsesPossibles([
        uneReponsePossible().avecLibelle('Réponse 1').construis(),
        uneReponsePossible().avecLibelle('Réponse 2').construis(),
        uneReponsePossible().avecLibelle('Réponse 3').construis(),
      ])
      .construis();
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentiel()
          .sansThematique()
          .ajouteUneThematique('thematique1', [question])
          .construis(),
      )
      .avecLaReponseDonnee('thematique1', { q: ['reponse-1', 'reponse-3'] })
      .construis();

    const diagnosticDTO: DiagnosticDTO = versDTO(diagnostic);

    const diagnosticTranscris =
      new TranscripteurRepresentationVersDiagnostic().transcris(diagnosticDTO);

    expect(diagnosticTranscris).toStrictEqual(diagnostic);
  });

  it.each([false, true])(
    'transcris une représentation avec une question à tiroir à choix multiple',
    (ancienneReponsesMultiplesOptionnelles) => {
      const question = uneQuestion()
        .aChoixUnique('q')
        .avecReponsesPossibles([
          uneReponsePossible()
            .avecLibelle('Réponse')
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixMultiple('Parmi les réponses')
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle('1').construis(),
                  uneReponsePossible().avecLibelle('2').construis(),
                  uneReponsePossible().avecLibelle('3').construis(),
                ])
                .construis(),
            )
            .construis(),
        ])
        .construis();
      const reponseDonnee = uneNouvelleReponseDonnee()
        .reponseMultiple('reponse', [
          { identifiant: 'parmi-les-reponses', reponses: ['2', '3'] },
        ])
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('thematique1', [question])
            .construis(),
        )
        .ajouteUneReponseDonnee(
          { thematique: 'thematique1', question: 'q' },
          reponseDonnee,
        )
        .construis();

      const diagnosticDTO: DiagnosticDTO = versDTO(
        diagnostic,
        ancienneReponsesMultiplesOptionnelles,
      );

      const diagnosticTranscris =
        new TranscripteurRepresentationVersDiagnostic().transcris(
          diagnosticDTO,
        );

      expect(diagnosticTranscris).toStrictEqual(diagnostic);
    },
  );

  const versDTO = (
    diagnostic: Diagnostic,
    ancienneReponsesMultiplesOptionnelles = false,
  ) => {
    function reponsesMultiples(
      question: QuestionDiagnostic,
    ): RepresentationReponsesMultiplesDTO[] {
      if (estReponseMultiple(question.reponseDonnee.reponse)) {
        return question.reponseDonnee.reponse.reponses.map((rep) => ({
          identifiant: rep.identifiant,
          reponses: Array.from(rep.reponses),
        }));
      }
      return [];
    }

    const diagnosticDTO: DiagnosticDTO = {
      donnees: {
        identifiant: diagnostic.identifiant,
        referentiel: {
          ...Object.entries(diagnostic.referentiel).reduce(
            (accumulateur, [thematique, questions]) => {
              return {
                ...accumulateur,
                [thematique]: {
                  questions: questions.questions.map((question) => ({
                    ...question,
                    reponseDonnee: {
                      ...(!ancienneReponsesMultiplesOptionnelles && {
                        reponsesMultiples: reponsesMultiples(question),
                      }),
                      ...(estReponseMultiple(
                        question.reponseDonnee.reponse,
                      ) && { reponse: question.reponseDonnee.reponse }),
                      reponseUnique: estReponseMultiple(
                        question.reponseDonnee.reponse,
                      )
                        ? question.reponseDonnee.reponse.identifiant
                        : question.reponseDonnee.reponseUnique,
                    },
                  })),
                },
              };
            },
            {},
          ),
        },
        tableauDesRecommandations: unTableauDeRecommandations().construis(),
      },
      id: diagnostic.identifiant,
    };
    return diagnosticDTO;
  };
});
