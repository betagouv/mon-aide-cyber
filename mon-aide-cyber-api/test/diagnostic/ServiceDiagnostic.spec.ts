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
import { TableauDeNotes } from "../../src/diagnostic/TableauDeNotes";

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
      expect(diagnosticRetourne.tableauDesNotes).toStrictEqual<TableauDeNotes>({
        q: {
          notation: {
            r1: 0.5,
            r2: 1,
            r0: null,
          },
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
        .avecLesReponsesPossiblesSuivantesAssociees([
          {
            libelle: "reponse 11",
            association: {
              identifiantRecommandation: "q1",
              niveauRecommandation: 1,
              note: 0,
            },
          },
          {
            libelle: "reponse 12",
            association: {
              identifiantRecommandation: "q1",
              niveauRecommandation: 2,
              note: 1,
            },
          },
          {
            libelle: "reponse 21",
            association: {
              identifiantRecommandation: "q2",
              niveauRecommandation: 1,
              note: 0,
            },
          },
          {
            libelle: "reponse 22",
            association: {
              identifiantRecommandation: "q2",
              niveauRecommandation: 2,
              note: 1,
            },
          },
          {
            libelle: "reponse 31",
            association: {
              identifiantRecommandation: "q3",
              niveauRecommandation: 1,
              note: 0,
            },
          },
          {
            libelle: "reponse 32",
            association: {
              identifiantRecommandation: "q3",
              niveauRecommandation: 2,
              note: 1,
            },
          },
          {
            libelle: "reponse 41",
            association: {
              identifiantRecommandation: "q4",
              niveauRecommandation: 1,
              note: 0,
            },
          },
          {
            libelle: "reponse 42",
            association: {
              identifiantRecommandation: "q4",
              niveauRecommandation: 2,
              note: 1,
            },
          },
          {
            libelle: "reponse 51",
            association: {
              identifiantRecommandation: "q5",
              niveauRecommandation: 1,
              note: 0,
            },
          },
          {
            libelle: "reponse 52",
            association: {
              identifiantRecommandation: "q5",
              niveauRecommandation: 2,
              note: 1,
            },
          },
          {
            libelle: "reponse 61",
            association: {
              identifiantRecommandation: "q6",
              niveauRecommandation: 1,
              note: 0,
            },
          },
          {
            libelle: "reponse 62",
            association: {
              identifiantRecommandation: "q6",
              niveauRecommandation: 2,
              note: 1,
            },
          },
          {
            libelle: "reponse 71",
            association: {
              identifiantRecommandation: "q7",
              niveauRecommandation: 1,
              note: 0,
            },
          },
          {
            libelle: "reponse 72",
            association: {
              identifiantRecommandation: "q7",
              niveauRecommandation: 2,
              note: 1,
            },
          },
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
        .avecUnTableauDeRecommandations(tableauDeRecommandations)
        .construis();
      await entrepots.diagnostic().persiste(diagnostic);

      await serviceDiagnostic.termine(diagnostic.identifiant);

      expect(
        diagnostic.recommandations?.recommandationsPrioritaires,
      ).toStrictEqual([
        {
          noteObtenue: 0,
          priorisation: 1,
          titre: "reco 1",
          pourquoi: "parce-que",
          comment: "comme ça",
        },
        {
          noteObtenue: 0,
          priorisation: 2,
          titre: "reco 2",
          pourquoi: "parce-que",
          comment: "comme ça",
        },
        {
          noteObtenue: 0,
          priorisation: 3,
          titre: "reco 3",
          pourquoi: "parce-que",
          comment: "comme ça",
        },
        {
          noteObtenue: 0,
          priorisation: 4,
          titre: "reco 4",
          pourquoi: "parce-que",
          comment: "comme ça",
        },
        {
          noteObtenue: 0,
          priorisation: 5,
          titre: "reco 5",
          pourquoi: "parce-que",
          comment: "comme ça",
        },
        {
          noteObtenue: 0,
          priorisation: 6,
          titre: "reco 6",
          pourquoi: "parce-que",
          comment: "comme ça",
        },
      ]);
      expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual([
        {
          titre: "reco 7",
          pourquoi: "parce-que",
          comment: "comme ça",
          noteObtenue: 0,
          priorisation: 7,
        },
      ]);
    });
  });
});
