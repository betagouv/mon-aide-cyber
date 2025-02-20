import { ContexteSpecifique } from './contextesUtilisateur';
import { Options } from './hateoas';
import { rechercheEntreprise } from './rechercheEntreprise';

export const finaliseCreationEspaceAidant: () => ContexteSpecifique = () => ({
  'finalise-creation-espace-aidant': {
    'finalise-creation-espace-aidant': {
      url: '/api/demandes/devenir-aidant/creation-espace-aidant',
      methode: 'POST',
    },
  },
});

export const demandeDevenirAidant: ContexteSpecifique & {
  'demande-devenir-aidant': {
    'envoyer-demande-devenir-aidant': Options;
    'demande-devenir-aidant': Options;
    'rechercher-entreprise': Options;
  };
} = {
  'demande-devenir-aidant': {
    'demande-devenir-aidant': {
      url: '/api/demandes/devenir-aidant',
      methode: 'GET',
    },
    'envoyer-demande-devenir-aidant': {
      url: '/api/demandes/devenir-aidant',
      methode: 'POST',
    },
    ...rechercheEntreprise,
  },
};
