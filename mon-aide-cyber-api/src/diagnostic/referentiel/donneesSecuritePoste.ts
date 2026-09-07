import { QuestionsThematique } from '../Referentiel';

export const donneesSecuritePoste: QuestionsThematique = {
  questions: [
    {
      identifiant:
        'securite-poste-maj-fonctionnelles-et-securite-deployees-recyf',
      libelle:
        'Les mises à jour fonctionnelles et de sécurité des logiciels utilisés sont-elles déployées ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'securite-poste-maj-fonctionnelles-et-securite-deployees-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees-recyf-systematiquement-un-peu',
          libelle:
            'Les équipements de sécurité (ex. pare-feux), les postes de travail et serveurs exposés à internet sont mis à jour mensuellement.',
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              {
                identifiant:
                  'securite-poste-maj-fonctionnelles-et-securite-deployees-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees-recyf-systematiquement-des-que-disponibles',
          libelle:
            "Les mises à jour sont déployées dès que possible sur l'ensemble des équipements de sécurité (ex. pare-feux), les postes de travail et serveurs exposés à internet.",
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
        'Les mises à jour fonctionnelles et de sécurité sont-elles déployées sur les postes de travail des utilisateurs et des administrateurs des systèmes industriels ?',
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
            'Les mises à jour sont déployées systématiquement, il existe tout de même certaines exceptions non traitées actuellement',
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
            "Toutes les mises à jour sont déployées systématiquement dès que celles-ci sont disponibles et les exceptions font l'objet de mesures complémentaires",
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-antivirus-deploye-recyf',
      libelle:
        'Un antivirus et/ou EDR est-il déployé sur l’ensemble des équipements et services ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'securite-poste-antivirus-deploye-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },

        {
          identifiant: 'securite-poste-antivirus-deploye-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'securite-poste-antivirus-deploye-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'securite-poste-antivirus-deploye-recyf-oui-alertes-hebdomadaires',
          libelle:
            "Une protection antivirus ou/et un EDR est active et à jour sur l'ensemble des postes de travail. Les alertes générées par ces outils sont traitées de façon hebdomadaire.",
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              {
                identifiant: 'securite-poste-antivirus-deploye-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-poste-antivirus-deploye-recyf-oui-alertes-toujours-traitees',
          libelle:
            'Une protection antivirus ou/et un EDR est active et à jour sur l’ensemble des équipements traitant des données provenant de l’extérieur (poste de travail, téléphones, serveurs exposés, etc.). ' +
            'Les alertes générées par ces outils sont traitées a minima quotidiennement (en interne ou par un sous-traitant).',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-si-industriel-antivirus-deploye-recyf',
      libelle:
        'Un antivirus à jour est-il déployé sur chaque poste de travail des systèmes industriels ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant:
            'securite-poste-si-industriel-antivirus-deploye-recyf-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'securite-poste-si-industriel-antivirus-deploye-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'securite-poste-si-industriel-antivirus-deploye-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'securite-poste-si-industriel-antivirus-deploye-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'securite-poste-si-industriel-antivirus-deploye-recyf-oui-alertes-pas-toujours-traitees',
          libelle: 'Oui, mais ses alertes ne sont pas toujours traitées',
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              {
                identifiant:
                  'securite-poste-si-industriel-antivirus-deploye-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'securite-poste-si-industriel-antivirus-deploye-recyf-oui-alertes-toujours-traitees',
          libelle: 'Oui et ses alertes sont systématiquement traitées',
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'securite-poste-mdp-par-defaut-recyf',
      libelle:
        'Modifiez-vous systématiquement les mots de passe et autre secrets par défaut des équipements et logiciels ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'securite-poste-mdp-par-defaut-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'securite-poste-mdp-par-defaut-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'securite-poste-mdp-par-defaut-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: 'securite-poste-mdp-par-defaut-recyf-un-peu',
          libelle:
            'Les mots de passe et secrets par défaut ont été modifiés en priorité sur les équipements de sécurité (ex. pare-feu), les équipements exposés sur internet, les équipements réseau (ex. box internet) et les équipements supportant les systèmes d’information liés aux activités à protéger en priorité.',
          resultat: {
            indice: { valeur: 1.5 },
            mesures: [
              {
                identifiant: 'securite-poste-mdp-par-defaut-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'securite-poste-mdp-par-defaut-recyf-oui',
          libelle:
            'Les mots de passe et secrets par défaut sont systématiquement modifiés sur l’ensemble des équipements et logiciels avant mise en service, et cette vérification est intégrée au processus d’installation/déploiement.',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
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
            'Oui, un outil de type EDR a été mis en place mais ses alertes ne sont pas toujours traitées',
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
      libelle: 'Les disques durs des matériels nomades sont-ils chiffrés ?',
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
