import crypto from "crypto";
import { Question, Recommandation, Referentiel } from "./Referentiel";
import { Entrepot } from "../domaine/Entrepot";
import { CorpsReponse } from "./ServiceDiagnostic";
import { Note, TableauDeNotes } from "./TableauDeNotes";
import {
  NiveauDeRecommandation,
  TableauDeRecommandations,
} from "./TableauDeRecommandations";
import { StrategieDeReponse } from "./StrategieDeReponse";
import { MoteurDeNote, NotesDiagnostic } from "./MoteurDeNote";
import { MoteurDeRecommandation2 } from "./MoteurDeRecommandations2";

type Thematique = string;

type ReponsesMultiples = { identifiant: string; reponses: Set<string> };
type ReponseDonnee = {
  reponsesMultiples: ReponsesMultiples[];
  reponseUnique: string | null;
};
type QuestionDiagnostic = Question & {
  reponseDonnee: ReponseDonnee;
};

export type QuestionsThematique = {
  questions: QuestionDiagnostic[];
};

type ReferentielDiagnostic = {
  [clef: Thematique]: QuestionsThematique;
};

export type RecommandationDiagnostic = Omit<
  Recommandation,
  "identifiant" | "niveau" | "noteObtenue"
> & { niveau: NiveauDeRecommandation; priorisation: number; repondA: string };

export type RecommandationPriorisee = {
  titre: string;
  pourquoi: string;
  comment: string;
  noteObtenue: Note;
  priorisation: number;
};
export type Recommandations = {
  recommandationsPrioritaires: RecommandationPriorisee[];
  autresRecommandations: RecommandationPriorisee[];
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
  const notes = MoteurDeNote.genereLesNotes(diagnostic);
  const recommandations = Object.entries(diagnostic.referentiel)
    .flatMap(([__, questions]) => questions.questions)
    .flatMap((question) =>
      MoteurDeRecommandation2.genere(
        question,
        diagnostic.tableauDesRecommandations,
      ),
    );

  const prioriseLesRecommandations = (
    recommandations: RecommandationDiagnostic[],
    notes: NotesDiagnostic,
  ): RecommandationPriorisee[] => {
    return recommandations
      .map((recommandation) => {
        const note = Object.values(notes)
          .flatMap((note) => note)
          .find((note) => note.identifiant === recommandation.repondA)?.note;
        return {
          titre: recommandation.niveau.titre,
          pourquoi: recommandation.niveau.pourquoi,
          comment: recommandation.niveau.comment,
          priorisation: recommandation.priorisation,
          noteObtenue: note,
        };
      })
      .filter(
        (reco) => reco.noteObtenue !== null && reco.noteObtenue !== undefined,
      )
      .sort((a, b) => (a.priorisation < b.priorisation ? -1 : 1) || 0)
      .sort((a, b) => (a.noteObtenue! < b.noteObtenue! ? -1 : 1) || 0);
  };
  const recommandationPriorisees = prioriseLesRecommandations(
    recommandations,
    notes,
  );

  diagnostic.recommandations.recommandationsPrioritaires =
    recommandationPriorisees.slice(0, 6);
  diagnostic.recommandations.autresRecommandations =
    recommandationPriorisees.slice(6);
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
