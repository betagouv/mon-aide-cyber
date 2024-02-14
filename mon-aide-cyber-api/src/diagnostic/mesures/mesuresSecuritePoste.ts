export const mesuresSecuritePoste = {
  'securite-poste-maj-fonctionnelles-et-securite-deployees': {
    niveau1: {
      titre:
        'Déployer systématiquement toutes les mises à jour sur les postes de travail dès que celles-ci sont disponibles et hors exceptions spécifiquement identifiées',
      pourquoi:
        '../../mesures/postes/securite-poste-maj-fonctionnelles-et-securite-deployees-niveau1-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-maj-fonctionnelles-et-securite-deployees-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Mettre en œuvre des mesures de sécurité supplémentaires sur les systèmes ne pouvant pas bénéficier des mises à jour',
      pourquoi:
        '../../mesures/postes/securite-poste-maj-fonctionnelles-et-securite-deployees-niveau2-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-maj-fonctionnelles-et-securite-deployees-niveau2-comment.pug',
    },
    priorisation: 7,
  },
  'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees': {
    niveau1: {
      titre:
        'Déployer systématiquement toutes les mises à jour sur les postes de travail dédiés aux systèmes industriels dès que celles-ci sont disponibles et hors exceptions spécifiquement identifiées',
      pourquoi:
        '../../mesures/postes/securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-niveau1-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-niveau1-comment.pug',
    },
    niveau2: {
      titre:
        'Mettre en œuvre des mesures de sécurité supplémentaires sur les systèmes ne pouvant pas bénéficier des mises à jour',
      pourquoi:
        '../../mesures/postes/securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-niveau2-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-niveau2-comment.pug',
    },
    priorisation: 7,
  },
  'securite-poste-antivirus-deploye': {
    niveau1: {
      titre:
        'Installer de manière systématique un antivirus sur les postes de travail, vérifier régulièrement leur bon fonctionnement et leurs mises à jour.',
      pourquoi:
        '../../mesures/postes/securite-poste-antivirus-deploye-niveau1-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-antivirus-deploye-niveau1-comment.pug',
    },
    niveau2: {
      titre: "Traiter systématiquement les alertes générées par l'antivirus",
      pourquoi:
        '../../mesures/postes/securite-poste-antivirus-deploye-niveau2-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-antivirus-deploye-niveau2-comment.pug',
    },
    priorisation: 3,
  },
  'securite-poste-si-industriel-antivirus-deploye': {
    niveau1: {
      titre:
        'Installer de manière systématique un antivirus sur les postes de travail du SI Industriel, vérifier régulièrement leur bon fonctionnement et leurs mises à jour.',
      pourquoi:
        '../../mesures/postes/securite-poste-si-industriel-antivirus-deploye-niveau1-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-si-industriel-antivirus-deploye-niveau1-comment.pug',
    },
    niveau2: {
      titre: "Traiter systématiquement les alertes générées par l'antivirus",
      pourquoi:
        '../../mesures/postes/securite-poste-si-industriel-antivirus-deploye-niveau2-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-si-industriel-antivirus-deploye-niveau2-comment.pug',
    },
    priorisation: 3,
  },
  'securite-poste-pare-feu-local-active': {
    niveau1: {
      titre:
        'Activer systématiquement le pare-feu local sur les postes de tavail avec comme règle générale d’interdire par défaut les flux entrants. Vérifier régulièrement leur activation sur tous les postes de travail.',
      pourquoi:
        '../../mesures/postes/securite-poste-pare-feu-local-active-niveau1-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-pare-feu-local-active-niveau1-comment.pug',
    },
    priorisation: 4,
  },
  'securite-poste-outils-complementaires-securisation': {
    niveau1: {
      titre:
        'Mettre en œuvre une solution de type EDR (Endpoint Detection & Response)',
      pourquoi:
        '../../mesures/postes/securite-poste-outils-complementaires-securisation-niveau1-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-outils-complementaires-securisation-niveau1-comment.pug',
    },
    niveau2: {
      titre: "Traiter systématiquement les alertes générées par l'EDR",
      pourquoi:
        '../../mesures/postes/securite-poste-outils-complementaires-securisation-niveau2-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-outils-complementaires-securisation-niveau2-comment.pug',
    },
    priorisation: 25,
  },
  'securite-poste-r-et-d-disques-chiffres': {
    niveau1: {
      titre: 'Chiffrer les disques durs des matériels nomades.',
      pourquoi:
        '../../mesures/postes/securite-poste-r-et-d-disques-chiffres-niveau1-pourquoi.pug',
      comment:
        '../../mesures/postes/securite-poste-r-et-d-disques-chiffres-niveau1-comment.pug',
    },
    priorisation: 29,
  },
};
