import { Constructeur } from "./constructeur";
import { unReferentiel } from "./constructeurReferentiel";
import {
  Diagnostic,
  initialiseDiagnostic,
} from "../../src/diagnostic/Diagnostic";
import { Referentiel } from "../../src/diagnostic/Referentiel";
import { unTableauDeNotes } from "./constructeurTableauDeNotes";
import { TableauDeNotes } from "../../src/diagnostic/TableauDeNotes";
import { TableauDeRecommandations } from "../../src/diagnostic/TableauDeRecommandations";
import { unTableauDeRecommandations } from "./constructeurTableauDeRecommandations";

class ConstructeurDiagnostic implements Constructeur<Diagnostic> {
  private referentiel: Referentiel = unReferentiel().construis();
  private tableauDeNotes = unTableauDeNotes().construis();
  private tableauDeRecommandations: TableauDeRecommandations =
    unTableauDeRecommandations().construis();
  private reponsesDonnees: {
    [thematique: string]: { [guestion: string]: string }[];
  } = {};

  avecUnReferentiel(referentiel: Referentiel): ConstructeurDiagnostic {
    this.referentiel = referentiel;
    return this;
  }

  avecLesReponsesDonnees(
    thematique: string,
    reponses: { [q1: string]: string }[],
  ): ConstructeurDiagnostic {
    this.reponsesDonnees = { [thematique]: reponses };
    return this;
  }

  avecUnTableauDeNotes(tableauDeNotes: TableauDeNotes): ConstructeurDiagnostic {
    this.tableauDeNotes = tableauDeNotes;
    return this;
  }

  avecUnTableauDeRecommandations(
    tableauDeRecommandations: TableauDeRecommandations,
  ): ConstructeurDiagnostic {
    this.tableauDeRecommandations = tableauDeRecommandations;
    return this;
  }

  construis(): Diagnostic {
    const diagnostic = initialiseDiagnostic(
      this.referentiel,
      this.tableauDeNotes,
      this.tableauDeRecommandations,
    );
    Object.entries(this.reponsesDonnees).forEach(([thematique, reponse]) => {
      diagnostic.referentiel[thematique].questions.forEach((q) => {
        reponse.forEach((rep) => {
          Object.entries(rep).forEach(([identifiantQuestion, rep]) => {
            if (q.identifiant === identifiantQuestion) {
              q.reponseDonnee = { reponseUnique: rep, reponsesMultiples: [] };
            }
          });
        });
      });
    });
    return diagnostic;
  }
}

export const unDiagnostic = () => new ConstructeurDiagnostic();
