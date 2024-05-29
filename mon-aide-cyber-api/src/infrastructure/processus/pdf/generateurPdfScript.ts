import { adaptateurTranscripteur } from '../../adaptateurs/transcripteur/adaptateurTranscripteur';
import { AdaptateurDeRestitutionPDF } from '../../adaptateurs/AdaptateurDeRestitutionPDF';

(async () => {
  const restitution = JSON.parse(process.argv[2]);
  console.log(
    `[enfant][${process.pid}] - Génération PDF restitution en cours.`,
  );

  const adaptateurTranscripteurDonnees = adaptateurTranscripteur();
  const traductionThematiques =
    new Map(
      Object.entries(
        adaptateurTranscripteurDonnees.transcripteur().thematiques,
      ).map(([clef, thematique]) => [clef, thematique.libelle]),
    ) || new Map();

  const adaptateurDeRestitutionPDF = new AdaptateurDeRestitutionPDF(
    traductionThematiques,
  );

  const buffer = await adaptateurDeRestitutionPDF.genereRestitution(
    restitution,
  );
  console.log(`[enfant][${process.pid}] - Restitution PDF générée`);

  if (process.send) {
    process.send(buffer);
    console.log(`[enfant][${process.pid}] - PDF envoyé`);
  }
})();
