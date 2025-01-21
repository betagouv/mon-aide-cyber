import { ContexteSpecifique } from './contextesUtilisateur';
import { Options } from './hateoas';

export const afficherTableauDeBord: ContexteSpecifique & {
  'afficher-tableau-de-bord': Options;
} = {
  'afficher-tableau-de-bord': {
    url: '/api/mon-espace/tableau-de-bord',
    methode: 'GET',
  },
};
export const modifierProfil: ContexteSpecifique = {
  'modifier-profil': {
    url: '/api/profil',
    methode: 'PATCH',
  },
};
export const afficherProfil: ContexteSpecifique = {
  'afficher-profil': {
    url: '/api/profil',
    methode: 'GET',
  },
};
export const modifierMotDePasse: ContexteSpecifique = {
  'modifier-mot-de-passe': {
    url: '/api/profil/modifier-mot-de-passe',
    methode: 'POST',
  },
};
