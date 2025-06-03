import { adaptateurTranscripteur } from './adaptateurTranscripteur';

export const libellesDesThematiques = () => {
  return (
    new Map(
      Object.entries(adaptateurTranscripteur().transcripteur().thematiques).map(
        ([clef, thematique]) => [clef, thematique.libelle]
      )
    ) || new Map()
  );
};
