import { Constructeur } from './constructeur';
import {
  uneListeDe7QuestionsToutesAssociees,
  uneQuestion,
  unReferentiel,
} from './constructeurReferentiel';
import {
  Diagnostic,
  initialiseDiagnostic,
  QuestionDiagnostic,
  ReponseDonnee,
  ReponsesMultiples,
} from '../../src/diagnostic/Diagnostic';
import {
  QuestionChoixMultiple,
  QuestionChoixUnique,
  Referentiel,
  ReponsePossible,
  TypeQuestion,
} from '../../src/diagnostic/Referentiel';
import { ReferentielDeMesures } from '../../src/diagnostic/ReferentielDeMesures';
import { desMesures, desMesuresPour7Questions } from './constructeurMesures';
import { fakerFR } from '@faker-js/faker';
import { Poids } from '../../src/diagnostic/Indice';
import { aseptise } from '../utilitaires/aseptise';

class ConstructeurDiagnostic implements Constructeur<Diagnostic> {
  private referentiel: Referentiel = unReferentiel().construis();
  private mesures: ReferentielDeMesures = desMesures().construis();
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
    reponses: { [question: string]: string | string[] }[]
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
          constructeurReponseDonnee.construis()
        );
      });
    });
    return this;
  }

  avecDesMesures(mesures: ReferentielDeMesures): ConstructeurDiagnostic {
    this.mesures = mesures;
    return this;
  }

  ajouteUneReponseDonnee = (
    identifiant: { thematique: string; question: string },
    reponseDonnee: ReponseDonnee
  ): ConstructeurDiagnostic => {
    this.reponsesDonnees.push({ identifiant, reponseDonnee });
    return this;
  };

  ajouteAuReferentiel(
    thematique: string,
    questions: (QuestionChoixUnique | QuestionChoixMultiple)[]
  ): ConstructeurDiagnostic {
    this.referentiel[thematique] = { questions };
    return this;
  }

  construis(): Diagnostic {
    const diagnostic = initialiseDiagnostic(this.referentiel, this.mesures);
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

  avecDesReponsesMultiples(
    reponsesMultiples: { identifiant: string; reponses: string[] }[]
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
  private type: TypeQuestion = 'choixMultiple';
  private poids: Poids = 1;

  avecLesReponsesPossibles(
    reponsePossibles: ReponsePossible[]
  ): ConstructeurQuestionDiagnostic {
    this.reponsesPossibles = reponsePossibles;
    return this;
  }

  ayantLaReponseUnique(
    identifiantReponse: string
  ): ConstructeurQuestionDiagnostic {
    this.reponseDonnee.reponseUnique = identifiantReponse;
    return this;
  }

  avecLibelle(libelle: string): ConstructeurQuestionDiagnostic {
    this.identifiant = aseptise(libelle);
    this.libelle = libelle;
    return this;
  }

  ayantLaReponseDonnee(
    reponseDonnee: ReponseDonnee
  ): ConstructeurQuestionDiagnostic {
    this.reponseDonnee = reponseDonnee;
    return this;
  }

  aChoixUnique(): ConstructeurQuestionDiagnostic {
    this.type = 'choixUnique';
    return this;
  }

  construis(): QuestionDiagnostic {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      reponseDonnee: this.reponseDonnee,
      reponsesPossibles: this.reponsesPossibles,
      type: this.type,
      poids: this.poids,
    };
  }
}

export const unDiagnostic = () => new ConstructeurDiagnostic();

export const unDiagnosticCompletEnGirondeAvecDesReponsesDonnees = () =>
  unDiagnosticEnGironde()
    .ajouteAuReferentiel('thematique', uneListeDe7QuestionsToutesAssociees())
    .avecLesReponsesDonnees('thematique', septReponsesDonnees())
    .avecDesMesures(desMesuresPour7Questions());

export const unDiagnosticEnGironde = () =>
  unDiagnostic()
    .avecUnReferentiel(
      unReferentiel()
        .ajouteUneThematique('contexte', [
          uneQuestion()
            .avecIdentifiant('contexte-region-siege-social')
            .aChoixUnique('région siège social ?', [
              {
                identifiant: 'contexte-region-siege-social-nouvelle-aquitaine',
                libelle: 'Nouvelle-Aquitaine',
              },
            ])
            .construis(),
          uneQuestion()
            .avecIdentifiant('contexte-departement-tom-siege-social')
            .aChoixUnique('département siège social ?', [
              {
                identifiant: 'contexte-departement-tom-siege-social-gironde',
                libelle: 'Gironde',
              },
            ])
            .construis(),
        ])
        .construis()
    )
    .ajouteUneReponseDonnee(
      {
        thematique: 'contexte',
        question: 'contexte-region-siege-social',
      },
      uneReponseDonnee()
        .ayantPourReponse('contexte-region-siege-social-nouvelle-aquitaine')
        .construis()
    )
    .ajouteUneReponseDonnee(
      {
        thematique: 'contexte',
        question: 'contexte-departement-tom-siege-social',
      },
      uneReponseDonnee()
        .ayantPourReponse('contexte-departement-tom-siege-social-gironde')
        .construis()
    );

