import crypto from 'crypto';
import { Mesure, Question, Referentiel } from './Referentiel';
import { Entrepot } from '../domaine/Entrepot';
import { laValeurEstDefinie, Valeur } from './Indice';
import { NiveauMesure, ReferentielDeMesures } from './ReferentielDeMesures';
import { StrategieDeReponse } from './StrategieDeReponse';
import { MoteurIndice, ValeursDesIndicesAuDiagnostic } from './MoteurIndice';
import { MoteurMesures } from './MoteurMesures';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { MoteurDesIndicateurs } from './MoteurDesIndicateurs';
import { CorpsReponse } from './CapteurSagaAjoutReponse';
import { Aggregat } from '../domaine/Aggregat';

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

export type MesureDiagnostic = Omit<Mesure, 'identifiant' | 'niveau'> & {
  niveau: NiveauMesure;
  priorisation: number;
  repondA: string;
};

export type MesurePriorisee = {
  titre: string;
  pourquoi: string;
  comment: string;
  valeurObtenue: Valeur;
  priorisation: number;
};

export type Mesures = {
  mesuresPrioritaires: MesurePriorisee[];
  autresMesures: MesurePriorisee[];
};

type Indicateurs = {
  [thematique: string]: { moyennePonderee: number };
};

export type Restitution = {
  indicateurs?: Indicateurs;
  mesures?: Mesures;
};

type Diagnostic = Aggregat & {
  dateCreation: Date;
  dateDerniereModification: Date;
  restitution?: Restitution;
  referentiel: ReferentielDiagnostic;
  mesures: ReferentielDeMesures;
};

type EntrepotDiagnostic = Entrepot<Diagnostic>;

const initialiseDiagnostic = (
  r: Referentiel,
  mesures: ReferentielDeMesures
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
            }) as QuestionDiagnostic
        ),
      },
    };
  }, {});
  return {
    dateCreation: FournisseurHorloge.maintenant(),
    dateDerniereModification: FournisseurHorloge.maintenant(),
    identifiant: crypto.randomUUID(),
    referentiel,
    mesures: mesures,
  };
};

const ajouteLaReponseAuDiagnostic = (
  diagnostic: Diagnostic,
  corpsReponse: CorpsReponse
) => {
  diagnostic.dateDerniereModification = FournisseurHorloge.maintenant();
  const questions = diagnostic.referentiel[corpsReponse.chemin].questions;
  const questionTrouvee = questions.find(
    (q) => q.identifiant === corpsReponse.identifiant
  );

  const appliqueLesReglesDeGestion = (questionTrouvee: QuestionDiagnostic) => {
    const reponsePossible = questionTrouvee.reponsesPossibles.find(
      (r) => r.identifiant === corpsReponse.reponse
    );
    if (reponsePossible?.regle?.strategie === 'AJOUTE_REPONSE') {
      reponsePossible?.regle?.reponses.forEach((reponse) => {
        const questions = Object.entries(diagnostic.referentiel)
          .flatMap(([_, question]) => question.questions)
          .filter(
            (questions) => questions.identifiant === reponse.identifiantQuestion
          );
        questions.forEach(
          (q) =>
            (q.reponseDonnee = {
              reponseUnique: reponse.reponseDonnee,
              reponsesMultiples: [],
            })
        );
      });
    }
  };

  if (questionTrouvee !== undefined) {
    StrategieDeReponse.pour(corpsReponse).applique(questionTrouvee);
    appliqueLesReglesDeGestion(questionTrouvee);
  }
};

const genereLaRestitution = (diagnostic: Diagnostic) => {
  const valeursDesIndices =
    MoteurIndice.genereLesIndicesDesReponses(diagnostic);
  const indicateurs =
    MoteurDesIndicateurs.genereLesIndicateurs(valeursDesIndices);
  const mesures = Object.entries(diagnostic.referentiel)
    .flatMap(([__, questions]) => questions.questions)
    .flatMap((question) => MoteurMesures.genere(question, diagnostic.mesures));

  const prioriseLesMesures = (
    mesures: MesureDiagnostic[],
    valeursDesIndices: ValeursDesIndicesAuDiagnostic
  ): MesurePriorisee[] => {
    const mesurePriorisees = mesures
      .map((mesure) => {
        const valeurObtenue = Object.values(valeursDesIndices)
          .flatMap((valeurReponse) => valeurReponse)
          .find(
            (valeurReponse) => valeurReponse.identifiant === mesure.repondA
          )?.indice;
        return {
          titre: mesure.niveau.titre,
          pourquoi: mesure.niveau.pourquoi,
          comment: mesure.niveau.comment,
          priorisation: mesure.priorisation,
          valeurObtenue: valeurObtenue,
        } as MesurePriorisee;
      })
      .filter(
        (mesure) =>
          mesure.valeurObtenue !== undefined && mesure.valeurObtenue !== null
      )
      .sort((a, b) => (a.priorisation < b.priorisation ? -1 : 1) || 0);
    const les8MesuresLesPlusPrioritaires = mesurePriorisees
      .filter((mesure) => mesure.priorisation < 9)
      .sort(
        (a, b) =>
          (laValeurEstDefinie(a.valeurObtenue) &&
          laValeurEstDefinie(b.valeurObtenue) &&
          a.valeurObtenue < b.valeurObtenue
            ? -1
            : 1) || 0
      );
    const lesAutresMesures = mesurePriorisees
      .filter((mesure) => mesure.priorisation > 8)
      .sort(
        (a, b) =>
          (laValeurEstDefinie(a.valeurObtenue) &&
          laValeurEstDefinie(b.valeurObtenue) &&
          a.valeurObtenue < b.valeurObtenue
            ? -1
            : 1) || 0
      );

    return [...les8MesuresLesPlusPrioritaires, ...lesAutresMesures];
  };
  const mesuresPriorisees = prioriseLesMesures(mesures, valeursDesIndices);

  diagnostic.restitution = {
    indicateurs,
    mesures: {
      mesuresPrioritaires: mesuresPriorisees.slice(0, 6),
      autresMesures: mesuresPriorisees.slice(6),
    },
  };
};
const ORDRE_THEMATIQUES = [
  'contexte',
  'gouvernance',
  'SecuriteAcces',
  'securiteposte',
  'securiteinfrastructure',
  'sensibilisation',
  'reaction',
];
export {
  Diagnostic,
  EntrepotDiagnostic,
  Indicateurs,
  QuestionDiagnostic,
  ReponseDonnee,
  ReponsesMultiples,
  ajouteLaReponseAuDiagnostic,
  genereLaRestitution,
  initialiseDiagnostic,
  ORDRE_THEMATIQUES,
};
