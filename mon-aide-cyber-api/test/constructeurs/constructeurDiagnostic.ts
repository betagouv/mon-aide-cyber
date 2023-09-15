import { Constructeur } from "./constructeur";
import { unReferentiel } from "./constructeurReferentiel";
import {
  Diagnostic,
  initialiseDiagnostic,
  QuestionDiagnostic,
  ReponseDonnee,
  ReponsesMultiples,
} from "../../src/diagnostic/Diagnostic";
import {
  Referentiel,
  ReponsePossible,
  TypeQuestion,
} from "../../src/diagnostic/Referentiel";
import { unTableauDeNotes } from "./constructeurTableauDeNotes";
import { TableauDeNotes } from "../../src/diagnostic/TableauDeNotes";
import { TableauDeRecommandations } from "../../src/diagnostic/TableauDeRecommandations";
import { unTableauDeRecommandations } from "./constructeurTableauDeRecommandations";
import { fakerFR } from "@faker-js/faker";

class ConstructeurDiagnostic implements Constructeur<Diagnostic> {
  private referentiel: Referentiel = unReferentiel().construis();
  private tableauDeNotes = unTableauDeNotes().construis();
  private tableauDeRecommandations: TableauDeRecommandations =
    unTableauDeRecommandations().construis();
  private reponsesDonnees: {
    identifiant: { thematique: string; question: string };
    reponseDonnee: ReponseDonnee;
  }[] = [];

  avecUnReferentiel(referentiel: Referentiel): ConstructeurDiagnostic {
    this.referentiel = referentiel;
    return this;
  }

  avecLesReponsesDonnees(
    thematique: string,
    reponses: { [question: string]: string | string[] }[],
  ): ConstructeurDiagnostic {
    reponses.forEach((rep) => {
      Object.entries(rep).forEach(([question, valeur]) => {
        const constructeurReponseDonnee = uneReponseDonnee();
        if (typeof valeur === "string") {
          constructeurReponseDonnee.ayantPourReponse(valeur);
        } else {
          constructeurReponseDonnee.avecDesReponsesMultilpes([
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

  ajouteUneReponseDonnee = (
    identifiant: { thematique: string; question: string },
    reponseDonnee: ReponseDonnee,
  ): ConstructeurDiagnostic => {
    this.reponsesDonnees.push({ identifiant, reponseDonnee });
    return this;
  };

  construis(): Diagnostic {
    const diagnostic = initialiseDiagnostic(
      this.referentiel,
      this.tableauDeNotes,
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

class ConstructeurReponseDonnee implements Constructeur<ReponseDonnee> {
  private reponseUnique: string | null = null;
  private reponsesMultiples: ReponsesMultiples[] = [];
  ayantPourReponse(reponse: string): ConstructeurReponseDonnee {
    this.reponseUnique = reponse;
    return this;
  }

  avecDesReponsesMultilpes(
    reponsesMultiples: { identifiant: string; reponses: string[] }[],
  ): ConstructeurReponseDonnee {
    this.reponsesMultiples = reponsesMultiples.map((rep) => ({
      identifiant: rep.identifiant,
      reponses: new Set(rep.reponses),
    }));
    return this;
  }

  construis(): ReponseDonnee {
    return {
      reponseUnique: this.reponseUnique,
      reponsesMultiples: this.reponsesMultiples,
    };
  }
}

class ConstructeurQuestionDiagnostic
  implements Constructeur<QuestionDiagnostic>
{
  private libelle = fakerFR.word.words(5);
  private reponsesPossibles: ReponsePossible[] = [];
  private identifiant = fakerFR.string.alpha(10);
  private reponseDonnee: ReponseDonnee = {
    reponseUnique: null,
    reponsesMultiples: [],
  };
  private type: TypeQuestion = "choixMultiple";

  construis(): QuestionDiagnostic {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      reponseDonnee: this.reponseDonnee,
      reponsesPossibles: this.reponsesPossibles,
      type: this.type,
    };
  }

  avecLesReponsesPossibles(
    reponsePossibles: ReponsePossible[],
  ): ConstructeurQuestionDiagnostic {
    this.reponsesPossibles = reponsePossibles;
    return this;
  }
}

export const unDiagnostic = () => new ConstructeurDiagnostic();

export const uneQuestionDiagnostic = () => new ConstructeurQuestionDiagnostic();

export const uneReponseDonnee = (): ConstructeurReponseDonnee =>
  new ConstructeurReponseDonnee();
