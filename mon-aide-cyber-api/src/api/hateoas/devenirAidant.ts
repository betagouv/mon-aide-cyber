import { ContexteSpecifique } from './contextesUtilisateur';
import { Options } from './hateoas';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { isBefore } from 'date-fns';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

const estNouveauParcoursDevenirAidantActif = isBefore(
  FournisseurHorloge.enDate(
    adaptateurEnvironnement.nouveauParcoursDevenirAidant()
  ),
  FournisseurHorloge.maintenant()
);

export const finaliseCreationEspaceAidant: ContexteSpecifique = {
  'finalise-creation-espace-aidant': {
    ...(estNouveauParcoursDevenirAidantActif
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
};
export const demandeDevenirAidant: ContexteSpecifique & {
  'demande-devenir-aidant': {
    'envoyer-demande-devenir-aidant': Options;
    'demande-devenir-aidant': Options;
    'rechercher-entreprise': Options;
  };
} = {
  'demande-devenir-aidant': {
    'envoyer-demande-devenir-aidant': {
      url: '/api/demandes/devenir-aidant',
      methode: 'POST',
    },
    'demande-devenir-aidant': {
      url: '/api/demandes/devenir-aidant',
      methode: 'GET',
    },
    'rechercher-entreprise': {
      url: '/api/recherche-entreprise',
      methode: 'GET',
    },
  },
};
