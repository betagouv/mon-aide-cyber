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
    identifiantQuestion: 'contexte-opere-systemes-information-industriels',
    identifiantReponse: 'contexte-opere-systemes-information-industriels-non',
    regle: {
      reponses: [
        {
          identifiantQuestion: 'gouvernance-schema-si-industriel-a-jour',
          reponseDonnee: 'gouvernance-schema-si-industriel-a-jour-na',
        },
        {
          identifiantQuestion:
            'acces-si-industriel-teletravail-acces-distants-mesures-particulieres',
          reponseDonnee:
            'acces-si-industriel-teletravail-acces-distants-mesures-particulieres-na',
        },
        {
          identifiantQuestion:
            'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees',
          reponseDonnee:
            'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-na',
        },
        {
          identifiantQuestion: 'securite-poste-si-industriel-antivirus-deploye',
          reponseDonnee: 'securite-poste-si-industriel-antivirus-deploye-na',
        },
        {
          identifiantQuestion:
            'securite-infrastructure-si-industriel-pare-feu-deploye',
          reponseDonnee:
            'securite-infrastructure-si-industriel-pare-feu-deploye-na',
        },
      ],
    },
  },
  {
    identifiantQuestion: 'contexte-activites-recherche-et-developpement',
    identifiantReponse: 'contexte-activites-recherche-et-developpement-non',
    regle: {
      reponses: [
        {
          identifiantQuestion: 'acces-liste-compte-utilisateurs',
          reponseDonnee: 'acces-liste-compte-utilisateurs-na',
        },
        {
          identifiantQuestion: 'acces-droits-acces-utilisateurs-limites',
          reponseDonnee: 'acces-droits-acces-utilisateurs-limites-na',
        },
        {
          identifiantQuestion:
            'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles',
          reponseDonnee:
            'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-na',
        },
        {
          identifiantQuestion: 'securite-poste-r-et-d-disques-chiffres',
          reponseDonnee: 'securite-poste-r-et-d-disques-chiffres-na',
        },
        {
          identifiantQuestion: 'securite-infrastructure-acces-wifi-securises',
          reponseDonnee: 'securite-infrastructure-acces-wifi-securises-na',
        },
        {
          identifiantQuestion:
            'securite-infrastructure-espace-stockage-serveurs',
          reponseDonnee: 'securite-infrastructure-espace-stockage-serveurs-na',
        },
        {
          identifiantQuestion:
            'sensibilisation-risque-espionnage-industriel-r-et-d',
          reponseDonnee:
            'sensibilisation-risque-espionnage-industriel-r-et-d-na',
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
