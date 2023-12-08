import { QuestionsThematique } from '../Referentiel';

export const donneesSecuriteInfrastructure: QuestionsThematique = {
  questions: [
    {
      identifiant: 'securite-infrastructure-pare-feu-deploye',
      libelle:
        'Votre connexion à Internet est-elle protégée par un pare-feu physique ?',
      reponsesPossibles: [
        {
          identifiant: 'securite-infrastructure-pare-feu-deploye-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'securite-infrastructure-pare-feu-deploye-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 1 },
            recommandations: [
              {
                identifiant: 'securite-infrastructure-pare-feu-deploye',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: 'securite-infrastructure-pare-feu-deploye-oui',
          libelle: 'Oui',
          questions: [
            {
              identifiant:
                'securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees',
              libelle:
                'Si "Oui" : Est-ce que seuls les flux strictement nécessaires entre votre système d\'information et Internet (ou autres réseaux externes) sont autorisés ?',
              reponsesPossibles: [
                {
                  identifiant:
                    'securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees-nsp',
                  libelle: 'Je ne sais pas',
                  ordre: 0,
                },
                {
                  identifiant:
                    'securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees-non',
                  libelle: 'Non',
                  resultat: {
                    valeur: { theorique: 0, poids: 2 },
                    recommandations: [
                      {
                        identifiant:
                          'securite-infrastructure-pare-feu-deploye-interconnexions-protegees',
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 1,
                },
                {
                  identifiant:
                    'securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees-oui',
                  libelle: 'Oui',
                  resultat: { valeur: { theorique: 3, poids: 2 } },
                  ordre: 2,
                },
              ],
              type: 'choixUnique',
            },
            {
              identifiant:
                'securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes',
              libelle:
                'Si "Oui" : stockez-vous les journaux des flux entrants, sortants et bloqués générés par votre pare-feu ?',
              reponsesPossibles: [
                {
                  identifiant:
                    'securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-nsp',
                  libelle: 'Je ne sais pas',
                  ordre: 0,
                },
                {
                  identifiant:
                    'securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-non',
                  libelle: 'Non',
                  resultat: {
                    valeur: { theorique: 0, poids: 2 },
                    recommandations: [
                      {
                        identifiant:
                          'securite-infrastructure-pare-feu-deploye-logs-stockes',
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 1,
                },
                {
                  identifiant:
                    'securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-oui-logs-stockes',
                  libelle: 'Oui, nous stockons quelques journaux du pare-feu.',
                  resultat: {
                    valeur: { theorique: 1, poids: 2 },
                    recommandations: [
                      {
                        identifiant:
                          'securite-infrastructure-pare-feu-deploye-logs-stockes',
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 2,
                },
                {
                  identifiant:
                    'securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-oui-logs-stockes-conserves-6-mois',
                  libelle:
                    "Oui, nous stockons les journaux du pare-feu avec une durée de conservation d'au moins 6 mois.",
                  resultat: { valeur: { theorique: 3, poids: 2 } },
                  ordre: 2,
                },
              ],
              type: 'choixUnique',
            },
          ],
          ordre: 2,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-infrastructure-si-industriel-pare-feu-deploye',
      libelle:
        "Si l'entité dispose de systèmes industriels : des mesures de cloisonnement spécifiques des systèmes industriels ont-elles été mise en œuvre ?",
      reponsesPossibles: [
        {
          identifiant:
            'securite-infrastructure-si-industriel-pare-feu-deploye-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'securite-infrastructure-si-industriel-pare-feu-deploye-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'securite-infrastructure-si-industriel-pare-feu-deploye-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 2 },
            recommandations: [
              {
                identifiant:
                  'securite-infrastructure-si-industriel-pare-feu-deploye',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-infrastructure-si-industriel-pare-feu-deploye-oui-flux-necessaires-bloques',
          libelle: 'Oui, tous les flux et ports non nécessaires sont bloqués.',
          resultat: {
            valeur: { theorique: 1.5, poids: 2 },
            recommandations: [
              {
                identifiant:
                  'securite-infrastructure-si-industriel-pare-feu-deploye',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'securite-infrastructure-si-industriel-pare-feu-deploye-oui-segmentation-stricte',
          libelle:
            "Oui, une segmentation réseau stricte a été mise en œuvre pour isoler l'environnement industriel de l'environnement bureautique (hors besoin métier justifié).",
          resultat: { valeur: { theorique: 3, poids: 2 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant:
        'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees',
      libelle:
        'Les mises à jour fonctionnelles et de sécurité des équipements de sécurité sont-elles déployées ?',
      reponsesPossibles: [
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 3 },
            recommandations: [
              {
                identifiant:
                  'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-a-intervalle-regulier',
          libelle:
            'Des mises à jour logicielles sont déployées à intervalle régulier.',
          resultat: {
            valeur: { theorique: 2, poids: 3 },
            recommandations: [
              {
                identifiant:
                  'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-des-que-possible',
          libelle:
            'Toutes les mises à jour logicielles sont déployées dès que celles-ci sont disponibles et fonctionnelles.',
          resultat: { valeur: { theorique: 3, poids: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant:
        'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees',
      libelle:
        "Les mises à jour fonctionnelles et de sécurité des systèmes d'exploitation des serveurs, services et logiciels d'administration sont-elles déployées ?",
      reponsesPossibles: [
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 3 },
            recommandations: [
              {
                identifiant:
                  'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-a-intervalle-regulier',
          libelle:
            'Des mises à jour logicielles sont déployées à intervalle régulier.',
          resultat: {
            valeur: { theorique: 2, poids: 3 },
            recommandations: [
              {
                identifiant:
                  'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-des-que-possible',
          libelle:
            'Toutes les mises à jour logicielles sont déployées dès que celles-ci sont disponibles et fonctionnelles.',
          resultat: { valeur: { theorique: 3, poids: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant:
        'securite-infrastructure-outils-securisation-systeme-messagerie',
      libelle:
        'Des mesures et outils spécifiques sont-ils mis en œuvre pour sécuriser le système de messagerie ?',
      reponsesPossibles: [
        {
          identifiant:
            'securite-infrastructure-outils-securisation-systeme-messagerie-na',
          libelle: 'Non applicable.',
          ordre: 0,
        },
        {
          identifiant:
            'securite-infrastructure-outils-securisation-systeme-messagerie-nsp',
          libelle: 'Je ne sais pas.',
          ordre: 1,
        },
        {
          identifiant:
            'securite-infrastructure-outils-securisation-systeme-messagerie-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 1 },
            recommandations: [
              {
                identifiant:
                  'securite-infrastructure-outils-securisation-systeme-messagerie',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-infrastructure-outils-securisation-systeme-messagerie-antispam',
          libelle:
            "Oui, un outil d'anti-spam et d'anti-hameçonnage a été mis en oeuvre.",
          resultat: {
            valeur: { theorique: 2, poids: 1 },
            recommandations: [
              {
                identifiant:
                  'securite-infrastructure-outils-securisation-systeme-messagerie',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'securite-infrastructure-outils-securisation-systeme-messagerie-webmail',
          libelle:
            "Oui, un outil d'anti-spam et d'anti-hameçonnage a été mis en oeuvre et aucun portail webmail n'est activé.",
          resultat: { valeur: { theorique: 3, poids: 1 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-infrastructure-acces-wifi-securises',
      libelle: 'Les points d’accès wifi sont-ils sécurisés ?',
      reponsesPossibles: [
        {
          identifiant: 'securite-infrastructure-acces-wifi-securises-na',
          libelle: 'Non Applicable',
          ordre: 0,
        },
        {
          identifiant: 'securite-infrastructure-acces-wifi-securises-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'securite-infrastructure-acces-wifi-securises-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 1 },
            recommandations: [
              {
                identifiant: 'securite-infrastructure-acces-wifi-securises',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-infrastructure-acces-wifi-securises-oui-chiffrement-robuste',
          libelle: 'Oui, le chiffrement de la connexion wifi est robuste.',
          resultat: {
            valeur: { theorique: 2, poids: 1 },
            recommandations: [
              {
                identifiant: 'securite-infrastructure-acces-wifi-securises',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'securite-infrastructure-acces-wifi-securises-oui-chiffrement-robuste-acces-visiteur-restreint',
          libelle:
            "Oui, le chiffrement de la connexion wifi est robuste et les visiteurs n'ont pas accès au réseau interne.",
          resultat: { valeur: { theorique: 3, poids: 1 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-infrastructure-espace-stockage-serveurs',
      libelle:
        "L'accès à la salle ou à l'espace dédié au stockage des serveurs d'administration, baies informatiques et des équipements réseau est-il protégé par une porte sécurisée ?",
      reponsesPossibles: [
        {
          identifiant: 'securite-infrastructure-espace-stockage-serveurs-na',
          libelle: 'Non Applicable',
          ordre: 0,
        },
        {
          identifiant: 'securite-infrastructure-espace-stockage-serveurs-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'securite-infrastructure-espace-stockage-serveurs-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 1 },
            recommandations: [
              {
                identifiant: 'securite-infrastructure-espace-stockage-serveurs',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-infrastructure-espace-stockage-serveurs-oui-porte-ferme-a-clef',
          libelle: "Oui, l'accès est sécurisé par une porte fermée à clef.",
          resultat: {
            valeur: { theorique: 1.5, poids: 1 },
            recommandations: [
              {
                identifiant: 'securite-infrastructure-espace-stockage-serveurs',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'securite-infrastructure-espace-stockage-serveurs-oui-porte-ferme-a-clef-videosurveillance',
          libelle:
            "Oui, l'accès est sécurisé par une porte fermée à clef et par un dispositif de vidéosurveillance.",
          resultat: { valeur: { theorique: 3, poids: 1 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
