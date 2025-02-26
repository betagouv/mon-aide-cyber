import { useEffect } from 'react';

export type Titres =
  | 'Accueil'
  | 'Accessibilité'
  | 'CGU'
  | "Charte de l'Aidant"
  | 'Relais Associatifs'
  | 'Annuaire des Aidants'
  | 'Solliciter un Aidant'
  | 'Bénéficier du dispositif'
  | 'Statistiques'
  | 'Kit de Communication'
  | 'Mentions légales'
  | 'Utilisation du service'
  | 'Devenir Aidant cyber'
  | 'Connexion'
  | 'Diagnostic libre accès'
  | 'Diagnostic'
  | 'Mot de passe oublié'
  | 'Réinitialiser mot de passe';

export const useTitreDePage = (titre: Titres | string) => {
  useEffect(() => {
    document.title = `${titre} | MonAideCyber`;
  }, [titre]);
  return;
};
