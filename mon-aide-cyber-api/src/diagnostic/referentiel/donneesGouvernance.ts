import { QuestionsThematique } from '../Referentiel';

export const donneesGouvernance: QuestionsThematique = {
  questions: [
    {
      identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf',
      libelle:
        "Avez-vous identifié les activités à protéger en priorité et les systèmes d'information associés ?",
      poids: 1,
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'gouvernance-infos-et-activites-a-proteger-recyf-oui-idee-generale',
          libelle:
            'Une liste des activités à protéger en priorité de mon entité est formalisée',
          resultat: {
            indice: { valeur: 1.5 },
            mesures: [
              {
                identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'gouvernance-infos-et-activites-a-proteger-recyf-oui-precise',
          libelle:
            "Une liste des activités à protéger en priorité de mon entité et des systèmes d'information sur lesquels elles reposent est formalisée.",
          resultat: {
            indice: { valeur: 3 },
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: 'gouvernance-schema-si-a-jour-recyf',
      libelle: 'Existe-t-il un plan du système d’information de l’entité ?',
      poids: 1,
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-schema-si-a-jour-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-schema-si-a-jour-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-schema-si-a-jour-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'gouvernance-schema-si-a-jour-recyf-inventaire-formalise',
          libelle:
            'Un inventaire des systèmes exposés / interconnectés (services exposés sur internet, adresses publiques, accès distants, interconnexions partenaires) est formalisé.',
          resultat: {
            indice: { valeur: 0.5 },
            mesures: [
              {
                identifiant: 'gouvernance-schema-si-a-jour-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-schema-si-a-jour-recyf-schema-complet',
          libelle:
            "Un schéma complet est formalisée, permettant d'assurer le maintien en condition opérationnelle et de sécurité des systèmes et de réagir sans retard injustifié à un incident de sécurité (ex. version des différents logiciels et OS des équipements, équipements réseaux, interconnexions avec l'extérieur, etc.)",
          resultat: {
            indice: { valeur: 1 },
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf',
      libelle:
        "Existe-t-il un plan et un inventaire des systèmes d'informations industriels de l'entité ?",
      poids: 1,
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'gouvernance-schema-si-industriel-a-jour-recyf-oui-partiel',
          libelle:
            'Il existe un plan "macro" non détaillé ou partiellement détaillé à jour',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'gouvernance-schema-si-industriel-a-jour-recyf-oui-detaille',
          libelle:
            'Il existe un plan détaillé, incluant la liste détaillée des composants du système d’information et la liste exhaustive des interconnexions vers l’extérieur',
          resultat: {
            indice: { valeur: 3 },
          },
          ordre: 4,
        },
      ],
    },
    {
      identifiant: 'gouvernance-suivi-alertes-securite-recyf',
      libelle:
        'Un suivi des alertes de cybersécurité et des vulnérabilités publiées pouvant vous affecter est-il réalisé ?',
      poids: 1,
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-suivi-alertes-securite-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-suivi-alertes-securite-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-suivi-alertes-securite-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-suivi-alertes-securite-recyf-oui-partiel',
          libelle:
            'Une personne est désignée pour effectuer la veille de cybersécurité et est abonnée aux bulletins du CERT-FR ' +
            'et des principaux éditeurs. Les alertes sont traitées selon la sévérité sur le périmètre.',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'gouvernance-suivi-alertes-securite-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-suivi-alertes-securite-recyf-oui-traite',
          libelle:
            'Une personne est désignée pour effectuer cette veille et est abonnée aux bulletins du CERT-FR et des ' +
            'principaux éditeurs. Chaque alerte est croisée avec la cartographie des systèmes pour en identifier l’impact ' +
            'puis traitées selon la sévérité. Des traces du traitement de ces alertes sont conservées.',
          resultat: {
            indice: { valeur: 3 },
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: 'gouvernance-exigence-cyber-securite-presta-recyf',
      libelle:
        "Des exigences de cybersécurité sont-elles intégrées aux contrats des prestataires disposant d'accès informatiques ?",
      poids: 1,
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-exigence-cyber-securite-presta-recyf-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-exigence-cyber-securite-presta-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-exigence-cyber-securite-presta-recyf-non',
          libelle:
            'Non, aucune exigence ne figure dans nos contrats de prestation',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-exigence-cyber-securite-presta-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'gouvernance-exigence-cyber-securite-presta-recyf-oui-formalisee',
          libelle:
            'Une annexe sécurité ou des clause sont incluse dans le contrat des prestataires critiques ' +
            '(intervenant sur les activités à protéger en priorité de l’entité ou sur des fonctions critiques ex. hébergeur, exploitant)',
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              {
                identifiant: 'gouvernance-exigence-cyber-securite-presta-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'gouvernance-exigence-cyber-securite-presta-recyf-oui-fixee',
          libelle:
            'Une annexe sécurité ou des clauses sont incluses dans l’ensemble des contrats de prestation ' +
            'comprenant pénalités, conformités, obligations, maintient à niveau de sécurité',
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
    },
  ],
};
