import { QuestionsThematique } from '../Referentiel';

export const donneesSecuritePoste: QuestionsThematique = {
  questions: [
    {
      identifiant: 'securite-poste-maj-fonctionnelles-et-securite-deployees',
      libelle:
        'Les mises à jour fonctionnelles et de sécurité des logiciels utilisés sont-elles déployées sur les postes de travail des utilisateurs et des administrateurs ?',
      poids: 3,
      reponsesPossibles: [
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
            indice: { valeur: 0 },
            mesures: [
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
            indice: { valeur: 2 },
            mesures: [
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
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant:
        'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees',
      libelle:
        "Si l'entité dispose de systèmes industriels : les mises à jour fonctionnelles et de sécurité sont-elles déployées sur les postes de travail des utilisateurs et des administrateurs ?",
      poids: 2,
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
            indice: { valeur: 0 },
            mesures: [
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
            indice: { valeur: 2 },
            mesures: [
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
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-antivirus-deploye',
      libelle:
        'Un antivirus à jour est-il déployé sur chaque poste de travail ?',
      poids: 3,
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
            indice: { valeur: 0 },
            mesures: [
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
            indice: { valeur: 2 },
            mesures: [
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
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-si-industriel-antivirus-deploye',
      libelle:
        "Si l'entité dispose de systèmes industriels : Un antivirus à jour est-il déployé sur chaque poste de travail du SI industriel ?",
      poids: 2,
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
            indice: { valeur: 0 },
            mesures: [
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
            indice: { valeur: 2 },
            mesures: [
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
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-pare-feu-local-active',
      libelle: 'Un pare-feu local est-il activé sur les postes de travail ?',
      poids: 2,
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
            indice: { valeur: 0 },
            mesures: [
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
          resultat: { indice: { valeur: 3 } },
          ordre: 2,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-outils-complementaires-securisation',
      libelle:
        "En complément de l'antivirus, un outil de type EDR a-t-il été mis en place ?",
      poids: 2,
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
            indice: { valeur: 0 },
            mesures: [
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
            'Oui, un outil de type EDR a été mis en place mais ses alertes ne sont pas toujours traitées.',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant:
                  'securite-poste-outils-complementaires-securisation',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-poste-outils-complementaires-securisation-oui-systematique-outil-complementaire-type-edr',
          libelle:
            'Oui, un outil de type EDR a été mis en place et ses alertes sont systématiquement traitées',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-r-et-d-disques-chiffres',
      libelle:
        'Si entité avec risque d’espionnage ciblé, les disques durs des matériels nomades sont-ils chiffrés ?',
      poids: 2,
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
            indice: { valeur: 0 },
            mesures: [
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
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
