import { QuestionsThematique } from '../Referentiel';

export const donneesSecuritePoste: QuestionsThematique = {
  questions: [
    {
      identifiant: 'securite-poste-maj-fonctionnelles-et-securite-deployees',
      libelle:
        'Les mises à jour fonctionnelles et de sécurité des logiciels utilisés sont-elles déployées sur les postes de travail des utilisateurs et des administrateurs ?',
      reponsesPossibles: [
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 3 },
            recommandations: [
              {
                identifiant:
                  'securite-poste-maj-fonctionnelles-et-securite-deployees',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees-systematiquement-avec-exceptions',
          libelle:
            'Les mises à jour sont déployées systématiquement, il existe tout de même certaines exceptions non traitées actuellement.',
          resultat: {
            valeur: { theorique: 2, poids: 3 },
            recommandations: [
              {
                identifiant:
                  'securite-poste-maj-fonctionnelles-et-securite-deployees',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees-systematiquement-des-que-disponibles',
          libelle:
            "Toutes les mises à jour sont déployées systématiquement dès que celles-ci sont disponibles et les exceptions font l'objet de mesures complémentaires.",
          resultat: { valeur: { theorique: 3, poids: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant:
        'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees',
      libelle:
        "Si l'entité dispose d'un SI industriel : Les mises à jour fonctionnelles et de sécurité sont-elles déployées sur les postes de travail des utilisateurs et des administrateurs ?",
      reponsesPossibles: [
        {
          identifiant:
            'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 2 },
            recommandations: [
              {
                identifiant:
                  'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-systematiquement-avec-exceptions',
          libelle:
            'Les mises à jour sont déployées systématiquement, il existe tout de même certaines exceptions non traitées actuellement.',
          resultat: {
            valeur: { theorique: 2, poids: 2 },
            recommandations: [
              {
                identifiant:
                  'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-systematiquement-des-que-disponibles',
          libelle:
            "Toutes les mises à jour sont déployées systématiquement dès que celles-ci sont disponibles et les exceptions font l'objet de mesures complémentaires.",
          resultat: { valeur: { theorique: 3, poids: 2 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-antivirus-deploye',
      libelle:
        'Un antivirus à jour est-il déployé sur chaque poste de travail ?',
      reponsesPossibles: [
        {
          identifiant: 'securite-poste-antivirus-deploye-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },

        {
          identifiant: 'securite-poste-antivirus-deploye-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 3 },
            recommandations: [
              {
                identifiant: 'securite-poste-antivirus-deploye',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'securite-poste-antivirus-deploye-oui-alertes-pas-toujours-traitees',
          libelle: 'Oui, mais ses alertes ne sont pas toujours traitées',
          resultat: {
            valeur: { theorique: 2, poids: 3 },
            recommandations: [
              {
                identifiant: 'securite-poste-antivirus-deploye',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-poste-antivirus-deploye-oui-alertes-toujours-traitees',
          libelle: 'Oui et ses alertes sont systématiquement traitées.',
          resultat: { valeur: { theorique: 3, poids: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-si-industriel-antivirus-deploye',
      libelle:
        "Si l'entité dispose d'un SI industriel : Un antivirus à jour est-il déployé sur chaque poste de travail du SI industriel ?",
      reponsesPossibles: [
        {
          identifiant: 'securite-poste-si-industriel-antivirus-deploye-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant: 'securite-poste-si-industriel-antivirus-deploye-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'securite-poste-si-industriel-antivirus-deploye-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 2 },
            recommandations: [
              {
                identifiant: 'securite-poste-si-industriel-antivirus-deploye',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-poste-si-industriel-antivirus-deploye-oui-alertes-pas-toujours-traitees',
          libelle: 'Oui, mais ses alertes ne sont pas toujours traitées',
          resultat: {
            valeur: { theorique: 2, poids: 2 },
            recommandations: [
              {
                identifiant: 'securite-poste-si-industriel-antivirus-deploye',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'securite-poste-si-industriel-antivirus-deploye-oui-alertes-toujours-traitees',
          libelle: 'Oui et ses alertes sont systématiquement traitées.',
          resultat: { valeur: { theorique: 3, poids: 2 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-pare-feu-local-active',
      libelle: 'Un pare-feu local est-il activé sur les postes de travail ?',
      reponsesPossibles: [
        {
          identifiant: 'securite-poste-pare-feu-local-active-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'securite-poste-pare-feu-local-active-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 2 },
            recommandations: [
              {
                identifiant: 'securite-poste-pare-feu-local-active',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: 'securite-poste-pare-feu-local-active-oui',
          libelle: 'Oui',
          resultat: { valeur: { theorique: 3, poids: 2 } },
          ordre: 2,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-outils-complementaires-securisation',
      libelle:
        'Un outil complémentaire à un antivirus de type EDR a-t-il était mis en place ?',
      reponsesPossibles: [
        {
          identifiant: 'securite-poste-outils-complementaires-securisation-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'securite-poste-outils-complementaires-securisation-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 2 },
            recommandations: [
              {
                identifiant:
                  'securite-poste-outils-complementaires-securisation',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'securite-poste-outils-complementaires-securisation-oui-outil-complementaire-type-edr',
          libelle:
            'Oui, un outil complémentaire à un antivirus de type EDR a été mis en place.',
          resultat: { valeur: { theorique: 3, poids: 2 } },
          ordre: 2,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-r-et-d-disques-chiffres',
      libelle:
        "Si entité à risque d'espionnage, les disques durs des matériels nomades sont-ils chiffrés ?",
      reponsesPossibles: [
        {
          identifiant: 'securite-poste-r-et-d-disques-chiffres-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant: 'securite-poste-r-et-d-disques-chiffres-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'securite-poste-r-et-d-disques-chiffres-non',
          libelle: 'Non',
          resultat: {
            valeur: { theorique: 0, poids: 2 },
            recommandations: [
              {
                identifiant: 'securite-poste-r-et-d-disques-chiffres',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'securite-poste-r-et-d-disques-chiffres-oui',
          libelle: 'Oui',
          resultat: { valeur: { theorique: 3, poids: 2 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
