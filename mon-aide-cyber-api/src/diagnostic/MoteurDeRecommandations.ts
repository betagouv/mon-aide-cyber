import { Note, RegleDeCalcul } from "./TableauDeNotes";
import { Diagnostic, QuestionDiagnostic, Recommandation } from "./Diagnostic";
import { ObjetDeRecommandation } from "./TableauDeRecommandations";

export const MoteurDeRecommandations = new Map<
  boolean,
  {
    genere: (
      diagnostic: Diagnostic,
      question: QuestionDiagnostic,
    ) => Recommandation[];
  }
>([
  [
    true,
    {
      genere: (diagnostic, question) =>
        new MoteurDeRecommandationReponseUnique(diagnostic, question).genere(),
    },
  ],
  [
    false,
    {
      genere: (diagnostic, question) =>
        new MoteurDeRecommandationReponsesMultiples(
          diagnostic,
          question,
        ).genere(),
    },
  ],
]);

abstract class MoteurDeRecommandation {
  protected recommandationTrouvee: ObjetDeRecommandation;

  constructor(
    protected readonly diagnostic: Diagnostic,
    protected readonly question: QuestionDiagnostic,
  ) {
    this.recommandationTrouvee =
      this.diagnostic.tableauDesRecommandations[this.question.identifiant];
  }

  genere(): Recommandation[] {
    if (!this.diagnostic.tableauDesNotes[this.question.identifiant]) {
      return [];
    }
    return Object.entries(
      this.diagnostic.tableauDesNotes[this.question.identifiant],
    )
      .filter(([identifiantReponse, note]) =>
        this.filtre(identifiantReponse, note),
      )
      .map(([, note]) => this.enTantQue(note))
      .map((note) => {
        const noteCalculee: Note = this.calculeLaNote(note);
        const recommandation =
          (noteCalculee && noteCalculee > 0
            ? this.recommandationTrouvee.niveau2
            : this.recommandationTrouvee.niveau1) || "";
        return {
          recommandation: recommandation,
          noteObtenue: noteCalculee,
          priorisation: this.recommandationTrouvee.priorisation,
        };
      })
      .filter((reco) => reco.noteObtenue !== null);
  }

  abstract filtre(
    identifiantReponse: string,
    note: Note | RegleDeCalcul,
  ): boolean;

  abstract enTantQue(note: Note | RegleDeCalcul): Note | RegleDeCalcul;
  abstract calculeLaNote(note: Note | RegleDeCalcul): Note;
}

class MoteurDeRecommandationReponseUnique extends MoteurDeRecommandation {
  filtre(identifiantReponse: string, __: Note | RegleDeCalcul): boolean {
    return this.question.reponseDonnee.reponseUnique === identifiantReponse;
  }

  enTantQue(note: Note): Note {
    return note;
  }
  calculeLaNote(note: Note): Note {
    return note;
  }
}

class MoteurDeRecommandationReponsesMultiples extends MoteurDeRecommandation {
  enTantQue(note: RegleDeCalcul): RegleDeCalcul {
    return note;
  }
  filtre(__: string, note: Note | RegleDeCalcul): boolean {
    return estRegleDeCalcul(note);
  }

  calculeLaNote(regleDeCalcul: RegleDeCalcul): Note {
    const reponsesDonnees =
      this.question.reponseDonnee.reponsesMultiples.flatMap((rep) =>
        Array.from(rep.reponses),
      );
    const notes = Object.entries(regleDeCalcul.reponses)
      .filter(([rep]) => reponsesDonnees.includes(rep))
      .map(([, note]) => note);
    const note =
      notes.reduce((note1: number, note2) => somme(note1, note2), 0) /
      notes.length;
    return note as Note;
  }
}

const somme = (note1: number, note2: Note): number => {
  return note1 + (note2 as number);
};

const estRegleDeCalcul = (
  note: Note | RegleDeCalcul,
): note is RegleDeCalcul => {
  return note !== null && typeof note !== "number" && "operation" in note;
};
