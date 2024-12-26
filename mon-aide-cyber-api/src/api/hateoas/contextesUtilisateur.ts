import { Options } from './hateoas';
import {
  demandeDevenirAidant,
  finaliseCreationEspaceAidant,
} from './devenirAidant';
import { demandeAide, demandeEtreAide } from './etreAide';
import { solliciterAide } from './solliciterAide';
import {
  seConnecter,
  seConnecterAveProConnect,
  seDeconnecter,
  seDeconnecterDeProConnect,
} from './connexion';
import { afficherStatistiques } from './afficherStatistiques';
import { afficherAnnuaireAidants } from './annuaireAidants';
import {
  reinitialisationMotDePasse,
  reinitialiserMotDePasse,
} from './reinitialisationMotDePasse';
import { afficherDiagnostic, creerDiagnostic } from './diagnosticLibreAcces';
import {
  afficherPreferences,
  afficherProfil,
  afficherTableauDeBord,
  lancerDiagnostic,
  modifierMotDePasse,
  modifierPreferences,
  modifierProfil,
} from './aidant';

type ClefContexte =
  | 'aidant'
  | 'aidant:acceder-au-profil'
  | 'aidant:acceder-aux-informations-utilisateur'
  | 'demande-devenir-aidant'
  | 'demande-etre-aide'
  | 'solliciter-aide'
  | 'se-connecter'
  | 'se-deconnecter'
  | 'se-deconnecter-avec-pro-connect'
  | 'afficher-statistiques'
  | 'afficher-annuaire-aidants'
  | 'reinitialisation-mot-de-passe'
  | 'utiliser-outil-diagnostic'
  | 'valider-signature-cgu'
  | string;

export type ContextesUtilisateur = {
  [clef in ClefContexte]: ContexteGeneral;
};

export const contextesUtilisateur: ContextesUtilisateur = {
  'demande-devenir-aidant': {
    ...finaliseCreationEspaceAidant,
    ...demandeDevenirAidant,
  },
  'demande-etre-aide': {
    ...demandeEtreAide,
    ...demandeAide,
  },
  'solliciter-aide': {
    ...solliciterAide,
  },
  'se-connecter': {
    ...seConnecter,
    ...(process.env.PRO_CONNECT_ACTIF === 'true' && seConnecterAveProConnect),
  },
  'se-deconnecter': { ...seDeconnecter },
  'se-deconnecter-avec-pro-connect': { ...seDeconnecterDeProConnect },
  'afficher-statistiques': {
    ...afficherStatistiques,
  },
  'afficher-annuaire-aidants': {
    ...afficherAnnuaireAidants,
  },
  'reinitialisation-mot-de-passe': {
    ...reinitialiserMotDePasse,
    ...reinitialisationMotDePasse,
  },
  'utiliser-outil-diagnostic': {
    ...creerDiagnostic,
    ...afficherDiagnostic,
  },
  aidant: {
    'acceder-au-profil': {
      ...lancerDiagnostic,
      ...afficherTableauDeBord,
      ...(process.env
        .FEATURE_FLAG_ESPACE_AIDANT_ECRAN_PROFIL_MODIFIER_PROFIL === 'true' &&
        modifierProfil),
      ...modifierMotDePasse,
      ...seDeconnecter,
    },
    'pro-connect-acceder-au-profil': {
      ...lancerDiagnostic,
      ...afficherTableauDeBord,
      ...(process.env
        .FEATURE_FLAG_ESPACE_AIDANT_ECRAN_PROFIL_MODIFIER_PROFIL === 'true' &&
        modifierProfil),
      ...seDeconnecterDeProConnect,
    },
    'acceder-aux-informations-utilisateur': {
      ...lancerDiagnostic,
      ...afficherTableauDeBord,
      ...afficherProfil,
      ...afficherPreferences,
    },
    'acceder-au-tableau-de-bord': {
      ...lancerDiagnostic,
      ...afficherProfil,
      ...afficherPreferences,
    },
    'modifier-preferences': {
      ...modifierPreferences,
    },
  },
  'valider-signature-cgu': {
    'valider-signature-cgu': {
      methode: 'POST',
      url: '/api/utilisateur/valider-signature-cgu',
    },
  },
};
export type ContexteSpecifique = {
  [clef: string]: ContexteSpecifique | Options;
};
export type ContexteGeneral = {
  [clef: string]: ContexteSpecifique | Options;
};
