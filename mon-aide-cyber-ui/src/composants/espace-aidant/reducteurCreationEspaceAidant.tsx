import { ChampsErreur, construisErreur, PresentationErreur } from '../erreurs/Erreurs.tsx';
import { ReactElement } from 'react';

type ErreurCreationEspaceAidant = {
  cguSignees?: PresentationErreur;
  charteSignee?: PresentationErreur;
  motDePasse?: PresentationErreur;
};

export type EtatCreationEspaceAidant = {
  cguSignees: boolean;
  nouveauMotDePasse: string;
  motDePasseTemporaire: string;
  motDePasseConfirme: string;
  champsErreur?: ReactElement;
  erreur?: ErreurCreationEspaceAidant;
  creationEspaceAidantATransmettre?: boolean;
  saisieValide: () => boolean;
};

enum TypeActionCreationEspaceAidant {
  CREATION_ESPACE_AIDANT_VALIDEE = 'CREATION_ESPACE_AIDANT_VALIDEE',
  CGU_CLIQUEES = 'CGU_CLIQUEES',
  CREATION_ESPACE_AIDANT_TRANSMISE = 'CREATION_ESPACE_AIDANT_TRANSMISE',
  CREATION_ESPACE_AIDANT_INVALIDEE = 'CREATION_ESPACE_AIDANT_INVALIDEE',
  NOUVEAU_MOT_DE_PASSE_SAISI = 'NOUVEAU_MOT_DE_PASSE_SAISI',
  NOUVEAU_MOT_DE_PASSE_CONFIRME = 'NOUVEAU_MOT_DE_PASSE_CONFIRME',
  MOT_DE_PASSE_TEMPORAIRE_SAISI = 'MOT_DE_PASSE_TEMPORAIRE_SAISI',
}

type ActionCreationEspaceAidant =
  | {
      type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_VALIDEE;
    }
  | {
      type: TypeActionCreationEspaceAidant.CGU_CLIQUEES;
    }
  | {
      type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_TRANSMISE;
    }
  | {
      erreur: Error;
      type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_INVALIDEE;
    }
  | {
      nouveauMotDePasse: string;
      type: TypeActionCreationEspaceAidant.NOUVEAU_MOT_DE_PASSE_SAISI;
    }
  | {
      motDePasseConfirme: string;
      type: TypeActionCreationEspaceAidant.NOUVEAU_MOT_DE_PASSE_CONFIRME;
    }
  | {
      motDePasseTemporaire: string;
      type: TypeActionCreationEspaceAidant.MOT_DE_PASSE_TEMPORAIRE_SAISI;
    };

