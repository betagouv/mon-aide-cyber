import { construisErreur, PresentationErreur } from '../erreurs/Erreurs.tsx';
import { ReactElement } from 'react';

type ErreurModificationMotDePasse = {
  motDePasse?: PresentationErreur;
};

export type EtatModificationMotDePasse = {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  motDePasseConfirme: string;
  champsErreur?: ReactElement;
  erreur?: ErreurModificationMotDePasse;
  messagesErreurs: MessagesErreurs;
  saisieValide: () => boolean;
};

enum TypeActionModificationMotDePasse {
  MODIFICATION_MOT_DE_PASSE_VALIDEE = 'MODIFICATION_MOT_DE_PASSE_VALIDEE',
  MODIFICATION_MOT_DE_PASSE_INVALIDEE = 'MODIFICATION_MOT_DE_PASSE_INVALIDEE',
  NOUVEAU_MOT_DE_PASSE_SAISI = 'NOUVEAU_MOT_DE_PASSE_SAISI',
  NOUVEAU_MOT_DE_PASSE_CONFIRME = 'NOUVEAU_MOT_DE_PASSE_CONFIRME',
  ANCIEN_MOT_DE_PASSE_SAISI = 'ANCIEN_MOT_DE_PASSE_SAISI',
}

type ActionModificationMotDePasse =
  | {
      type: TypeActionModificationMotDePasse.MODIFICATION_MOT_DE_PASSE_VALIDEE;
    }
  | {
      type: TypeActionModificationMotDePasse.MODIFICATION_MOT_DE_PASSE_INVALIDEE;
    }
  | {
      nouveauMotDePasse: string;
      type: TypeActionModificationMotDePasse.NOUVEAU_MOT_DE_PASSE_SAISI;
    }
  | {
      motDePasseConfirme: string;
      type: TypeActionModificationMotDePasse.NOUVEAU_MOT_DE_PASSE_CONFIRME;
    }
  | {
      ancienMotDePasse: string;
      type: TypeActionModificationMotDePasse.ANCIEN_MOT_DE_PASSE_SAISI;
    };

export const reducteurModificationMotDePasse = (
  etat: EtatModificationMotDePasse,
  action: ActionModificationMotDePasse,
): EtatModificationMotDePasse => {
  const verifieLesMotsDePasseSaisis = (
    nouveauMotDePasse: string,
    motDePasseConfirme: string,
    ancienMotDePasse: string,
  ) => {
    const motsDePasseIdentiques = nouveauMotDePasse === motDePasseConfirme;
    const ancienMotDePasseDifferentDuNouveauMotDePasse =
      ancienMotDePasse !== nouveauMotDePasse;
    const motsDePasseNonVides =
      nouveauMotDePasse.trim().length > 0 &&
      motDePasseConfirme.trim().length > 0 &&
      ancienMotDePasse.trim().length > 0;
    return {
      valide:
        motsDePasseIdentiques &&
        motsDePasseNonVides &&
        ancienMotDePasseDifferentDuNouveauMotDePasse,
      motsDePasseIdentiques,
      motsDePasseNonVides,
      ancienMotDePasseDifferentDuNouveauMotDePasse,
    };
  };

  const construisErreurMotDePasse = (verificationMotsDePasseSaisis: {
    motsDePasseNonVides: boolean;
    ancienMotDePasseDifferentDuNouveauMotDePasse: boolean;
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
    if (
      !verificationMotsDePasseSaisis.ancienMotDePasseDifferentDuNouveauMotDePasse
    ) {
      erreurMotDePasse =
        !verificationMotsDePasseSaisis.ancienMotDePasseDifferentDuNouveauMotDePasse && {
          ...construisErreur('motDePasse', {
            texte:
              etat.messagesErreurs.ancienMotDePasseIdentiqueAuNouveauMotDePasse,
            identifiantTexteExplicatif: 'nouveauMotDePasse',
          }),
        };
    }
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
    case TypeActionModificationMotDePasse.ANCIEN_MOT_DE_PASSE_SAISI: {
      const nouveauMotDePasse = etat.nouveauMotDePasse;
      const motDePasseConfirme = etat.motDePasseConfirme;
      return {
        ...etat,
        ancienMotDePasse: action.ancienMotDePasse,
        saisieValide: () =>
          verifieLesMotsDePasseSaisis(
            nouveauMotDePasse,
            motDePasseConfirme,
            action.ancienMotDePasse,
          ).valide,
      };
    }
    case TypeActionModificationMotDePasse.NOUVEAU_MOT_DE_PASSE_SAISI: {
      return {
        ...etat,
        nouveauMotDePasse: action.nouveauMotDePasse,
        saisieValide: () =>
          verifieLesMotsDePasseSaisis(
            action.nouveauMotDePasse,
            etat.motDePasseConfirme,
            etat.ancienMotDePasse,
          ).valide,
      };
    }
    case TypeActionModificationMotDePasse.NOUVEAU_MOT_DE_PASSE_CONFIRME: {
      const erreur = { ...etat.erreur };
      delete erreur['motDePasse'];
      return {
        ...etat,
        erreur: { ...erreur },
        motDePasseConfirme: action.motDePasseConfirme,
        saisieValide: () =>
          verifieLesMotsDePasseSaisis(
            etat.nouveauMotDePasse,
            action.motDePasseConfirme,
            etat.ancienMotDePasse,
          ).valide,
      };
    }
    case TypeActionModificationMotDePasse.MODIFICATION_MOT_DE_PASSE_INVALIDEE: {
      const etatCourant = { ...etat };
      return {
        ...etatCourant,
        ancienMotDePasse: '',
        motDePasseConfirme: '',
        nouveauMotDePasse: '',
        saisieValide: () => false,
      };
    }
    case TypeActionModificationMotDePasse.MODIFICATION_MOT_DE_PASSE_VALIDEE: {
      const verificationMotsDePasseSaisis = verifieLesMotsDePasseSaisis(
        etat.nouveauMotDePasse,
        etat.motDePasseConfirme,
        etat.ancienMotDePasse,
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

export const modificationMotDePasseValidee =
  (): ActionModificationMotDePasse => ({
    type: TypeActionModificationMotDePasse.MODIFICATION_MOT_DE_PASSE_VALIDEE,
  });

export const nouveauMotDePasseSaisi = (
  nouveauMotDePasse: string,
): ActionModificationMotDePasse => ({
  nouveauMotDePasse,
  type: TypeActionModificationMotDePasse.NOUVEAU_MOT_DE_PASSE_SAISI,
});

export const nouveauMotDePasseConfirme = (
  motDePasseConfirme: string,
): ActionModificationMotDePasse => ({
  motDePasseConfirme,
  type: TypeActionModificationMotDePasse.NOUVEAU_MOT_DE_PASSE_CONFIRME,
});

export const ancienMotDePasseSaisi = (
  ancienMotDePasse: string,
): ActionModificationMotDePasse => ({
  ancienMotDePasse: ancienMotDePasse,
  type: TypeActionModificationMotDePasse.ANCIEN_MOT_DE_PASSE_SAISI,
});

export type MessagesErreurs = {
  motsDePasseVides: string;
  ancienMotDePasseIdentiqueAuNouveauMotDePasse: string;
  motsDePasseConfirmeDifferent: string;
};
export const initialiseReducteur = (
  messagesErreurs: MessagesErreurs,
): EtatModificationMotDePasse => ({
  nouveauMotDePasse: '',
  motDePasseConfirme: '',
  ancienMotDePasse: '',
  saisieValide: () => false,
  erreur: {},
  messagesErreurs,
});
