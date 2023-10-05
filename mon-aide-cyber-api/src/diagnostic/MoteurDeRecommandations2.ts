import { QuestionDiagnostic, Recommandation } from "./Diagnostic";
import { TableauDeRecommandations } from "./TableauDeRecommandations";
import { NiveauRecommandation } from "./Referentiel";
import { Note } from "./TableauDeNotes";

export const MoteurDeRecommandations2 = new Map<
  boolean,
  {
    genere: (
      question: QuestionDiagnostic,
      tableauDeRecommandations: TableauDeRecommandations,
    ) => Recommandation[];
  }
>([
  [
    true,
    {
      genere: (question, tableauDeRecommandations) =>
        new MoteurDeRecommandation2ReponseUnique(
          question,
          tableauDeRecommandations,
        ).genere(),
    },
  ],
  [
    false,
    {
      genere: (question, tableauDeRecommandations) =>
        new MoteurDeRecommandation2ReponsesMultiples(
          question,
          tableauDeRecommandations,
        ).genere(),
    },
  ],
]);

abstract class MoteurDeRecommandation2 {
  constructor(
    protected readonly question: QuestionDiagnostic,
    protected readonly tableauDeRecommandations: TableauDeRecommandations,
  ) {}

  genere(): Recommandation[] {
    return this.filtre()
      .map((rec) => ({
        recommandationTrouvee: this.tableauDeRecommandations[rec.identifiant],
        niveau: rec.niveau,
        noteObtenue: rec.noteObtenue,
      }))
      .flatMap((rec) => {
        return [
          {
            niveau:
              rec.niveau === 1
                ? rec.recommandationTrouvee.niveau1
                : rec.recommandationTrouvee.niveau2!,
            noteObtenue: rec.noteObtenue,
            priorisation: rec.recommandationTrouvee.priorisation as number,
          },
        ];
      });
  }

  abstract filtre(): {
    identifiant: string;
    niveau: NiveauRecommandation;
    noteObtenue: Note;
  }[];
}

class MoteurDeRecommandation2ReponsesMultiples extends MoteurDeRecommandation2 {
  filtre() {
    return this.question.reponsesPossibles
      .flatMap(
        (rep) => rep.questions?.flatMap((q) => q.reponsesPossibles) || [],
      )
      .filter((rep) =>
        this.question.reponseDonnee.reponsesMultiples
          .flatMap((rep) => Array.from(rep.reponses))
          .includes(rep.identifiant),
      )
      .flatMap((rep) => rep.recommandations || []);
  }
}

class MoteurDeRecommandation2ReponseUnique extends MoteurDeRecommandation2 {
  filtre() {
    return this.question.reponsesPossibles
      .filter(
        (rep) => rep.identifiant === this.question.reponseDonnee.reponseUnique,
      )
      .flatMap((rep) => rep.recommandations || []);
  }
}
