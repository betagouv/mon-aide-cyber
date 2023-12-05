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
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

export type Thematique = string;

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

export type ReferentielDiagnostic = {
  [clef: Thematique]: QuestionsThematique;
};

export type RecommandationDiagnostic = Omit<
  Recommandation,
  'identifiant' | 'niveau' | 'noteObtenue'
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

export type Restitution = {
  recommandations?: Recommandations;
};

type Diagnostic = {
  dateCreation: Date;
  dateDerniereModification: Date;
  identifiant: crypto.UUID;
  recommandations?: Recommandations;
  restitution?: Restitution;
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
                reponsesMultiples: [],
              },
            } as QuestionDiagnostic),
        ),
      },
    };
  }, {});
  return {
    dateCreation: FournisseurHorloge.maintenant(),
    dateDerniereModification: FournisseurHorloge.maintenant(),
    identifiant: crypto.randomUUID(),
    referentiel,
    tableauDesRecommandations,
  };
};

const ajouteLaReponseAuDiagnostic = (
  diagnostic: Diagnostic,
  corpsReponse: CorpsReponse,
) => {
  diagnostic.dateDerniereModification = FournisseurHorloge.maintenant();
  const questions = diagnostic.referentiel[corpsReponse.chemin].questions;
  const questionTrouvee = questions.find(
    (q) => q.identifiant === corpsReponse.identifiant,
  );
  if (questionTrouvee !== undefined) {
    StrategieDeReponse.pour(corpsReponse).applique(questionTrouvee);
  }
};

const genereLesRecommandations = (diagnostic: Diagnostic) => {
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

  diagnostic.restitution = {
    recommandations: {
      recommandationsPrioritaires: recommandationPriorisees.slice(0, 6),
      autresRecommandations: recommandationPriorisees.slice(6),
    },
  };
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
