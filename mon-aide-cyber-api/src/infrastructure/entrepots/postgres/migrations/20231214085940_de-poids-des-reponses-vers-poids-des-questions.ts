import { Knex } from 'knex';
import crypto from 'crypto';
import {
  QuestionATiroir,
  ReponsePossible,
  TypeQuestion,
} from '../../../../diagnostic/Referentiel';
import { Poids, Valeur } from '../../../../diagnostic/Indice';
import {
  ReponseDonnee,
  Restitution,
  Thematique,
} from '../../../../diagnostic/Diagnostic';

type NiveauRecommandation = 1 | 2;

type Recommandation = {
  identifiant: string;
  niveau: NiveauRecommandation;
};

type NiveauDeRecommandation = {
  titre: string;
  pourquoi: string;
  comment: string;
};

type ObjetDeRecommandation = {
  niveau1: NiveauDeRecommandation;
  niveau2?: NiveauDeRecommandation;
  priorisation: number;
};

type TableauDeRecommandations = {
  [identifiantQuestion: string]: ObjetDeRecommandation;
};

type RepresentationQuestionTiroir = Omit<
  QuestionATiroir,
  'reponsesPossibles'
> & {
  reponsesPossibles: RepresentationReponsePossible[];
};

type RepresentationReponsePossible = Omit<
  ReponsePossible,
  'resultat' | 'questions'
> & {
  resultat?: {
    recommandations?: Recommandation[];
    indice: { valeur: Valeur; poids?: Poids };
  };
  questions?: RepresentationQuestionTiroir[];
};

type RepresentationQuestion = {
  identifiant: string;
  libelle: string;
  type: TypeQuestion;
  reponsesPossibles: RepresentationReponsePossible[];
  poids?: Poids;
};

type QuestionDiagnostic = RepresentationQuestion & {
  reponseDonnee: ReponseDonnee;
};

type RepresentationQuestionDiagnostic = Omit<
  QuestionDiagnostic,
  'reponsesPossibles'
> & {
  reponsesPossibles: RepresentationReponsePossible[];
};

type RepresentationQuestionsThematique = {
  questions: RepresentationQuestionDiagnostic[];
};

type RepresentationReferentiel = {
  [clef: Thematique]: RepresentationQuestionsThematique;
};

const poidsDesQuestions = new Map([
  ['gouvernance-infos-et-processus-a-proteger', 2],
  ['gouvernance-schema-si-a-jour', 1],
  ['gouvernance-schema-si-industriel-a-jour', 1],
  ['gouvernance-connaissance-rgpd', 1],
  ['gouvernance-connaissance-rgpd-1', 1],
  ['gouvernance-connaissance-rgpd-2', 1],
  ['gouvernance-exigence-cyber-securite-presta', 2],
  ['gouvernance-exigence-cyber-securite-presta-si-industriel', 2],
  ['acces-outil-gestion-des-comptes', 0.5],
  ['acces-liste-compte-utilisateurs', 1],
  ['acces-droits-acces-utilisateurs-limites', 1],
  ['acces-utilisateurs-administrateurs-poste', 3],
  ['acces-administrateurs-informatiques-suivie-et-limitee', 1],
  ['acces-utilisation-comptes-administrateurs-droits-limitee', 1],
  ['acces-mesures-securite-robustesse-mdp', 1],
  ['acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles', 1],
  ['acces-teletravail-acces-distants-mesures-particulieres', 2],
  ['acces-si-industriel-teletravail-acces-distants-mesures-particulieres', 1],
  ['acces-administrateurs-si-mesures-specifiques', 2],
  ['acces-entite-dispose-plusieurs-sites-geographiques', 1],
  ['securite-poste-maj-fonctionnelles-et-securite-deployees', 3],
  ['securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees', 2],
  ['securite-poste-antivirus-deploye', 3],
  ['securite-poste-si-industriel-antivirus-deploye', 2],
  ['securite-poste-pare-feu-local-active', 2],
  ['securite-poste-outils-complementaires-securisation', 2],
  ['securite-poste-r-et-d-disques-chiffres', 2],
  ['securite-infrastructure-pare-feu-deploye', 1],
  [
    'securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees',
    2,
  ],
  ['securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes', 2],
  ['securite-infrastructure-si-industriel-pare-feu-deploye', 2],
  [
    'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees',
    3,
  ],
  [
    'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees',
    3,
  ],
  ['securite-infrastructure-outils-securisation-systeme-messagerie', 1],
  ['securite-infrastructure-acces-wifi-securises', 1],
  ['securite-infrastructure-espace-stockage-serveurs', 1],
  ['sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques', 3],
  ['sensibilisation-risque-espionnage-industriel-r-et-d', 2],
  ['sensibilisation-collaborateurs-soumis-obligations-usages-securises', 2],
  ['sensibilisation-declaration-incidents-encouragee', 1.5],
  ['reaction-surveillance-veille-vulnerabilites-potentielles', 2],
  [
    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole',
    3,
  ],
  [
    'reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement',
    3,
  ],
  [
    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole',
    3,
  ],
  [
    'reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement',
    3,
  ],
  ['reaction-sauvegardes-donnees-realisees', 3],
  ['reaction-dispositif-gestion-crise-adapte-defini', 3],
]);

export async function up(knex: Knex): Promise<void> {
  const metsAJourLeContexte = (
    thematique: string,
    questions: RepresentationQuestionsThematique,
  ) => {
    if (thematique === 'contexte') {
      metsAJourLePoidsDesQuestions(questions, () => 0);
    }
  };

  const metsAJourToutesLesThematiques = (
    thematique: string,
    questions: RepresentationQuestionsThematique,
  ) => {
    if (thematique !== 'contexte') {
      metsAJourLePoidsDesQuestions(questions, (question) => {
        return poidsDesQuestions.get(question.identifiant) || 1;
      });
    }
  };

  const metsAJourLePoidsDesQuestions = (
    questions: RepresentationQuestionsThematique,
    fontionMiseAJour: (
      question: RepresentationQuestionDiagnostic | RepresentationQuestionTiroir,
    ) => number,
  ) => {
    questions.questions.forEach((questionContexte) => {
      questionContexte.poids = fontionMiseAJour(questionContexte);

      questionContexte.reponsesPossibles.forEach((responses) => {
        responses.questions?.forEach((questionsATirroir) => {
          questionsATirroir.poids = fontionMiseAJour(questionsATirroir);
        });
      });
    });
  };

  knex('diagnostics').then(
    (
      lignes: {
        id: crypto.UUID;
        donnees: {
          dateCreation: Date;
          dateDerniereModification: Date;
          identifiant: crypto.UUID;
          restitution?: Restitution;
          referentiel: RepresentationReferentiel;
          tableauDesRecommandations: TableauDeRecommandations;
        };
      }[],
    ) => {
      const misesAJour = lignes.map((ligne) => {
        Object.entries(ligne.donnees.referentiel).forEach(
          ([thematique, questions]) => {
            metsAJourLeContexte(thematique, questions);
            metsAJourToutesLesThematiques(thematique, questions);
          },
        );

        return knex('diagnostics')
          .where('id', ligne.id)
          .update({ donnees: ligne.donnees });
      });

      return Promise.all(misesAJour);
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_: Knex): Promise<void> {}
