// Fichier créé manuellement, car depuis l'UI Kit v1.26, il n'est plus généré automatiquement.
// En théorie, l'UI kit devrait le fournir, mais comme solution de contournement, on le crée manuellement.
declare namespace JSX {
  interface IntrinsicElements {
    'lab-anssi-alerte': { description: string };
    'lab-anssi-centre-aide': { nomService: string; liens: string };
    'lab-anssi-bouton-suite-cyber-navigation': { sourceUtm?: string };
    'lab-anssi-navigation-pied-de-page': { conforme?: string };
    'lab-anssi-mes-services-cyber-lien-diagnostic-cyber': {
      lien: string;
      versExterne?: string;
    };
    'lab-anssi-mes-services-cyber-bandeau': {};
    'lab-anssi-resume-pssi': { nomService: string };
    'lab-anssi-brique-contenu-a-deux-colonnes': {
      titre: string;
      paragraphe: string;
      action?: string;
      ordre?: string;
      illustration: string;
    };
    'lab-anssi-brique-hero': {
      titre: string;
      soustitre: string;
      illustration: string;
      badge?: string;
      actiongauche: string;
      actiondroite: string;
      partenaires?: string;
    };
    'lab-anssi-titre-multimedia': { titre: string; multimedia: string };
    'lab-anssi-presentation-anssi': {};
    'lab-anssi-brique-rejoindre-la-communaute': {
      titre: string;
      raisons: string;
      action?: string;
      illustration: string;
    };
    'lab-anssi-temoignages': { titre?: string; temoignages?: string };
    'lab-anssi-marelle': {
      titre?: string;
      etapesmarelle?: string;
      action: string;
    };
    'lab-anssi-carrousel-tuiles': { tuiles?: string };
    'lab-anssi-bandeau-titre': {
      titre: string;
      description?: string;
      'fil-ariane'?: string;
      tag?: string;
    };
    'lab-anssi-liste-articles': {
      articles: string;
      categories: string;
      'id-categorie-choisie'?: string;
    };
    'lab-anssi-page-crisp': { contenu: string; 'table-des-matieres': string };
  }
}
