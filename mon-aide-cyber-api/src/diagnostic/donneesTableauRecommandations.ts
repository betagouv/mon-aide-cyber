import { TableauDeRecommandations } from "./TableauDeRecommandations";

const tableauRecommandations: TableauDeRecommandations = {
  "gouvernance-infos-et-processus-a-proteger": {
    niveau1:
      "<h2>Établir la liste des activités et des informations à protéger en priorité.</h2>",
    niveau2:
      "<h2>Établir la liste exhaustive et à jour des activités et informations à protéger en priorité. Faire valider cette liste en CODIR à minima une fois tous les 3 ans.</h2>",
  },
  "gouvernance-schema-si-a-jour": {
    niveau1:
      "<h2>Disposer d’un schéma global du réseau informatique et de la liste des interconnexions vers l’extérieur à jour.</h2>",
    niveau2:
      "<h2>Disposer de la liste des équipements et applicatifs concourant au fonctionnement du système d’information</h2>",
  },
  "gouvernance-schema-si-industriel-a-jour": {
    niveau1:
      "<h2>Disposer d’un schéma global du réseau industriel et de la liste des interconnexions vers l’extérieur à jour.</h2>",
    niveau2:
      "<h2>Disposer de la liste des équipements et applicatifs concourant au fonctionnement du système d’information industriel</h2>",
  },
  "gouvernance-connaissance-rgpd": {
    niveau1:
      "<h2>Initier une démarche de conformité RGPD en mettant en oeuvre les premières mesures suivantes :</h2>" +
      "<ul>" +
      "<li>Établir d'un registre de vos traitements \n" +
      "<li>Pour chaque traitement, déterminer leur nature et leur finalité, confirmer les besoins des données personnelles collectées puis supprimer les données non nécessaires</li>" +
      "<li>Informer les personnes concernées des données personnelles stockées, traitées et leurs finalités</li>" +
      "<li>Mettre en place des moyens permettant aux personnes concernées de faire valoir leurs droits (recensement, suppression, etc.)</li>" +
      "</ul>",
  },
  "gouvernance-moyen-budgetaire-cyber-securite": {
    niveau1:
      "<h2>Dédier une ligne budgétaire à la cybersécurité (technique et métier, investissement et fonctionnement inclus) récurrente d’au moins 5% du budget IT</h2>",
    niveau2:
      "<h2>Dédier une ligne budgétaire à la cybersécurité (technique et métier, investissement et fonctionnement inclus) récurrente d’au moins 10% du budget IT</h2>",
  },
  "gouvernance-exigence-cyber-securite-presta": {
    niveau1:
      "<h2>Fixer des exigences de cybersécurité aux prestataires (ex : complexité des mots de passe ; sécurisation des accès distants ; délai de déploiement des mises à jour critiques)</h2>",
    niveau2:
      "<h2>Fixer des exigences de sécurité incombant à tous les prestataires, vérifier leur application et imposer des pénalités en cas de non-respect</h2>",
  },
};

export { tableauRecommandations };
