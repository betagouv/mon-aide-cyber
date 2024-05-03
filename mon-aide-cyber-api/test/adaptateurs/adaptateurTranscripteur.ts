import { AdaptateurTranscripteur } from '../../src/adaptateurs/AdaptateurTranscripteur';

import { Transcripteur } from '../../src/api/representateurs/types';

export class AdaptateurTranscripteurDeTest implements AdaptateurTranscripteur {
  transcripteur(): Transcripteur {
    return {
      thematiques: {
        contexte: {
          description: 'Description du contexte',
          libelle: 'Contexte',
          styles: {
            navigation: 'navigation-contexte',
          },
          localisationIllustration: '/chemin/illustration/contexte',
          groupes: [],
        },
      },
      generateurInfoBulle: (infoBulle) => infoBulle,
    };
  }
}
