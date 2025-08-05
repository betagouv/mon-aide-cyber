import { useEffect } from 'react';

export type Titres =
  | 'Accueil'
  | 'Accessibilité'
  | 'CGU'
  | "Charte de l'Aidant"
  | 'Relais Associatifs'
  | 'Annuaire des Aidants'
  | 'Statistiques'
  | 'Kit de Communication'
  | 'Mentions légales'
  | 'Connexion'
  | 'Diagnostic libre accès'
  | 'Diagnostic'
  | 'Mot de passe oublié'
  | 'Réinitialiser mot de passe'
  | 'S‘inscrire'
  | 'Annuaire des Aidants cyber'
  | 'Créer mon espace Aidant cyber'
  | "Charte de l'Aidant cyber"
  | 'Guide des Aidants cyber'
  | 'Promouvoir la communauté des Aidants cyber'
  | 'Promouvoir le diagnostic cyber';

const metadonneesSelonTitre: Record<Titres, string> = {
  Accueil:
    'Des Aidants cyber mobilisés pour aider les entités publiques et privées à prendre leur cyberdépart grâce à un diagnostic cybersécurité gratuit.',
  Accessibilité:
    "Découvrez notre engagement envers l'accessibilité sur MonAideCyber. Consultez nos efforts pour rendre nos services numériques accessibles à tous.",
  CGU: "Découvrez les conditions générales d'utilisation sur MonAideCyber",
  "Charte de l'Aidant":
    'Charte de l’Aidant cyber : les engagements et bonnes pratiques que doivent respecter les aidants bénévoles du dispositif MonAideCyber de l’ANSSI.',
  'Relais Associatifs':
    'Découvrez les relais associatifs qui collaborent avec MonAideCyber.',
  'Annuaire des Aidants': '',
  Statistiques:
    'Consultez les données d’usage de MonAideCyber : nombre d’Aidants cyber accompagnées, diagnostics réalisés,…',
  'Kit de Communication': '',
  'Mentions légales':
    "Découvrez les mentions légales de MonAideCyber. Consultez nos conditions d'utilisation, notre politique de confidentialité et nos engagements en matière de sécurité numérique. Protégez-vous en toute transparence.",
  Connexion:
    'Connectez‑vous à MonAideCyber pour accéder à votre espace Aidant cyber et réaliser des diagnostics cyber gratuits.',
  'Diagnostic libre accès':
    'Toutes les ressources pour faire la promotion de la communauté des Aidants cyber',
  Diagnostic: '',
  'Mot de passe oublié': '',
  'Réinitialiser mot de passe': '',
  'S‘inscrire': 'S‘inscrire à MonAideCyber.',
  'Annuaire des Aidants cyber':
    'L‘annuaire des Aidants cyber ayant souhaité y être référencés.',
  'Créer mon espace Aidant cyber': '',
  "Charte de l'Aidant cyber": 'La charte de l‘Aidant cyber',
  'Guide des Aidants cyber':
    'Tous les conseils et les ressources pour être un Aidant cyber actif et engagé',
  'Promouvoir la communauté des Aidants cyber':
    'Toutes les ressources pour faire la promotion de la communauté des Aidants cyber',
  'Promouvoir le diagnostic cyber':
    'Toutes les ressources pour faire la promotion du diagnostic cyber et trouver des entités à accompagner',
};

export function useDonneesSEO(titre: Titres) {
  useEffect(() => {
    document.title = `${titre} | MonAideCyber`;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', metadonneesSelonTitre[titre]);
    }
  }, [titre]);

  return;
}
