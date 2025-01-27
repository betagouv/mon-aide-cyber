import { ContexteSpecifique } from './contextesUtilisateur';
import { Options } from './hateoas';
import { estDateNouveauParcoursDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/nouveauParcours';
import { rechercheEntreprise } from './rechercheEntreprise';

export const finaliseCreationEspaceAidant: () => ContexteSpecifique = () => ({
  'finalise-creation-espace-aidant': {
    ...(estDateNouveauParcoursDemandeDevenirAidant()
      ? {
          'finalise-creation-nouvel-espace-aidant': {
            url: '/api/demandes/devenir-aidant/creation-espace-aidant',
            methode: 'POST',
          },
        }
      : {
          'finalise-creation-espace-aidant': {
            url: '/api/demandes/devenir-aidant/creation-espace-aidant',
            methode: 'POST',
          },
        }),
  },
});

export const demandeDevenirAidant: () => ContexteSpecifique & {
  'demande-devenir-aidant': {
    'envoyer-demande-devenir-aidant': Options;
    'demande-devenir-aidant'?: Options;
    'nouvelle-demande-devenir-aidant'?: Options;
    'rechercher-entreprise': Options;
  };
} = () => ({
  'demande-devenir-aidant': {
    ...(estDateNouveauParcoursDemandeDevenirAidant()
      ? {
          'nouvelle-demande-devenir-aidant': {
            url: '/api/demandes/devenir-aidant',
            methode: 'GET',
          },
        }
      : {
          'demande-devenir-aidant': {
            url: '/api/demandes/devenir-aidant',
            methode: 'GET',
          },
        }),
    'envoyer-demande-devenir-aidant': {
      url: '/api/demandes/devenir-aidant',
      methode: 'POST',
    },
    ...rechercheEntreprise,
  },
});
