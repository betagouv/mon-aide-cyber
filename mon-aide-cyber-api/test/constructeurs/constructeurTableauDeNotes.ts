import { Constructeur } from "./constructeur";
import { Note, TableauDeNotes } from "../../src/diagnostic/TableauDeNotes";
import { fakerFR } from "@faker-js/faker";

class ConstruceurDeTableauDeNotes implements Constructeur<TableauDeNotes> {
  private readonly notes: { [p: string]: Note }[] = [];

  avecDesNotes(notes: { [p: string]: Note }[]): ConstruceurDeTableauDeNotes {
    this.notes.push(...notes);
    return this;
  }

  construis(): TableauDeNotes {
    let accumulateur = {};
    this.notes.forEach((note) => {
      accumulateur = {
        ...accumulateur,
        ...Object.entries(note).reduce((accumulateur, [identifiant, note]) => {
          return { ...accumulateur, [identifiant]: note };
        }, {}),
      };
    });
    return accumulateur;
  }
}

export const unTableauDeNotes = () => new ConstruceurDeTableauDeNotes();

class ConstructeurDeNote
  implements Constructeur<{ [identifiant: string]: Note }>
{
  private identifiantReponse: string = fakerFR.string.alpha(10);
  private note: Note = null;
  identifieePar(identifiantReponse: string): ConstructeurDeNote {
    this.identifiantReponse = identifiantReponse;
    return this;
  }

  ayantPourValeur(note: Note): ConstructeurDeNote {
    this.note = note;
    return this;
  }

  construis(): { [p: string]: Note } {
    return { [this.identifiantReponse]: this.note };
  }
}

export const uneNote = () => new ConstructeurDeNote();
