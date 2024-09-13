import { ReactElement } from 'react';
import { construisErreur, PresentationErreur } from '../alertes/Erreurs.tsx';

type ErreurCreationMotDePasse = {
  motDePasse?: PresentationErreur;
};

export type EtatCreationMotDePasse = {
  nouveauMotDePasse: string;
  motDePasseConfirme: string;
  champsErreur?: ReactElement;
  erreur?: ErreurCreationMotDePasse;
  messagesErreurs: MessagesErreurs;
  saisieValide: () => boolean;
};

enum TypeActionCreationMotDePasse {
  CREATION_MOT_DE_PASSE_VALIDEE = 'CREATION_MOT_DE_PASSE_VALIDEE',
  CREATION_MOT_DE_PASSE_INVALIDEE = 'CREATION_MOT_DE_PASSE_INVALIDEE',
  NOUVEAU_MOT_DE_PASSE_SAISI = 'NOUVEAU_MOT_DE_PASSE_SAISI',
  NOUVEAU_MOT_DE_PASSE_CONFIRME = 'NOUVEAU_MOT_DE_PASSE_CONFIRME',
  REINITIALISE = 'REINITIALISE',
}

type ActionCreationMotDePasse =
  | {
      type: TypeActionCreationMotDePasse.CREATION_MOT_DE_PASSE_VALIDEE;
    }
  | {
      type: TypeActionCreationMotDePasse.CREATION_MOT_DE_PASSE_INVALIDEE;
    }
  | {
      nouveauMotDePasse: string;
      type: TypeActionCreationMotDePasse.NOUVEAU_MOT_DE_PASSE_SAISI;
    }
  | {
      motDePasseConfirme: string;
      type: TypeActionCreationMotDePasse.NOUVEAU_MOT_DE_PASSE_CONFIRME;
    }
  | {
      type: TypeActionCreationMotDePasse.REINITIALISE;
    };

export const reducteurCreationMotDePasse = (
  etat: EtatCreationMotDePasse,
  action: ActionCreationMotDePasse
): EtatCreationMotDePasse => {
  const verifieLesMotsDePasseSaisis = (
    nouveauMotDePasse: string,
    motDePasseConfirme: string
  ) => {
    const motsDePasseIdentiques = nouveauMotDePasse === motDePasseConfirme;
    const motsDePasseNonVides =
      nouveauMotDePasse.trim().length > 0 &&
      motDePasseConfirme.trim().length > 0;
    return {
      valide: motsDePasseIdentiques && motsDePasseNonVides,
      motsDePasseIdentiques,
      motsDePasseNonVides,
    };
  };

  const construisErreurMotDePasse = (verificationMotsDePasseSaisis: {
    motsDePasseNonVides: boolean;
    valide: boolean;
    motsDePasseIdentiques: boolean;
  }) => {
    let erreurMotDePasse =
      !verificationMotsDePasseSaisis.motsDePasseIdentiques && {
        ...construisErreur('motDePasse', {
          texte: etat.messagesErreurs.motsDePasseConfirmeDifferent,
          identifiantTexteExplicatif: 'motDePasseConfirme',
        }),
      };
    if (!verificationMotsDePasseSaisis.motsDePasseNonVides) {
      erreurMotDePasse = !verificationMotsDePasseSaisis.motsDePasseNonVides && {
        ...construisErreur('motDePasse', {
          texte: etat.messagesErreurs.motsDePasseVides,
          identifiantTexteExplicatif: 'nouveauMotDePasse',
        }),
      };
    }
    return erreurMotDePasse;
  };

  switch (action.type) {
    case TypeActionCreationMotDePasse.REINITIALISE: {
      const etatCourant = { ...etat };
      delete etatCourant['erreur'];
      delete etatCourant['champsErreur'];
      return {
        ...etatCourant,
        nouveauMotDePasse: '',
        motDePasseConfirme: '',
        saisieValide: () => false,
      };
    }
    case TypeActionCreationMotDePasse.NOUVEAU_MOT_DE_PASSE_SAISI: {
      return {
        ...etat,
        nouveauMotDePasse: action.nouveauMotDePasse,
        saisieValide: () =>
          verifieLesMotsDePasseSaisis(
            action.nouveauMotDePasse,
            etat.motDePasseConfirme
          ).valide,
      };
    }
    case TypeActionCreationMotDePasse.NOUVEAU_MOT_DE_PASSE_CONFIRME: {
      const erreur = { ...etat.erreur };
      delete erreur['motDePasse'];
      return {
        ...etat,
        erreur: { ...erreur },
        motDePasseConfirme: action.motDePasseConfirme,
        saisieValide: () =>
          verifieLesMotsDePasseSaisis(
            etat.nouveauMotDePasse,
            action.motDePasseConfirme
          ).valide,
      };
    }
    case TypeActionCreationMotDePasse.CREATION_MOT_DE_PASSE_INVALIDEE: {
      const etatCourant = { ...etat };
      return {
        ...etatCourant,
        motDePasseConfirme: '',
        nouveauMotDePasse: '',
        saisieValide: () => false,
      };
    }
    case TypeActionCreationMotDePasse.CREATION_MOT_DE_PASSE_VALIDEE: {
      const verificationMotsDePasseSaisis = verifieLesMotsDePasseSaisis(
        etat.nouveauMotDePasse,
        etat.motDePasseConfirme
      );
      return {
        ...etat,
        erreur: {
          ...construisErreurMotDePasse(verificationMotsDePasseSaisis),
        },
        saisieValide: () => verificationMotsDePasseSaisis.valide,
      };
    }
  }
};

export const creationMotDePasseValidee = (): ActionCreationMotDePasse => ({
  type: TypeActionCreationMotDePasse.CREATION_MOT_DE_PASSE_VALIDEE,
});

export const nouveauMotDePasseSaisi = (
  nouveauMotDePasse: string
): ActionCreationMotDePasse => ({
  nouveauMotDePasse,
  type: TypeActionCreationMotDePasse.NOUVEAU_MOT_DE_PASSE_SAISI,
});

export const nouveauMotDePasseConfirme = (
  motDePasseConfirme: string
): ActionCreationMotDePasse => ({
  motDePasseConfirme,
  type: TypeActionCreationMotDePasse.NOUVEAU_MOT_DE_PASSE_CONFIRME,
});

export const reinitialiseLeReducteur = (): ActionCreationMotDePasse => ({
  type: TypeActionCreationMotDePasse.REINITIALISE,
});

export type MessagesErreurs = {
  motsDePasseVides: string;
  motsDePasseConfirmeDifferent: string;
};
export const initialiseReducteur = (
  messagesErreurs: MessagesErreurs
): EtatCreationMotDePasse => ({
  nouveauMotDePasse: '',
  motDePasseConfirme: '',
  saisieValide: () => false,
  erreur: {},
  messagesErreurs,
});
