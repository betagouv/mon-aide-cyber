import { Note, RegleDeCalcul } from "./TableauDeNotes";
import {
  Diagnostic,
  QuestionDiagnostic,
  RecommandationPriorisee,
} from "./Diagnostic";
import { ObjetDeRecommandation } from "./TableauDeRecommandations";

export const MoteurDeRecommandations = new Map<
  boolean,
  {
    genere: (
      diagnostic: Diagnostic,
      question: QuestionDiagnostic,
    ) => RecommandationPriorisee[];
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

abstract class MoteurDeRecommandationPriorisee {
  protected recommandationTrouvee: ObjetDeRecommandation;

  constructor(
    protected readonly diagnostic: Diagnostic,
    protected readonly question: QuestionDiagnostic,
  ) {
    this.recommandationTrouvee =
      this.diagnostic.tableauDesRecommandations[this.question.identifiant];
  }

  genere(): RecommandationPriorisee[] {
    if (!this.diagnostic.tableauDesNotes[this.question.identifiant]) {
      return [];
    }
    return Object.entries(
      this.diagnostic.tableauDesNotes[this.question.identifiant].notation,
    )
      .filter(([identifiantReponse, note]) =>
        this.filtre(identifiantReponse, note),
      )
      .map(([__, note]) => this.enTantQue(note))
      .map((note) => {
        return this.calculeLaNote(note);
      })
      .map((noteCalculee) => {
        const recommandation =
          (noteCalculee && noteCalculee > 0
            ? this.recommandationTrouvee.niveau2 ||
              this.recommandationTrouvee.niveau1
            : this.recommandationTrouvee.niveau1) || undefined;
        return {
          titre: recommandation?.titre || "",
          pourquoi: recommandation?.pourquoi || "",
          comment: recommandation?.comment || "",
          noteObtenue: noteCalculee,
          priorisation: this.recommandationTrouvee.priorisation,
        };
      });
  }

  abstract filtre(
    identifiantReponse: string,
    note: Note | RegleDeCalcul,
  ): boolean;

  abstract enTantQue(note: Note | RegleDeCalcul): Note | RegleDeCalcul;
  abstract calculeLaNote(note: Note | RegleDeCalcul): Note;
}

class MoteurDeRecommandationReponseUnique extends MoteurDeRecommandationPriorisee {
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

class MoteurDeRecommandationReponsesMultiples extends MoteurDeRecommandationPriorisee {
  enTantQue(note: RegleDeCalcul): RegleDeCalcul {
    return note;
  }

  filtre(identifiantReponse: string, note: Note | RegleDeCalcul): boolean {
    const identifiantsReponsesTiroir = this.question.reponsesPossibles
      .filter((reponse) => reponse.identifiant === identifiantReponse)
      .map((reponse) => reponse.questions)
      .flatMap(
        (question) =>
          question?.flatMap((question) =>
            question.reponsesPossibles.map((reponse) => reponse.identifiant),
          ),
      );
    return (
      this.question.reponseDonnee.reponsesMultiples
        .flatMap((reponses) => Array.from(reponses.reponses))
        .some((reponse) => identifiantsReponsesTiroir.includes(reponse)) &&
      estRegleDeCalcul(note)
    );
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

const estUnNombre = (note: Note): boolean => {
  return typeof note === "number";
};
const estRegleDeCalcul = (
  note: Note | RegleDeCalcul,
): note is RegleDeCalcul => {
  return (
    note !== undefined &&
    note !== null &&
    typeof note !== "number" &&
    "operation" in note
  );
};
