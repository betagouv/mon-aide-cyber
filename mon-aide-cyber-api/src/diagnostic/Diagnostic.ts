import crypto from 'crypto';
import { Question, Recommandation, Referentiel } from './Referentiel';
import { Entrepot } from '../domaine/Entrepot';
import { CorpsReponse } from './ServiceDiagnostic';
import { Note } from './Note';
import {
  NiveauDeRecommandation,
  TableauDeRecommandations,
} from './TableauDeRecommandations';
import { StrategieDeReponse } from './StrategieDeReponse';
import { MoteurDeNote, NotesDiagnostic } from './MoteurDeNote';
import { MoteurDeRecommandations } from './MoteurDeRecommandations';

type Thematique = string;

type ReponsesMultiples = { identifiant: string; reponses: Set<string> };
type ReponseMultiple = {
  identifiant: string | null;
  reponses: ReponsesMultiples[];
};
type ReponseLibre = { identifiant: string; reponse: string };

type TypesDeReponseDonnee =
  | string
  | ReponseLibre
  | ReponseMultiple
  | null
  | undefined;

type ReponseDonnee = {
  reponseUnique: string | ReponseLibre | null;
  reponse?: TypesDeReponseDonnee;
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

type RecommandationDiagnostic = Omit<
  Recommandation,
  'identifiant' | 'niveau' | 'noteObtenue'
> & { niveau: NiveauDeRecommandation; priorisation: number; repondA: string };

type RecommandationPriorisee = {
  titre: string;
  pourquoi: string;
  comment: string;
  noteObtenue: Note;
  priorisation: number;
};
type Recommandations = {
  recommandationsPrioritaires: RecommandationPriorisee[];
  autresRecommandations: RecommandationPriorisee[];
};
type Diagnostic = {
  identifiant: crypto.UUID;
  recommandations?: Recommandations;
  referentiel: ReferentielDiagnostic;
  tableauDesRecommandations: TableauDeRecommandations;
};
type EntrepotDiagnostic = Entrepot<Diagnostic>;
const initialiseDiagnostic = (
  r: Referentiel,
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
              },
            }) as QuestionDiagnostic,
        ),
      },
    };
  }, {});
  return {
    identifiant: crypto.randomUUID(),
    referentiel,
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
      MoteurDeRecommandations.genere(
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

const estReponseMultiple = (
  reponse: TypesDeReponseDonnee,
): reponse is ReponseMultiple => {
  return (
    reponse !== null &&
    reponse !== undefined &&
    (reponse as ReponseMultiple).identifiant !== undefined &&
    (reponse as ReponseMultiple).reponses !== undefined &&
    (reponse as ReponseMultiple).reponses !== null
  );
};

const estReponseSimple = (reponse: TypesDeReponseDonnee): reponse is string => {
  return (
    reponse !== null && reponse !== undefined && typeof reponse === 'string'
  );
};

const estReponseLibre = (
  reponse: TypesDeReponseDonnee,
): reponse is ReponseLibre => {
  return (
    reponse !== null &&
    reponse !== undefined &&
    (reponse as ReponseLibre).reponse !== undefined &&
    (reponse as ReponseLibre).reponse !== null &&
    (reponse as ReponseLibre).identifiant !== undefined &&
    (reponse as ReponseLibre).identifiant !== null
  );
};

export {
  Diagnostic,
  EntrepotDiagnostic,
  QuestionDiagnostic,
  QuestionsThematique,
  RecommandationDiagnostic,
  RecommandationPriorisee,
  Recommandations,
  ReponseDonnee,
  ReponseLibre,
  ReponseMultiple,
  ReponsesMultiples,
  ReferentielDiagnostic,
  Thematique,
  TypesDeReponseDonnee,
  ajouteLaReponseAuDiagnostic,
  estReponseLibre,
  estReponseMultiple,
  estReponseSimple,
  genereLesRecommandations,
  initialiseDiagnostic,
};
