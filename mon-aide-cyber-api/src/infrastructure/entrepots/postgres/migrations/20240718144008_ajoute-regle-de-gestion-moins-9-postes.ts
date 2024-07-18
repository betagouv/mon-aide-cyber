import { Knex } from 'knex';
import crypto from 'crypto';
import { Thematique } from '../../../../diagnostic/Diagnostic';
import {
  QuestionATiroir,
  RegleDeGestionAjouteReponse,
  Resultat,
  TypeQuestion,
} from '../../../../diagnostic/Referentiel';
import { Poids } from '../../../../diagnostic/Indice';

type ReponsesMultiples = { identifiant: string; reponses: Set<string> };

type ReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  questions?: QuestionATiroir[];
  resultat?: Resultat;
  regle?: RegleDeGestionAjouteReponse;
};

type ReponseDonnee = {
  reponsesMultiples: ReponsesMultiples[];
  reponseUnique: string | null;
};

type Question = {
  identifiant: string;
  libelle: string;
  type: TypeQuestion;
  reponsesPossibles: ReponsePossible[];
  poids: Poids;
};

type QuestionDiagnostic = Question & {
  reponseDonnee: ReponseDonnee;
};

type QuestionsThematique = {
  questions: QuestionDiagnostic[];
};

type RepresentationReferentiel = {
  [clef: Thematique]: QuestionsThematique;
};

const regles: {
  identifiantQuestion: string;
  identifiantReponse: string;
  regle: { reponses: { identifiantQuestion: string; reponseDonnee: string }[] };
}[] = [
  {
    identifiantQuestion: 'contexte-nombre-postes-travail-dans-entite',
    identifiantReponse:
      'contexte-nombre-postes-travail-dans-entite-entre-1-et-9',
    regle: {
      reponses: [
        {
          identifiantQuestion: 'acces-outil-gestion-des-comptes',
          reponseDonnee: 'acces-outil-gestion-des-comptes-na',
        },
      ],
    },
  },
];

export async function up(knex: Knex): Promise<void> {
  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          referentiel: RepresentationReferentiel;
        };
      }[]
    ) => {
      const misesAJour = lignes.map((ligne) => {
        Object.entries(ligne.donnees.referentiel)
          .filter(([thematique]) => thematique === 'contexte')
          .forEach(([, questions]) => {
            questions.questions.forEach((question) => {
              regles.forEach((r) => {
                if (r.identifiantQuestion === question.identifiant) {
                  question.reponsesPossibles
                    .filter(
                      (reponse) => reponse.identifiant === r.identifiantReponse
                    )
                    .forEach((reponse) => {
                      reponse.regle = r.regle;
                    });
                }
              });
            });
          });
        return knex('diagnostics')
          .where('id', ligne.id)
          .update({ donnees: ligne.donnees });
      });

      return Promise.all(misesAJour);
    }
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_: Knex): Promise<void> {}
