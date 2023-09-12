import { TableauDeRecommandations } from "./TableauDeRecommandations";

const tableauRecommandations: TableauDeRecommandations = {
  "gouvernance-infos-et-processus-a-proteger": {
    niveau1:
      "Établir la liste des activités et des informations à protéger en priorité.",
    niveau2:
      "Établir la liste exhaustive et à jour des activités et informations à protéger en priorité. Faire valider cette liste en CODIR à minima une fois tous les 3 ans.",
  },
  "gouvernance-schema-si-a-jour": {
    niveau1:
      "Disposer d’un schéma global du réseau informatique et de la liste des interconnexions vers l’extérieur à jour.",
    niveau2:
      "Disposer de la liste des équipements et applicatifs concourant au fonctionnement du système d’information",
  },
  "gouvernance-schema-si-industriel-a-jour": {
    niveau1:
      "Disposer d’un schéma global du réseau industriel et de la liste des interconnexions vers l’extérieur à jour.",
    niveau2:
      "Disposer de la liste des équipements et applicatifs concourant au fonctionnement du système d’information industriel",
  },
  "gouvernance-connaissance-rgpd": {
    niveau1:
      '"Initier une démarche de conformité RGPD en mettant en oeuvre les premières mesures suivantes : \n' +
      "- Etablir d'un registre de vos traitements \n" +
      "- Pour chaque traitement, déterminer leur nature et leur finalité, confirmer les besoins des données personnelles collectées puis supprimer les données non nécessaires\n" +
      "- Informer les personnes concernées des données personnelles stockées, traitées et leurs finalités \n" +
      '- Mettre en place des moyens permettant aux personnes concernées de faire valoir leurs droits (recensement, suppression, etc.)"',
  },
  "gouvernance-moyen-budgetaire-cyber-securite": {
    niveau1:
      "Dédier une ligne budgétaire à la cybersécurité (technique et métier, investissement et fonctionnement inclus) récurrente d’au moins 5% du budget IT",
    niveau2:
      "Dédier une ligne budgétaire à la cybersécurité (technique et métier, investissement et fonctionnement inclus) récurrente d’au moins 10% du budget IT",
  },
  "gouvernance-exigence-cyber-securite-presta": {
    niveau1:
      "Fixer des exigences de cybersécurité aux prestataires (ex : complexité des mots de passe ; sécurisation des accès distants ; délai de déploiement des mises à jour critiques)",
    niveau2:
      "Fixer des exigences de sécurité incombant à tous les prestataires, vérifier leur application et imposer des pénalités en cas de non-respect",
  },
};

export { tableauRecommandations };
