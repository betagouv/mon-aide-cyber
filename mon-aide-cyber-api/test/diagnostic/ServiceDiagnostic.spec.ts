import { beforeEach, describe, expect, it } from "vitest";
import {
  uneListeDeQuestions,
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from "../constructeurs/constructeurReferentiel";
import { unDiagnostic } from "../constructeurs/constructeurDiagnostic";
import { ServiceDiagnostic } from "../../src/diagnostic/ServiceDiagnostic";
import { AdaptateurReferentielDeTest } from "../adaptateurs/AdaptateurReferentielDeTest";
import { Entrepots } from "../../src/domaine/Entrepots";
import { EntrepotsMemoire } from "../../src/infrastructure/entrepots/memoire/Entrepots";
import { QuestionDiagnostic } from "../../src/diagnostic/Diagnostic";
import { unTableauDeNotes } from "../constructeurs/constructeurTableauDeNotes";
import { AdaptateurTableauDeNotesDeTest } from "../adaptateurs/AdaptateurTableauDeNotesDeTest";
import { unTableauDeRecommandations } from "../constructeurs/constructeurTableauDeRecommandations";
import { AdaptateurTableauDeRecommandationsDeTest } from "../adaptateurs/AdaptateurTableauDeRecommandationsDeTest";

describe("Le service de diagnostic", () => {
  let adaptateurReferentiel: AdaptateurReferentielDeTest;
  let adaptateurTableauDeNotes: AdaptateurTableauDeNotesDeTest;
  let adaptateurTableauDeRecommandations: AdaptateurTableauDeRecommandationsDeTest;
  let entrepots: Entrepots;

  beforeEach(() => {
    adaptateurReferentiel = new AdaptateurReferentielDeTest();
    adaptateurTableauDeNotes = new AdaptateurTableauDeNotesDeTest();
    adaptateurTableauDeRecommandations =
      new AdaptateurTableauDeRecommandationsDeTest();
    entrepots = new EntrepotsMemoire();
  });

  describe("Lorsque l'on veut accéder à un diagnostic", () => {
    it("retourne un diagnostic contenant une réponse avec une question à tiroir", async () => {
      const reponseAttendue = uneReponsePossible()
        .ajouteUneQuestionATiroir(
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
      const referentiel = unReferentiel()
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
        adaptateurTableauDeNotes,
        adaptateurTableauDeRecommandations,
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
        questions: [
          {
            identifiant: "quelles-reponses-",
            libelle: "Quelles réponses ?",
            reponsesPossibles: [
              { identifiant: "reponse-a", libelle: "Réponse A", ordre: 0 },
              { identifiant: "reponse-b", libelle: "Réponse B", ordre: 1 },
              { identifiant: "reponse-c", libelle: "Réponse C", ordre: 2 },
            ],
            type: "choixMultiple",
          },
        ],
      });
    });

    it("retourne un diagnostic contenant une réponse avec plusieurs questions à tiroir", async () => {
      const reponseAttendue = uneReponsePossible()
        .ajouteUneQuestionATiroir(uneQuestionATiroir().construis())
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .aChoixMultiple("Autres réponses ?")
            .avecReponsesPossibles([
              uneReponsePossible().avecLibelle("AA").construis(),
              uneReponsePossible().avecLibelle("BB").construis(),
              uneReponsePossible().avecLibelle("CC").construis(),
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
      const referentiel = unReferentiel()
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
        adaptateurTableauDeNotes,
        adaptateurTableauDeRecommandations,
        entrepots,
      );

      const diagnosticRetourne = await serviceDiagnostic.diagnostic(
        diagnostic.identifiant,
      );

      const referentielDiagnostic = diagnosticRetourne.referentiel["contexte"];
      expect(referentielDiagnostic.questions[1].reponsesPossibles).toHaveLength(
        2,
      );
      expect(
        referentielDiagnostic.questions[1].reponsesPossibles[1].questions?.[1],
      ).toMatchObject({
        identifiant: "autres-reponses-",
        libelle: "Autres réponses ?",
        reponsesPossibles: [
          { identifiant: "aa", libelle: "AA", ordre: 0 },
          { identifiant: "bb", libelle: "BB", ordre: 1 },
          { identifiant: "cc", libelle: "CC", ordre: 2 },
        ],
        type: "choixMultiple",
      });
    });
  });

  describe("Lorsque l'on veut lancer un diagnostic", () => {
    it("copie le référentiel disponible et le persiste", async () => {
      const referentiel = unReferentiel()
        .ajouteUneQuestionAuContexte(uneQuestion().construis())
        .construis();
      adaptateurReferentiel.ajoute(referentiel);
      const questionAttendue = referentiel.contexte.questions[0];

      const diagnostic = await new ServiceDiagnostic(
        adaptateurReferentiel,
        adaptateurTableauDeNotes,
        adaptateurTableauDeRecommandations,
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
          reponseDonnee: { reponseUnique: null, reponsesMultiples: [] },
        },
      ]);
    });

    it("ajoute le tableau des notes", async () => {
      const question = uneQuestion()
        .aChoixUnique("q")
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle("r1").construis(),
          uneReponsePossible().avecLibelle("r2").construis(),
          uneReponsePossible().avecLibelle("r3").construis(),
        ])
        .construis();
      const referentiel = unReferentiel()
        .ajouteUneThematique("T1", [question])
        .construis();
      adaptateurReferentiel.ajoute(referentiel);
      adaptateurTableauDeNotes.ajoute(
        unTableauDeNotes()
          .avecDesNotes([{ q: { r1: 0.5, r0: null, r2: 1 } }])
          .construis(),
      );

      const diagnostic = await new ServiceDiagnostic(
        adaptateurReferentiel,
        adaptateurTableauDeNotes,
        adaptateurTableauDeRecommandations,
        entrepots,
      ).lance();

      const diagnosticRetourne = await entrepots
        .diagnostic()
        .lis(diagnostic.identifiant);
      expect(diagnosticRetourne.tableauDesNotes).toStrictEqual({
        q: {
          r1: 0.5,
          r2: 1,
          r0: null,
        },
      });
    });
  });

  describe("Lorsque l’on veut ajouter une réponse au diagnostic", () => {
    it("met à jour les réponses d’une question à tiroir", async () => {
      const premiereReponse = uneReponsePossible().construis();
      const secondeReponse = uneReponsePossible().construis();
      const reponseAvecQuestionATiroir = uneReponsePossible()
        .ajouteUneQuestionATiroir(
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
          unReferentiel()
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
        adaptateurTableauDeNotes,
        adaptateurTableauDeRecommandations,
        entrepots,
      ).ajouteLaReponse(diagnostic.identifiant, {
        chemin: "contexte",
        identifiant: "question-a-tiroir-",
        reponse: {
          reponse: reponseAvecQuestionATiroir.identifiant,
          questions: [
            {
              identifiant: "qcm-",
              reponses: [
                premiereReponse.identifiant,
                secondeReponse.identifiant,
              ],
            },
          ],
        },
      });

      const question = diagnostic.referentiel.contexte
        .questions[0] as QuestionDiagnostic;
      expect(question.reponseDonnee).toMatchObject({
        reponseUnique: reponseAvecQuestionATiroir.identifiant,
        reponsesMultiples: [
          {
            identifiant: "qcm-",
            reponses: new Set([
              premiereReponse.identifiant,
              secondeReponse.identifiant,
            ]),
          },
        ],
      });
    });

    it("met à jour les réponses de plusieurs questions à tiroir", async () => {
      const premiereReponse = uneReponsePossible().construis();
      const secondeReponse = uneReponsePossible().construis();
      const reponseAvecQuestionsATiroir = uneReponsePossible()
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .aChoixMultiple("tiroir 1 ?")
            .avecReponsesPossibles([
              premiereReponse,
              uneReponsePossible().construis(),
            ])
            .construis(),
        )
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .aChoixUnique("tiroir 2 ?")
            .avecReponsesPossibles([
              secondeReponse,
              uneReponsePossible().construis(),
            ])
            .construis(),
        )
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique("Question à tiroir ?")
                .avecReponsesPossibles([reponseAvecQuestionsATiroir])
                .construis(),
            )
            .construis(),
        )
        .construis();
      entrepots.diagnostic().persiste(diagnostic);

      await new ServiceDiagnostic(
        adaptateurReferentiel,
        adaptateurTableauDeNotes,
        adaptateurTableauDeRecommandations,
        entrepots,
      ).ajouteLaReponse(diagnostic.identifiant, {
        chemin: "contexte",
        identifiant: "question-a-tiroir-",
        reponse: {
          reponse: reponseAvecQuestionsATiroir.identifiant,
          questions: [
            {
              identifiant: "tiroir-1-",
              reponses: [premiereReponse.identifiant],
            },
            {
              identifiant: "tiroir-2-",
              reponses: [secondeReponse.identifiant],
            },
          ],
        },
      });

      const question = diagnostic.referentiel.contexte
        .questions[0] as QuestionDiagnostic;
      expect(question.reponseDonnee).toMatchObject({
        reponseUnique: reponseAvecQuestionsATiroir.identifiant,
        reponsesMultiples: [
          {
            identifiant: "tiroir-1-",
            reponses: new Set([premiereReponse.identifiant]),
          },
          {
            identifiant: "tiroir-2-",
            reponses: new Set([secondeReponse.identifiant]),
          },
        ],
      });
    });
  });

  describe("Lorsque l'on veut terminer le diagnostic", () => {
    let serviceDiagnostic: ServiceDiagnostic;
    const tableauDeNotes = unTableauDeNotes()
      .avecDesNotes([
        { q1: { "reponse-11": 0, "reponse-12": 1 } },
        { q2: { "reponse-21": 0, "reponse-22": 1 } },
        { q3: { "reponse-31": 0, "reponse-32": 1 } },
        { q4: { "reponse-41": 0, "reponse-42": 1 } },
        { q5: { "reponse-51": 0, "reponse-52": 1 } },
        { q6: { "reponse-61": 0, "reponse-62": 1 } },
        { q7: { "reponse-71": 0, "reponse-72": 1 } },
      ])
      .construis();
    const tableauDeRecommandations = unTableauDeRecommandations()
      .avecLesRecommandations([
        { q1: { niveau1: "reco 1", niveau2: "reco 12", priorisation: 1 } },
        { q2: { niveau1: "reco 2", niveau2: "reco 22", priorisation: 2 } },
        { q3: { niveau1: "reco 3", niveau2: "reco 32", priorisation: 3 } },
        { q4: { niveau1: "reco 4", niveau2: "reco 42", priorisation: 4 } },
        { q5: { niveau1: "reco 5", niveau2: "reco 52", priorisation: 5 } },
        { q6: { niveau1: "reco 6", niveau2: "reco 62", priorisation: 6 } },
        { q7: { niveau1: "reco 7", niveau2: "reco 72", priorisation: 7 } },
      ])
      .construis();
    beforeEach(() => {
      serviceDiagnostic = new ServiceDiagnostic(
        adaptateurReferentiel,
        adaptateurTableauDeNotes,
        adaptateurTableauDeRecommandations,
        entrepots,
      );
    });
    it("génère les recommandations", async () => {
      const questions = uneListeDeQuestions()
        .dontLesLabelsSont(["q1", "q2", "q3", "q4", "q5", "q6", "q7"])
        .avecLesReponsesPossiblesSuivantes([
          ["reponse 11", "reponse 12"],
          ["reponse 21", "reponse 22"],
          ["reponse 31", "reponse 32"],
          ["reponse 41", "reponse 42"],
          ["reponse 51", "reponse 52"],
          ["reponse 61", "reponse 62"],
          ["reponse 71", "reponse 72"],
        ])
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique("thematique", questions)
            .construis(),
        )
        .avecLesReponsesDonnees("thematique", [
          { q1: "reponse-11" },
          { q2: "reponse-21" },
          { q3: "reponse-31" },
          { q4: "reponse-41" },
          { q5: "reponse-51" },
          { q6: "reponse-61" },
          { q7: "reponse-71" },
        ])
        .avecUnTableauDeNotes(tableauDeNotes)
        .avecUnTableauDeRecommandations(tableauDeRecommandations)
        .construis();
      entrepots.diagnostic().persiste(diagnostic);

      await serviceDiagnostic.termine(diagnostic.identifiant);

      expect(diagnostic.recommandations).toStrictEqual([
        { recommandation: "reco 1", noteObtenue: 0, priorisation: 1 },
        { recommandation: "reco 2", noteObtenue: 0, priorisation: 2 },
        { recommandation: "reco 3", noteObtenue: 0, priorisation: 3 },
        { recommandation: "reco 4", noteObtenue: 0, priorisation: 4 },
        { recommandation: "reco 5", noteObtenue: 0, priorisation: 5 },
        { recommandation: "reco 6", noteObtenue: 0, priorisation: 6 },
        { recommandation: "reco 7", noteObtenue: 0, priorisation: 7 },
      ]);
    });
  });
});
