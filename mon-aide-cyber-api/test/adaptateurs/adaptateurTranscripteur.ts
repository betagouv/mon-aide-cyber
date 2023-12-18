import { AdaptateurTranscripteur } from '../../src/adaptateurs/AdaptateurTranscripteur';

import { Transcripteur } from '../../src/api/representateurs/types';

export class AdaptateurTranscripteurDeTest implements AdaptateurTranscripteur {
  transcripteur(): Transcripteur {
    return {
      thematiques: {
        contexte: {
          libelle: 'Contexte',
          questions: [{ identifiant: '', reponses: [] }],
        },
      },
    };
  }
}
