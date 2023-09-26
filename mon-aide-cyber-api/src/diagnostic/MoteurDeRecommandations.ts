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
            : this.recommandationTrouvee.niveau1) || undefined;
        return {
          titre: recommandation?.titre || "",
          pourquoi: recommandation?.pourquoi || "",
          comment: recommandation?.comment || "",
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
    return notes
      .reduce(
        (note1: CalculateurDeNote, note2) => note1.ajoute(note2),
        new CalculateurDeNote(0),
      )
      .divise(notes.length).note;
  }
}

class CalculateurDeNote {
  constructor(private _note: Note) {}

  get note(): Note {
    return this._note;
  }

  public ajoute(note: Note) {
    this._note =
      estUnNombre(this._note) && estUnNombre(note)
        ? (((this._note as number) + (note as number)) as Note)
        : null;
    return this;
  }

  public divise(nombre: number) {
    this._note = estUnNombre(this._note)
      ? (((this._note as number) / nombre) as Note)
      : null;
    return this;
  }
}

function estUnNombre(note: Note): boolean {
  return typeof note === "number";
}
const estRegleDeCalcul = (
  note: Note | RegleDeCalcul,
): note is RegleDeCalcul => {
  return note !== null && typeof note !== "number" && "operation" in note;
};
