import { QuestionsThematique } from '../Referentiel';

export const donneesReaction: QuestionsThematique = {
  questions: [
    {
      identifiant: 'reaction-sauvegardes-donnees-realisees-recyf',
      libelle: 'Des sauvegardes régulières des données sont-elles réalisées ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'reaction-sauvegardes-donnees-realisees-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'reaction-sauvegardes-donnees-realisees-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'reaction-sauvegardes-donnees-realisees-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'reaction-sauvegardes-donnees-realisees-recyf-oui-regulierement',
          libelle:
            'Les données à protéger en priorité sont identifiées et sauvegardées régulièrement, avec au moins une copie hors ligne (déconnectée après la sauvegarde).',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'reaction-sauvegardes-donnees-realisees-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'reaction-sauvegardes-donnees-realisees-recyf-oui-automatique-et-reguliere',
          libelle:
            'L’ensemble des données font l’objet d’un processus de sauvegarde adapté et les sauvegardes sont protégées d’un incident les rendant inexploitables en cas de compromission générale du réseau interne (par exemple : le stockage hors-ligne pour répondre à un incident de type rançongiciel).',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant:
        'reaction-restauration-sauvegardes-testees-regulierement-recyf',
      libelle:
        'La restauration des sauvegardes de toutes vos données critiques est-elle testée régulièrement ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant:
            'reaction-restauration-sauvegardes-testees-regulierement-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant:
            'reaction-restauration-sauvegardes-testees-regulierement-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'reaction-restauration-sauvegardes-testees-regulierement-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'reaction-restauration-sauvegardes-testees-regulierement-recyf-oui-ponctuellement',
          libelle:
            'La capacité à restaurer est vérifiée ponctuellement sur les données à protéger en priorité (ex. restauration de quelques fichiers au hasard).',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant:
                  'reaction-restauration-sauvegardes-testees-regulierement-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'reaction-restauration-sauvegardes-testees-regulierement-recyf-oui-une-fois-par-an',
          libelle:
            'La restauration de l’ensemble des données est testée au moins une fois par an.',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'reaction-liste-personnes-a-contacter-recyf',
      libelle:
        'Avez-vous imprimé une liste des personnes à contacter en cas de crise et de leurs contacts ? (internes et externes)',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'reaction-liste-personnes-a-contacter-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'reaction-liste-personnes-a-contacter-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'reaction-liste-personnes-a-contacter-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'reaction-liste-personnes-a-contacter-recyf-oui-principales',
          libelle:
            'Une liste des principaux contacts de crise (responsables internes, prestataire informatique) est imprimée et accessible hors ligne.',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'reaction-liste-personnes-a-contacter-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'reaction-liste-personnes-a-contacter-recyf-oui-complete',
          libelle:
            'Une liste complète des contacts internes et externes (direction, IT/prestataire, hébergeur, assureur cyber, CERT-FR, autorités, partenaires clés) est imprimée, tenue à jour et accessible sans ordinateur ni internet.',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'reaction-bons-reflexes-recyf',
      libelle:
        'Êtes-vous entrainé aux bons reflexes pour réagir en cas de cyberattaque ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'reaction-bons-reflexes-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'reaction-bons-reflexes-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'reaction-bons-reflexes-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: 'reaction-bons-reflexes-recyf-oui-premier-exercice',
          libelle:
            "Un premier exercice de crise sur table a été réalisé à partir d'un scénario prêt à l'emploi.",
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'reaction-bons-reflexes-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'reaction-bons-reflexes-recyf-oui-regulierement',
          libelle:
            'Des exercices de crise cyber sont organisés régulièrement, associant les personnes-clés (direction, IT/prestataire, communication, métier).',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'reaction-amelioration-gestion-crise-recyf',
      libelle:
        'Êtes-vous en mesure d’améliorer votre gestion de crise après une crise ou un exercice ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'reaction-amelioration-gestion-crise-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'reaction-amelioration-gestion-crise-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'reaction-amelioration-gestion-crise-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'reaction-amelioration-gestion-crise-recyf-oui-premier-exercice',
          libelle:
            'Un retour d’expérience est réalisé après chaque déclenchement du processus de gestion de crise (crise réelle, exercice, etc.).',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'reaction-amelioration-gestion-crise-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'reaction-amelioration-gestion-crise-recyf-oui-regulierement',
          libelle:
            'Un retour d’expérience formalisé est systématiquement conduit après chaque déclenchement du processus gestion de crise (crise réelle, exercice, etc.), avec identification des points d’amélioration et mise à jour des procédures, outils (mode dégradé, fiches reflexes opérationnelles, etc.). Ces actions d’amélioration font l’objet d’un suivi.',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
