import { Constructeur } from './constructeur';
import { unReferentiel } from './constructeurReferentiel';
import {
  Diagnostic,
  initialiseDiagnostic,
  QuestionDiagnostic,
  ReponseDonnee,
  ReponseLibre,
  ReponseMultiple,
  ReponsesMultiples,
} from '../../src/diagnostic/Diagnostic';
import {
  Referentiel,
  ReponsePossible,
  TypeQuestion,
} from '../../src/diagnostic/Referentiel';
import { TableauDeRecommandations } from '../../src/diagnostic/TableauDeRecommandations';
import { unTableauDeRecommandations } from './constructeurTableauDeRecommandations';
import { fakerFR } from '@faker-js/faker';

class ConstructeurDiagnostic implements Constructeur<Diagnostic> {
  private referentiel: Referentiel = unReferentiel().construis();
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
  avecLaReponseDonnee(
    thematique: string,
    reponse: { [identifiantQuestion: string]: string[] },
  ): ConstructeurDiagnostic {
    Object.entries(reponse).forEach(([identifiantQuestion, valeur]) => {
      this.ajouteUneReponseDonnee(
        { thematique, question: identifiantQuestion },
        uneReponseDonnee()
          .avecUneReponse(identifiantQuestion, valeur)
          .construis(),
      );
    });
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

class ConstructeurNouvelleReponseDonnee implements Constructeur<ReponseDonnee> {
  private reponse: string | ReponseLibre | ReponseMultiple | null = null;

  reponseSimple(reponse: string): ConstructeurNouvelleReponseDonnee {
    this.reponse = reponse;
    return this;
  }

  reponseLibre(
    identifiant: string,
    reponse: string,
  ): ConstructeurNouvelleReponseDonnee {
    this.reponse = { identifiant, reponse };
    return this;
  }

  reponseMultiple(
    identifiant: string,
    reponses: { identifiant: string; reponses: string[] }[],
  ): ConstructeurNouvelleReponseDonnee {
    this.reponse = {
      identifiant,
      reponses: reponses.map((rep) => ({
        ...rep,
        reponses: new Set(rep.reponses),
      })),
    };
    return this;
  }

  construis(): ReponseDonnee {
    return {
      reponse: this.reponse,
      reponseUnique: null,
      reponsesMultiples: [],
    };
  }
}

class ConstructeurReponseDonnee implements Constructeur<ReponseDonnee> {
  private reponseUnique: string | null = null;
  private reponsesMultiples: ReponsesMultiples[] = [];
  reponse?: string | ReponseLibre | ReponseMultiple | null;
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

  avecUneReponse(
    identifiantQuestion: string,
    valeur: string[],
  ): ConstructeurReponseDonnee {
    this.reponse = {
      identifiant: null,
      reponses: [
        { identifiant: identifiantQuestion, reponses: new Set(valeur) },
      ],
    };
    return this;
  }

  construis(): ReponseDonnee {
    return {
      reponseUnique: this.reponseUnique,
      reponsesMultiples: this.reponsesMultiples,
      ...(this.reponse && { reponse: this.reponse }),
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
  private type: TypeQuestion = 'choixMultiple';

  avecLesReponsesPossibles(
    reponsePossibles: ReponsePossible[],
  ): ConstructeurQuestionDiagnostic {
    this.reponsesPossibles = reponsePossibles;
    return this;
  }

  ayantLaReponseUnique(
    identifiantReponse: string,
  ): ConstructeurQuestionDiagnostic {
    this.reponseDonnee.reponseUnique = identifiantReponse;
    this.reponseDonnee.reponse = identifiantReponse;
    return this;
  }

  avecLibelle(libelle: string): ConstructeurQuestionDiagnostic {
    this.libelle = libelle;
    return this;
  }

  ayantLaReponseDonnee(
    reponseDonnee: ReponseDonnee,
  ): ConstructeurQuestionDiagnostic {
    this.reponseDonnee = reponseDonnee;
    return this;
  }

  construis(): QuestionDiagnostic {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      reponseDonnee: this.reponseDonnee,
      reponsesPossibles: this.reponsesPossibles,
      type: this.type,
    };
  }
}

export const unDiagnostic = () => new ConstructeurDiagnostic();

export const uneQuestionDiagnostic = () => new ConstructeurQuestionDiagnostic();

export const uneReponseDonnee = (): ConstructeurReponseDonnee =>
  new ConstructeurReponseDonnee();

export const uneNouvelleReponseDonnee = (): ConstructeurNouvelleReponseDonnee =>
  new ConstructeurNouvelleReponseDonnee();
