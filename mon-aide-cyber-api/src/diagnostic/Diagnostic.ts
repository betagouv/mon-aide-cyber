import crypto from "crypto";
import { Question, Referentiel } from "./Referentiel";
import { Entrepot } from "../domaine/Entrepot";
import { CorpsReponse } from "./ServiceDiagnostic";
import { Note, TableauDeNotes } from "./TableauDeNotes";
import { TableauDeRecommandations } from "./TableauDeRecommandations";
import { StrategieDeReponse } from "./StrategieDeReponse";

type Thematique = string;

type ReponsesMultiples = { identifiant: string; reponses: Set<string> };
type ReponseDonnee = {
  reponsesMultiples: ReponsesMultiples[];
  reponseUnique: string | null;
};
type QuestionDiagnostic = Question & {
  reponseDonnee: ReponseDonnee;
};

type QuestionsThematique = {
  questions: QuestionDiagnostic[];
};

type ReferentielDiagnostic = {
  [clef: Thematique]: QuestionsThematique;
};

type Recommandation = {
  recommandation: string;
  noteObtenue: Note;
  priorisation: number;
};

type Recommandations = {
  recommandationsPrioritaires: Recommandation[];
  autresRecommandations: Recommandation[];
};

type Diagnostic = {
  identifiant: crypto.UUID;
  recommandations?: Recommandations;
  referentiel: ReferentielDiagnostic;
  tableauDesNotes: TableauDeNotes;
  tableauDesRecommandations: TableauDeRecommandations;
};
type EntrepotDiagnostic = Entrepot<Diagnostic>;
const initialiseDiagnostic = (
  r: Referentiel,
  tableauDesNotes: TableauDeNotes,
  tableauDesRecommandations: TableauDeRecommandations,
): Diagnostic => {
  const referentiel: {
    [clef: Thematique]: QuestionsThematique;
  } = Object.entries(r).reduce((accumulateur, [clef, questions]) => {
    return {
      ...accumulateur,
      [clef as Thematique]: {
        questions: questions.questions.map(
          (q) =>
            ({
              ...q,
              reponseDonnee: {
                reponseUnique: null,
                reponsesMultiples: [],
              },
            }) as QuestionDiagnostic,
        ),
      },
    };
  }, {});
  return {
    identifiant: crypto.randomUUID(),
    referentiel,
    tableauDesNotes,
    tableauDesRecommandations,
  };
};

const ajouteLaReponseAuDiagnostic = (
  diagnostic: Diagnostic,
  corpsReponse: CorpsReponse,
) => {
  const questions = diagnostic.referentiel[corpsReponse.chemin].questions;
  const questionTrouvee = questions.find(
    (q) => q.identifiant === corpsReponse.identifiant,
  );
  if (questionTrouvee !== undefined) {
    StrategieDeReponse.pour(corpsReponse).applique(questionTrouvee);
  }
};

const genereLesRecommandations = (diagnostic: Diagnostic) => {
  diagnostic.recommandations = {
    recommandationsPrioritaires: [],
    autresRecommandations: [],
  };
  const lesRecommandations = Object.entries(diagnostic.referentiel)
    .flatMap(([__, questions]) => questions.questions)
    .map((question) => {
      if (diagnostic.tableauDesNotes[question.identifiant]) {
        return Object.entries(diagnostic.tableauDesNotes[question.identifiant])
          .filter(
            ([identifiantReponse]) =>
              question.reponseDonnee.reponseUnique === identifiantReponse,
          )
          .map(([__, note]) => {
            const recommandationTrouvee =
              diagnostic.tableauDesRecommandations[question.identifiant];
            const recommandation =
              (note && note > 0
                ? recommandationTrouvee.niveau2
                : recommandationTrouvee.niveau1) || "";
            return {
              recommandation,
              noteObtenue: note,
              priorisation: recommandationTrouvee.priorisation,
            } as Recommandation;
          })
          .filter((reco) => reco.noteObtenue !== null);
      }
      return [];
    })
    .flatMap((reco) => reco)
    .sort((a, b) => (a.priorisation < b.priorisation ? -1 : 1) || 0)
    .sort((a, b) => (a.noteObtenue! < b.noteObtenue! ? -1 : 1) || 0);
  diagnostic.recommandations.recommandationsPrioritaires =
    lesRecommandations.slice(0, 6);
  diagnostic.recommandations.autresRecommandations =
    lesRecommandations.slice(6);
};

export {
  Diagnostic,
  EntrepotDiagnostic,
  QuestionDiagnostic,
  ReponseDonnee,
  ReponsesMultiples,
  ajouteLaReponseAuDiagnostic,
  genereLesRecommandations,
  initialiseDiagnostic,
};
