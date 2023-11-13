import {
  Diagnostic,
  QuestionDiagnostic,
  QuestionsThematique,
  ReponseDonnee,
  ReponsesMultiples,
  Thematique,
} from '../../../../../src/diagnostic/Diagnostic';
import { Constructeur } from '../../../../constructeurs/constructeur';
import { unReferentiel } from '../../../../constructeurs/constructeurReferentiel';
import { TableauDeRecommandations } from '../../../../../src/diagnostic/TableauDeRecommandations';
import { unTableauDeRecommandations } from '../../../../constructeurs/constructeurTableauDeRecommandations';
import crypto from 'crypto';
import { Referentiel } from '../../../../../src/diagnostic/Referentiel';
import { EntrepotPostgres } from '../../../../../src/infrastructure/entrepots/postgres/EntrepotPostgres';
import { DiagnosticDTO } from '../../../../../src/infrastructure/entrepots/postgres/diagnostic/EntrepotDiagnosticPostgres';

type AncienneReponseDonnee = ReponseDonnee & {
  reponsesMultiples: ReponsesMultiples[];
};
type AncienneQuestionDiagnostic = Omit<QuestionDiagnostic, 'reponseDonnee'> & {
  reponseDonnee: AncienneReponseDonnee;
};
type AnciennesQuestionsThematique = Omit<QuestionsThematique, 'questions'> & {
  questions: AncienneQuestionDiagnostic[];
};

type AncienReferentielDiagnostic = {
  [clef: string]: AnciennesQuestionsThematique;
};
type AncienDiagnostic = Omit<Diagnostic, 'referentiel'> & {
  referentiel: AncienReferentielDiagnostic;
};

export class ConstructeurAncienDiagnostic
  implements Constructeur<AncienDiagnostic>
{
  private tableauDeRecommandations: TableauDeRecommandations =
    unTableauDeRecommandations().construis();
  private referentiel: Referentiel = unReferentiel().construis();
  private reponsesDonnees: {
    identifiant: { thematique: string; question: string };
    reponseDonnee: AncienneReponseDonnee;
  }[] = [];

  avecUnReferentiel(referentiel: Referentiel): ConstructeurAncienDiagnostic {
    this.referentiel = referentiel;
    return this;
  }

  avecLesReponsesDonnees(
    thematique: string,
    reponses: { [question: string]: string | string[] }[],
  ): ConstructeurAncienDiagnostic {
    reponses.forEach((rep) => {
      Object.entries(rep).forEach(([question, valeur]) => {
        const constructeurReponseDonnee = new ConstructeurReponseDonnee();
        if (typeof valeur === 'string') {
          constructeurReponseDonnee.ayantPourReponse(valeur);
        } else {
          constructeurReponseDonnee.avecDesReponsesMultiples([
            { identifiant: question, reponses: valeur },
          ]);
        }
        this.ajouteUneReponseDonnee(
          { thematique, question: question },
          constructeurReponseDonnee.construis(),
        );
      });
    });
    return this;
  }

  ajouteUneReponseDonnee = (
    identifiant: { thematique: string; question: string },
    reponseDonnee: AncienneReponseDonnee,
  ): ConstructeurAncienDiagnostic => {
    this.reponsesDonnees.push({ identifiant, reponseDonnee });
    return this;
  };

  construis(): AncienDiagnostic {
    const diagnostic = initialiseDiagnostic(
      this.referentiel,
      this.tableauDeRecommandations,
    );
    this.reponsesDonnees.forEach((rep) => {
      const reponseDonnee = diagnostic.referentiel[
        rep.identifiant.thematique
      ].questions.find((q) => q.identifiant === rep.identifiant.question);
      if (reponseDonnee) {
        reponseDonnee.reponseDonnee = rep.reponseDonnee;
      }
    });
    return diagnostic;
  }
}

class ConstructeurReponseDonnee implements Constructeur<AncienneReponseDonnee> {
  private reponseUnique: string | null = null;
  private reponsesMultiples: ReponsesMultiples[] = [];
  ayantPourReponse(reponse: string): ConstructeurReponseDonnee {
    this.reponseUnique = reponse;
    return this;
  }

  avecDesReponsesMultiples(
    reponsesMultiples: { identifiant: string; reponses: string[] }[],
  ): ConstructeurReponseDonnee {
    this.reponsesMultiples = reponsesMultiples.map((rep) => ({
      identifiant: rep.identifiant,
      reponses: new Set(rep.reponses),
    }));
    return this;
  }

  construis(): AncienneReponseDonnee {
    return {
      reponseUnique: this.reponseUnique,
      reponsesMultiples: this.reponsesMultiples,
    };
  }
}

const initialiseDiagnostic = (
  r: Referentiel,
  tableauDesRecommandations: TableauDeRecommandations,
): AncienDiagnostic => {
  const referentiel: {
    [clef: string]: AnciennesQuestionsThematique;
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

export class EntrepotAncienDiagnosticPostgres extends EntrepotPostgres<
  AncienDiagnostic,
  DiagnosticDTO
> {
  protected champsAMettreAJour(
    entiteDTO: DiagnosticDTO,
  ): Partial<DiagnosticDTO> {
    return { donnees: entiteDTO.donnees };
  }

  protected deDTOAEntite(__: DiagnosticDTO): AncienDiagnostic {
    throw new Error('Non implémenté');
  }

  protected deEntiteADTO(entite: AncienDiagnostic): DiagnosticDTO {
    const referentiel: {
      [thematique: Thematique]: RepresentationQuestionsThematique;
    } = this.transcris(
      entite,
      <E = Set<string>, S = string[]>(reponses: E) =>
        Array.from(reponses as Set<string>) as S,
    );
    return {
      id: entite.identifiant,
      donnees: { ...entite, referentiel },
    } as DiagnosticDTO;
  }

  protected nomTable(): string {
    return 'diagnostics';
  }

  private transcris(
    entite: AncienDiagnostic,
    transformeReponsesMultiples: <E, S>(reponses: E) => S,
  ): { [thematique: Thematique]: RepresentationQuestionsThematique } {
    return Object.entries(entite.referentiel).reduce(
      (reducteur, [thematique, questions]) => ({
        ...reducteur,
        [thematique as Thematique]: {
          questions: questions.questions.map(
            (question: AncienneQuestionDiagnostic) => ({
              ...question,
              reponseDonnee: {
                ...question.reponseDonnee,
                reponsesMultiples: question.reponseDonnee.reponsesMultiples.map(
                  (rep) => ({
                    ...rep,
                    reponses: transformeReponsesMultiples(rep.reponses),
                  }),
                ),
              },
            }),
          ),
        },
      }),
      {},
    );
  }
}

type RepresentationReponsesMultiples = Omit<ReponsesMultiples, 'reponses'> & {
  reponses: string[];
};
type ReponseDonneeDTO = Omit<AncienneReponseDonnee, 'reponsesMultiples'> & {
  reponsesMultiples: RepresentationReponsesMultiples[];
};
type RepresentationQuestionDiagnostic = Omit<
  AncienneQuestionDiagnostic,
  'reponseDonnee'
> & {
  reponseDonnee: ReponseDonneeDTO;
};
type RepresentationQuestionsThematique = Omit<
  AnciennesQuestionsThematique,
  'questions'
> & {
  questions: RepresentationQuestionDiagnostic[];
};