export const unDiagnosticDansLeDepartement = (departement: string) =>
  unDiagnostic()
    .avecUnReferentiel(
      unReferentiel()
        .ajouteUneThematique('contexte', [
          uneQuestion()
            .avecIdentifiant('contexte-departement-tom-siege-social')
            .aChoixUnique('département ?', [
              {
                identifiant: `contexte-departement-tom-siege-social-${departement}`,
                libelle: departement,
              },
            ])
            .construis(),
        ])
        .construis()
    )
    .ajouteUneReponseDonnee(
      {
        thematique: 'contexte',
        question: 'contexte-departement-tom-siege-social',
      },
      uneReponseDonnee()
        .ayantPourReponse(
          `contexte-departement-tom-siege-social-${departement}`
        )
        .construis()
    );

export const unDiagnosticAvecSecteurActivite = (secteurActivite: string) =>
  unDiagnostic()
    .avecUnReferentiel(
      unReferentiel()
        .ajouteUneThematique('contexte', [
          uneQuestion()
            .avecIdentifiant('contexte-secteur-activite')
            .aChoixUnique("secteur d'activité ?", [
              {
                identifiant: `contexte-secteur-activite-${secteurActivite}`,
                libelle: secteurActivite,
              },
            ])
            .construis(),
        ])
        .construis()
    )
    .ajouteUneReponseDonnee(
      {
        thematique: 'contexte',
        question: 'contexte-secteur-activite',
      },
      uneReponseDonnee()
        .ayantPourReponse(`contexte-secteur-activite-${secteurActivite}`)
        .construis()
    );

export const unDiagnosticDansLeDepartementAvecSecteurActivite = (
  departement: string,
  secteurActivite: string
): ConstructeurDiagnostic =>
  unDiagnostic()
    .avecUnReferentiel(
      unReferentiel()
        .ajouteUneThematique('contexte', [
          uneQuestion()
            .avecIdentifiant('contexte-region-siege-social')
            .construis(),
          uneQuestion()
            .avecIdentifiant('contexte-departement-tom-siege-social')
            .aChoixUnique('département siège social ?', [
              {
                identifiant: 'contexte-departement-tom-siege-social-gironde',
                libelle: departement,
              },
            ])
            .construis(),
          uneQuestion()
            .avecIdentifiant('contexte-secteur-activite')
            .aChoixUnique("secteur d'activité ?", [
              {
                identifiant: 'contexte-secteur-activite-enseignement',
                libelle: secteurActivite,
              },
            ])
            .construis(),
        ])
        .construis()
    )
    .ajouteUneReponseDonnee(
      {
        thematique: 'contexte',
        question: 'contexte-region-siege-social',
      },
      uneReponseDonnee()
        .ayantPourReponse('contexte-region-siege-social-nouvelle-aquitaine')
        .construis()
    )
    .ajouteUneReponseDonnee(
      {
        thematique: 'contexte',
        question: 'contexte-departement-tom-siege-social',
      },
      uneReponseDonnee()
        .ayantPourReponse('contexte-departement-tom-siege-social-gironde')
        .construis()
    )
    .ajouteUneReponseDonnee(
      {
        thematique: 'contexte',
        question: 'contexte-secteur-activite',
      },
      uneReponseDonnee()
        .ayantPourReponse('contexte-secteur-activite-enseignement')
        .construis()
    );

const septReponsesDonnees = () => [
  { q1: 'reponse-11' },
  { q2: 'reponse-21' },
  { q3: 'reponse-31' },
  { q4: 'reponse-41' },
  { q5: 'reponse-51' },
  { q6: 'reponse-61' },
  { q7: 'reponse-71' },
];
export const uneQuestionDiagnostic = () => new ConstructeurQuestionDiagnostic();

export const uneReponseDonnee = (): ConstructeurReponseDonnee =>
  new ConstructeurReponseDonnee();
