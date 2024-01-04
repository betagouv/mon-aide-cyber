import { AdaptateurTranscripteur } from '../../src/adaptateurs/AdaptateurTranscripteur';

import { Transcripteur } from '../../src/api/representateurs/types';

export class AdaptateurTranscripteurDeTest implements AdaptateurTranscripteur {
  transcripteur(): Transcripteur {
    return {
      thematiques: {
        contexte: {
          description: 'Description du contexte',
          libelle: 'Contexte',
          localisationIconeNavigation: '/chemin/icone/contexte',
          localisationIllustration: '/chemin/illustration/contexte',
          groupes: [],
        },
      },
    };
  }
}
