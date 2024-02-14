export const mesuresSecuriteInfrastructure = {
  'securite-infrastructure-pare-feu-deploye': {
    niveau1: {
      titre:
        'Déployer un pare-feu physique pour protéger l’interconnexion du SI à Internet.',
      pourquoi:
        '../../mesures/infras/securite-infrastructure-pare-feu-deploye-niveau1-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-pare-feu-deploye-niveau1-comment.pug',
    },
    priorisation: 20,
  },
  'securite-infrastructure-pare-feu-deploye-interconnexions-protegees': {
    niveau1: {
      titre:
        'Déployer un pare-feu physique pour protéger l’interconnexion du SI à Internet.',
      pourquoi:
        '../../mesures/infras/securite-infrastructure-pare-feu-deploye-interconnexions-protegees-niveau1-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-pare-feu-deploye-interconnexions-protegees-niveau1-comment.pug',
    },
    priorisation: 20,
  },
  'securite-infrastructure-pare-feu-deploye-logs-stockes': {
    niveau1: {
      titre:
        "Activer et conserver l'historique de l’ensemble des flux bloqués et des flux entrants et sortants identifiés par le pare-feu.",
      pourquoi:
        '../../mesures/infras/securite-infrastructure-pare-feu-deploye-logs-stockes-niveau1-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-pare-feu-deploye-logs-stockes-niveau1-comment.pug',
    },
    priorisation: 20,
  },
  'securite-infrastructure-si-industriel-pare-feu-deploye': {
    niveau1: {
      titre:
        'Fermer tous les flux et les ports non strictement nécessaires au SI industriel.',
      pourquoi:
        '../../mesures/infras/securite-infrastructure-si-industriel-pare-feu-deploye-niveau1-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-si-industriel-pare-feu-deploye-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Dans la mesure du possible et si non nécessaire, séparer le réseau industriel du réseau bureautique interne.',
      pourquoi:
        '../../mesures/infras/securite-infrastructure-si-industriel-pare-feu-deploye-niveau2-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-si-industriel-pare-feu-deploye-niveau2-comment.pug',
    },
    priorisation: 20,
  },
  'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees':
    {
      niveau1: {
        titre:
          'Déployer systématiquement toutes les mises à jour sur les équipements de sécurité dès que celles-ci sont disponibles et hors exceptions spécifiquement identifiées.',
        pourquoi:
          '../../mesures/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-niveau1-pourquoi.pug',
        comment:
          '../../mesures/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-niveau1-comment.pug',
      },
      priorisation: 2,
    },
  'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees':
    {
      niveau1: {
        titre:
          "Déployer systématiquement toutes les mises à jour sur les serveurs, services et logiciels d'administration dès que celles-ci sont disponibles et hors exceptions spécifiquement identifiées",
        pourquoi:
          '../../mesures/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-niveau1-pourquoi.pug',
        comment:
          '../../mesures/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-niveau1-comment.pug',
      },
      niveau2: {
        titre:
          'Mettre en œuvre des mesures de sécurité supplémentaires sur les systèmes ne pouvant pas bénéficier des mises à jour',
        pourquoi:
          '../../mesures/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-niveau2-pourquoi.pug',
        comment:
          '../../mesures/infras/securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-niveau2-comment.pug',
      },
      priorisation: 2,
    },
  'securite-infrastructure-outils-securisation-systeme-messagerie': {
    niveau1: {
      titre: "Mettre en œuvre une solution d'anti-spam et d'anti-hameçonnage",
      pourquoi:
        '../../mesures/infras/securite-infrastructure-outils-securisation-systeme-messagerie-niveau1-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-outils-securisation-systeme-messagerie-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Mettre en œuvre des mécanismes complémentaires de protection contre les mails illégitimes',
      pourquoi:
        '../../mesures/infras/securite-infrastructure-outils-securisation-systeme-messagerie-niveau2-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-outils-securisation-systeme-messagerie-niveau2-comment.pug',
    },
    priorisation: 22,
  },
  'securite-infrastructure-acces-wifi-securises': {
    niveau1: {
      titre: 'Mettre en place des mesures de sécurisation wifi.',
      pourquoi:
        '../../mesures/infras/securite-infrastructure-acces-wifi-securises-niveau1-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-acces-wifi-securises-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        "Restreindre l'accès à l'interface d’administration dédiée seulement via le réseau cablé (et non en Wifi).",
      pourquoi:
        '../../mesures/infras/securite-infrastructure-acces-wifi-securises-niveau2-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-acces-wifi-securises-niveau2-comment.pug',
    },
    priorisation: 29,
  },
  'securite-infrastructure-espace-stockage-serveurs': {
    niveau1: {
      titre:
        "Mettre en place des mesures de sécurisation de l'espace dédié au stockage des serveurs d'administration et des équipements réseau.",
      pourquoi:
        '../../mesures/infras/securite-infrastructure-espace-stockage-serveurs-niveau1-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-espace-stockage-serveurs-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        "En complément des pratiques déjà en œuvre, mettre en place des mesures complémentaires de sécurisation de l'espace dédié au stockage des serveurs d'administration et des équipements réseau.",
      pourquoi:
        '../../mesures/infras/securite-infrastructure-espace-stockage-serveurs-niveau2-pourquoi.pug',
      comment:
        '../../mesures/infras/securite-infrastructure-espace-stockage-serveurs-niveau2-comment.pug',
    },
    priorisation: 30,
  },
};
