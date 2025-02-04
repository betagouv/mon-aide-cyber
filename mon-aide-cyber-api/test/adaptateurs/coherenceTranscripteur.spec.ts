import { describe, expect, it } from 'vitest';
import { adaptateurTranscripteur } from '../../src/infrastructure/adaptateurs/transcripteur/adaptateurTranscripteur';
import fs from 'fs';

describe('Cohérence du transcripteur', () => {
  it('Assure la rétro compatibilité des identifiants des questions du transcripteur', () => {
    const resultat = Object.entries(
      adaptateurTranscripteur().transcripteur().thematiques
    ).flatMap(([_, thematique]) => {
      return thematique.groupes.flatMap((groupe) => {
        return groupe.questions.flatMap((question) => {
          return question.identifiant;
        });
      });
    });

    expect(resultat).toStrictEqual(
      JSON.parse(
        fs.readFileSync(
          './test/adaptateurs/coherence-transcripteur.json',
          'utf-8'
        )
      )
    );
  });
});