export const reducteurCreationEspaceAidant = (
  etat: EtatCreationEspaceAidant,
  action: ActionCreationEspaceAidant,
): EtatCreationEspaceAidant => {
  const construisErreurCGU = () =>
    construisErreur('cguSignees', {
      texte: 'Veuillez accepter les CGU.',
      identifiantTexteExplicatif: 'cguSignees',
    });

  const verifieLesMotsDePasseSaisis = (
    nouveauMotDePasse: string,
    motDePasseConfirme: string,
    motDePasseTemporaire: string,
  ) => {
    const motsDePasseIdentiques = nouveauMotDePasse === motDePasseConfirme;
    const motDePasseTemporaireDifferentDuNouveauMotDePasse = motDePasseTemporaire !== nouveauMotDePasse;
    const motsDePasseNonVides =
      nouveauMotDePasse.trim().length > 0 &&
      motDePasseConfirme.trim().length > 0 &&
      motDePasseTemporaire.trim().length > 0;
    return {
      valide: motsDePasseIdentiques && motsDePasseNonVides && motDePasseTemporaireDifferentDuNouveauMotDePasse,
      motsDePasseIdentiques,
      motsDePasseNonVides,
      motDePasseTemporaireDifferentDuNouveauMotDePasse,
    };
  };

  const construisErreurMotDePasse = (verificationMotsDePasseSaisis: {
    motsDePasseNonVides: boolean;
    motDePasseTemporaireDifferentDuNouveauMotDePasse: boolean;
    valide: boolean;
    motsDePasseIdentiques: boolean;
  }) => {
    let erreurMotDePasse = !verificationMotsDePasseSaisis.motsDePasseIdentiques && {
      ...construisErreur('motDePasse', {
        texte: 'La confirmation de votre mot de passe ne correspond pas au mot de passe saisi.',
        identifiantTexteExplicatif: 'motDePasseConfirme',
      }),
    };
    if (!verificationMotsDePasseSaisis.motDePasseTemporaireDifferentDuNouveauMotDePasse) {
      erreurMotDePasse = !verificationMotsDePasseSaisis.motDePasseTemporaireDifferentDuNouveauMotDePasse && {
        ...construisErreur('motDePasse', {
          texte: 'Votre nouveau mot de passe doit être différent du mot de passe temporaire.',
          identifiantTexteExplicatif: 'nouveauMotDePasse',
        }),
      };
    }
    if (!verificationMotsDePasseSaisis.motsDePasseNonVides) {
      erreurMotDePasse = !verificationMotsDePasseSaisis.motsDePasseNonVides && {
        ...construisErreur('motDePasse', {
          texte: 'Vous devez saisir vos mots de passe.',
          identifiantTexteExplicatif: 'nouveauMotDePasse',
        }),
      };
    }
    return erreurMotDePasse;
  };

  switch (action.type) {
    case TypeActionCreationEspaceAidant.MOT_DE_PASSE_TEMPORAIRE_SAISI: {
      const nouveauMotDePasse = etat.nouveauMotDePasse;
      const motDePasseConfirme = etat.motDePasseConfirme;
      return {
        ...etat,
        motDePasseTemporaire: action.motDePasseTemporaire,
        saisieValide: () =>
          etat.cguSignees &&
          verifieLesMotsDePasseSaisis(nouveauMotDePasse, motDePasseConfirme, action.motDePasseTemporaire).valide,
      };
    }
    case TypeActionCreationEspaceAidant.NOUVEAU_MOT_DE_PASSE_SAISI: {
      return {
        ...etat,
        nouveauMotDePasse: action.nouveauMotDePasse,
        saisieValide: () =>
          verifieLesMotsDePasseSaisis(action.nouveauMotDePasse, etat.motDePasseConfirme, etat.motDePasseTemporaire)
            .valide && etat.cguSignees,
      };
    }
    case TypeActionCreationEspaceAidant.NOUVEAU_MOT_DE_PASSE_CONFIRME: {
      const erreur = { ...etat.erreur };
      delete erreur['motDePasse'];
      return {
        ...etat,
        erreur: { ...erreur },
        motDePasseConfirme: action.motDePasseConfirme,
        saisieValide: () =>
          etat.cguSignees &&
          verifieLesMotsDePasseSaisis(etat.nouveauMotDePasse, action.motDePasseConfirme, etat.motDePasseTemporaire)
            .valide,
      };
    }
    case TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_INVALIDEE: {
      const etatCourant = { ...etat };
      delete etatCourant['creationEspaceAidantATransmettre'];
      return {
        ...etatCourant,
        cguSignees: false,
        motDePasseTemporaire: '',
        motDePasseConfirme: '',
        nouveauMotDePasse: '',
        champsErreur: <ChampsErreur erreur={action.erreur} />,
        saisieValide: () => false,
      };
    }
    case TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_TRANSMISE: {
      const etatCourant = { ...etat };
      delete etatCourant['creationEspaceAidantATransmettre'];
      return {
        ...etatCourant,
      };
    }
    case TypeActionCreationEspaceAidant.CGU_CLIQUEES: {
      const cguSignees = !etat.cguSignees;
      const erreur = { ...etat.erreur };
      delete erreur['cguSignees'];
      return {
        ...etat,
        cguSignees: cguSignees,
        erreur: {
          ...erreur,
          ...(!cguSignees && construisErreurCGU()),
        },
        saisieValide: () =>
          cguSignees &&
          verifieLesMotsDePasseSaisis(etat.nouveauMotDePasse, etat.motDePasseConfirme, etat.motDePasseTemporaire)
            .valide,
      };
    }
    case TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_VALIDEE: {
      const verificationMotsDePasseSaisis = verifieLesMotsDePasseSaisis(
        etat.nouveauMotDePasse,
        etat.motDePasseConfirme,
        etat.motDePasseTemporaire,
      );
      return {
        ...etat,
        erreur: {
          ...(!etat.cguSignees && {
            ...construisErreurCGU(),
          }),
          ...construisErreurMotDePasse(verificationMotsDePasseSaisis),
        },
        saisieValide: () => etat.cguSignees && verificationMotsDePasseSaisis.valide,
        ...(etat.cguSignees &&
          verificationMotsDePasseSaisis.valide && {
            creationEspaceAidantATransmettre: etat.cguSignees && verificationMotsDePasseSaisis.valide,
          }),
      };
    }
  }
};

export const creationEspaceAidantValidee = (): ActionCreationEspaceAidant => ({
  type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_VALIDEE,
});

export const cguCliquees = (): ActionCreationEspaceAidant => ({
  type: TypeActionCreationEspaceAidant.CGU_CLIQUEES,
});

export const creationEspaceAidantTransmise = (): ActionCreationEspaceAidant => ({
  type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_TRANSMISE,
});

export const creationEspaceAidantInvalidee = (erreur: Error): ActionCreationEspaceAidant => ({
  erreur,
  type: TypeActionCreationEspaceAidant.CREATION_ESPACE_AIDANT_INVALIDEE,
});

export const nouveauMotDePasseSaisi = (nouveauMotDePasse: string): ActionCreationEspaceAidant => ({
  nouveauMotDePasse,
  type: TypeActionCreationEspaceAidant.NOUVEAU_MOT_DE_PASSE_SAISI,
});

export const nouveauMotDePasseConfirme = (motDePasseConfirme: string): ActionCreationEspaceAidant => ({
  motDePasseConfirme,
  type: TypeActionCreationEspaceAidant.NOUVEAU_MOT_DE_PASSE_CONFIRME,
});

export const motDePasseTemporaireSaisi = (motDePasseTemporaire: string): ActionCreationEspaceAidant => ({
  motDePasseTemporaire: motDePasseTemporaire,
  type: TypeActionCreationEspaceAidant.MOT_DE_PASSE_TEMPORAIRE_SAISI,
});
export const initialiseReducteur = (): EtatCreationEspaceAidant => ({
  cguSignees: false,
  nouveauMotDePasse: '',
  motDePasseConfirme: '',
  motDePasseTemporaire: '',
  saisieValide: () => false,
  erreur: {},
});
