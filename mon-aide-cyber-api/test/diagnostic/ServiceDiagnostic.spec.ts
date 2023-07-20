import { beforeEach, describe, expect, it } from "vitest";
import {
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
  unReferentielAuContexteVide,
} from "../constructeurs/constructeurReferentiel";
import { unDiagnostic } from "../constructeurs/constructeurDiagnostic";
import { ServiceDiagnostic } from "../../src/diagnostic/ServiceDiagnostic";
import { AdaptateurReferentielDeTest } from "../adaptateurs/AdaptateurReferentielDeTest";
import { Entrepots } from "../../src/domaine/Entrepots";
import { EntrepotsMemoire } from "../../src/infrastructure/entrepots/memoire/Entrepots";
import { QuestionDiagnostic } from "../../src/diagnostic/Diagnostic";

describe("Le service de diagnostic", () => {
  let adaptateurReferentiel: AdaptateurReferentielDeTest;
  let entrepots: Entrepots;

  beforeEach(() => {
    adaptateurReferentiel = new AdaptateurReferentielDeTest();
    entrepots = new EntrepotsMemoire();
  });

  describe("Lorsque l'on veut accéder à un diagnostic", () => {
    it("retourne un diagnostic contenant une réponse avec une question à tiroir", async () => {
      const reponseAttendue = uneReponsePossible()
        .avecQuestionATiroir(
          uneQuestionATiroir()
            .aChoixMultiple("Quelles réponses ?")
            .avecReponsesPossibles([
              uneReponsePossible().avecLibelle("Réponse A").construis(),
              uneReponsePossible().avecLibelle("Réponse B").construis(),
              uneReponsePossible().avecLibelle("Réponse C").construis(),
            ])
            .construis(),
        )
        .construis();
      const question = uneQuestion()
        .avecReponsesPossibles([
          uneReponsePossible().construis(),
          reponseAttendue,
        ])
        .construis();
      const referentiel = unReferentielAuContexteVide()
        .ajouteUneQuestionAuContexte(uneQuestion().construis())
        .ajouteUneQuestionAuContexte(question)
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(referentiel)
        .construis();
      adaptateurReferentiel.ajoute(referentiel);
      entrepots.diagnostic().persiste(diagnostic);
      const serviceDiagnostic = new ServiceDiagnostic(
        adaptateurReferentiel,
        entrepots,
      );

      const diagnosticRetourne = await serviceDiagnostic.diagnostic(
        diagnostic.identifiant,
      );

      const referentielDiagnostic = diagnosticRetourne.referentiel["contexte"];
      expect(
        referentielDiagnostic.questions.map((q) => q.reponseDonnee),
      ).toMatchObject([
        { reponseUnique: null, reponsesMultiples: new Set() },
        { reponseUnique: null, reponsesMultiples: new Set() },
      ]);
      expect(
        referentielDiagnostic.questions[1].reponsesPossibles[1],
      ).toMatchObject({
        identifiant: reponseAttendue.identifiant,
        libelle: reponseAttendue.libelle,
        ordre: reponseAttendue.ordre,
        question: {
          identifiant: "quelles-reponses-",
          libelle: "Quelles réponses ?",
          reponsesPossibles: [
            { identifiant: "reponse-a", libelle: "Réponse A", ordre: 0 },
            { identifiant: "reponse-b", libelle: "Réponse B", ordre: 1 },
            { identifiant: "reponse-c", libelle: "Réponse C", ordre: 2 },
          ],
          type: "choixMultiple",
        },
      });
    });
  });

  describe("Lorsque l'on veut lancer un diagnostic", () => {
    it("copie le référentiel disponible et le persiste", async () => {
      const referentiel = unReferentiel().construis();
      adaptateurReferentiel.ajoute(referentiel);
      const questionAttendue = referentiel.contexte.questions[0];

      const diagnostic = await new ServiceDiagnostic(
        adaptateurReferentiel,
        entrepots,
      ).lance();

      const diagnosticRetourne = await entrepots
        .diagnostic()
        .lis(diagnostic.identifiant);
      expect(diagnosticRetourne.identifiant).not.toBeUndefined();
      expect(
        diagnosticRetourne.referentiel["contexte"].questions,
      ).toStrictEqual([
        {
          identifiant: questionAttendue.identifiant,
          libelle: questionAttendue.libelle,
          type: questionAttendue.type,
          reponsesPossibles: questionAttendue.reponsesPossibles,
          reponseDonnee: { reponseUnique: null, reponsesMultiples: new Set() },
        },
      ]);
    });
  });

  describe("Lorsque l’on veut ajouter une réponse au diagnostic", () => {
    it("met à jour les réponses d’une question à tiroir", async () => {
      const premiereReponse = uneReponsePossible().construis();
      const secondeReponse = uneReponsePossible().construis();
      const reponseAvecQuestionATiroir = uneReponsePossible()
        .avecQuestionATiroir(
          uneQuestion()
            .aChoixMultiple("QCM ?")
            .avecReponsesPossibles([
              premiereReponse,
              uneReponsePossible().construis(),
              secondeReponse,
            ])
            .construis(),
        )
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentielAuContexteVide()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique("Question à tiroir ?")
                .avecReponsesPossibles([reponseAvecQuestionATiroir])
                .construis(),
            )
            .construis(),
        )
        .construis();
      entrepots.diagnostic().persiste(diagnostic);

      await new ServiceDiagnostic(
        adaptateurReferentiel,
        entrepots,
      ).ajouteLaReponse(diagnostic.identifiant, {
        chemin: "contexte",
        identifiant: "question-a-tiroir-",
        reponse: {
          reponse: reponseAvecQuestionATiroir.identifiant,
          question: {
            identifiant: "qcm-",
            reponses: [premiereReponse.identifiant, secondeReponse.identifiant],
          },
        },
      });

      const question = diagnostic.referentiel.contexte
        .questions[0] as QuestionDiagnostic;
      expect(question.reponseDonnee).toMatchObject({
        reponseUnique: reponseAvecQuestionATiroir.identifiant,
        reponsesMultiples: new Set([
          premiereReponse.identifiant,
          secondeReponse.identifiant,
        ]),
      });
    });
  });
});
