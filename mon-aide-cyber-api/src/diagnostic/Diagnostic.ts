import crypto from 'crypto';
import { Question, Recommandation, Referentiel } from './Referentiel';
import { Entrepot } from '../domaine/Entrepot';
import { CorpsReponse } from './ServiceDiagnostic';
import { laValeurEstDefinie, Valeur } from './Indice';
import {
  NiveauDeRecommandation,
  TableauDeRecommandations,
} from './TableauDeRecommandations';
import { StrategieDeReponse } from './StrategieDeReponse';
import { MoteurIndice, ValeursDesIndicesAuDiagnostic } from './MoteurIndice';
import { MoteurDeRecommandations } from './MoteurDeRecommandations';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { MoteurDesIndicateurs } from './MoteurDesIndicateurs';

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
  'identifiant' | 'niveau'
> & { niveau: NiveauDeRecommandation; priorisation: number; repondA: string };

export type RecommandationPriorisee = {
  titre: string;
  pourquoi: string;
  comment: string;
  valeurObtenue: Valeur;
  priorisation: number;
};
export type Recommandations = {
  recommandationsPrioritaires: RecommandationPriorisee[];
  autresRecommandations: RecommandationPriorisee[];
};

type Indicateurs = {
  [thematique: string]: { moyennePonderee: number };
};

export type Restitution = {
  indicateurs?: Indicateurs;
  recommandations?: Recommandations;
};
type Diagnostic = {
  dateCreation: Date;
  dateDerniereModification: Date;
  identifiant: crypto.UUID;
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
            }) as QuestionDiagnostic,
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

const genereLaRestitution = (diagnostic: Diagnostic) => {
  const valeursDesIndices =
    MoteurIndice.genereLesIndicesDesReponses(diagnostic);
  const indicateurs =
    MoteurDesIndicateurs.genereLesIndicateurs(valeursDesIndices);
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
    valeursDesIndices: ValeursDesIndicesAuDiagnostic,
  ): RecommandationPriorisee[] => {
    return recommandations
      .map((recommandation) => {
        const valeurObtenue = Object.values(valeursDesIndices)
          .flatMap((valeurReponse) => valeurReponse)
          .find(
            (valeurReponse) =>
              valeurReponse.identifiant === recommandation.repondA,
          )?.indice;
        return {
          titre: recommandation.niveau.titre,
          pourquoi: recommandation.niveau.pourquoi,
          comment: recommandation.niveau.comment,
          priorisation: recommandation.priorisation,
          valeurObtenue: valeurObtenue,
        } as RecommandationPriorisee;
      })
      .filter(
        (reco) =>
          reco.valeurObtenue !== undefined && reco.valeurObtenue !== null,
      )
      .sort((a, b) => (a.priorisation < b.priorisation ? -1 : 1) || 0)
      .sort(
        (a, b) =>
          (laValeurEstDefinie(a.valeurObtenue) &&
          laValeurEstDefinie(b.valeurObtenue) &&
          a.valeurObtenue < b.valeurObtenue
            ? -1
            : 1) || 0,
      );
  };
  const recommandationPriorisees = prioriseLesRecommandations(
    recommandations,
    valeursDesIndices,
  );

  diagnostic.restitution = {
    indicateurs,
    recommandations: {
      recommandationsPrioritaires: recommandationPriorisees.slice(0, 6),
      autresRecommandations: recommandationPriorisees.slice(6),
    },
  };
};
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
};
