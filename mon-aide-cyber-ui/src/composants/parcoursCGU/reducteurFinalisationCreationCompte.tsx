import {
  ChampsErreur,
  construisErreur,
  PresentationErreur,
} from '../erreurs/Erreurs.tsx';
import { ReactElement } from 'react';

type ErreurFinalisationCompte = {
  cguSignees?: PresentationErreur;
  charteSignee?: PresentationErreur;
  motDePasse?: PresentationErreur;
};

export type EtatFinalisationCreationCompte = {
  cguSignees: boolean;
  nouveauMotDePasse: string;
  motDePasseTemporaire: string;
  motDePasseConfirme: string;
  champsErreur?: ReactElement;
  erreur?: ErreurFinalisationCompte;
  finalisationCreationCompteATransmettre?: boolean;
  saisieValide: () => boolean;
};

enum TypeActionFinalisationCreationCompte {
  FINALISATION_CREATION_COMPTE_VALIDEE = 'FINALISATION_CREATION_COMPTE_VALIDEE',
  CGU_CLIQUEES = 'CGU_CLIQUEES',
  FINALISATION_CREATION_COMPTE_TRANSMISE = 'FINALISATION_CREATION_COMPTE_TRANSMISE',
  FINALISATION_CREATION_COMPTE_INVALIDEE = 'FINALISATION_CREATION_COMPTE_INVALIDEE',
  NOUVEAU_MOT_DE_PASSE_SAISI = 'NOUVEAU_MOT_DE_PASSE_SAISI',
  NOUVEAU_MOT_DE_PASSE_CONFIRME = 'NOUVEAU_MOT_DE_PASSE_CONFIRME',
  MOT_DE_PASSE_TEMPORAIRE_SAISI = 'MOT_DE_PASSE_TEMPORAIRE_SAISI',
}

type ActionFinalisationCreationCompte =
  | {
      type: TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_VALIDEE;
    }
  | {
      type: TypeActionFinalisationCreationCompte.CGU_CLIQUEES;
    }
  | {
      type: TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_TRANSMISE;
    }
  | {
      erreur: Error;
      type: TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_INVALIDEE;
    }
  | {
      nouveauMotDePasse: string;
      type: TypeActionFinalisationCreationCompte.NOUVEAU_MOT_DE_PASSE_SAISI;
    }
  | {
      motDePasseConfirme: string;
      type: TypeActionFinalisationCreationCompte.NOUVEAU_MOT_DE_PASSE_CONFIRME;
    }
  | {
      motDePasseTemporaire: string;
      type: TypeActionFinalisationCreationCompte.MOT_DE_PASSE_TEMPORAIRE_SAISI;
    };

export const reducteurFinalisationCreationCompte = (
  etat: EtatFinalisationCreationCompte,
  action: ActionFinalisationCreationCompte,
): EtatFinalisationCreationCompte => {
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
    const motDePasseTemporaireDifferentDuNouveauMotDePasse =
      motDePasseTemporaire !== nouveauMotDePasse;
    const motsDePasseNonVides =
      nouveauMotDePasse.trim().length > 0 &&
      motDePasseConfirme.trim().length > 0 &&
      motDePasseTemporaire.trim().length > 0;
    return {
      valide:
        motsDePasseIdentiques &&
        motsDePasseNonVides &&
        motDePasseTemporaireDifferentDuNouveauMotDePasse,
      motsDePasseIdentiques,
      motsDePasseNonVides,
      motDePasseTemporaireDifferentDuNouveauMotDePasse,
    };
  };

  function construisErreurMotDePasse(verificationMotsDePasseSaisis: {
    motsDePasseNonVides: boolean;
    motDePasseTemporaireDifferentDuNouveauMotDePasse: boolean;
    valide: boolean;
    motsDePasseIdentiques: boolean;
  }) {
    let erreurMotDePasse =
      !verificationMotsDePasseSaisis.motsDePasseIdentiques && {
        ...construisErreur('motDePasse', {
          texte:
            'La confirmation de votre mot de passe ne correspond pas au mot de passe saisi.',
          identifiantTexteExplicatif: 'motDePasseConfirme',
        }),
      };
    if (
      !verificationMotsDePasseSaisis.motDePasseTemporaireDifferentDuNouveauMotDePasse
    ) {
      erreurMotDePasse =
        !verificationMotsDePasseSaisis.motDePasseTemporaireDifferentDuNouveauMotDePasse && {
          ...construisErreur('motDePasse', {
            texte:
              'Votre nouveau mot de passe doit être différent du mot de passe temporaire.',
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
  }

  switch (action.type) {
    case TypeActionFinalisationCreationCompte.MOT_DE_PASSE_TEMPORAIRE_SAISI: {
      const nouveauMotDePasse = etat.nouveauMotDePasse;
      const motDePasseConfirme = etat.motDePasseConfirme;
      return {
        ...etat,
        motDePasseTemporaire: action.motDePasseTemporaire,
        saisieValide: () =>
          etat.cguSignees &&
          verifieLesMotsDePasseSaisis(
            nouveauMotDePasse,
            motDePasseConfirme,
            action.motDePasseTemporaire,
          ).valide,
      };
    }
    case TypeActionFinalisationCreationCompte.NOUVEAU_MOT_DE_PASSE_SAISI: {
      return {
        ...etat,
        nouveauMotDePasse: action.nouveauMotDePasse,
        saisieValide: () =>
          verifieLesMotsDePasseSaisis(
            action.nouveauMotDePasse,
            etat.motDePasseConfirme,
            etat.motDePasseTemporaire,
          ).valide && etat.cguSignees,
      };
    }
    case TypeActionFinalisationCreationCompte.NOUVEAU_MOT_DE_PASSE_CONFIRME: {
      const erreur = { ...etat.erreur };
      delete erreur['motDePasse'];
      return {
        ...etat,
        erreur: { ...erreur },
        motDePasseConfirme: action.motDePasseConfirme,
        saisieValide: () =>
          etat.cguSignees &&
          verifieLesMotsDePasseSaisis(
            etat.nouveauMotDePasse,
            action.motDePasseConfirme,
            etat.motDePasseTemporaire,
          ).valide,
      };
    }
    case TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_INVALIDEE: {
      const etatCourant = { ...etat };
      delete etatCourant['finalisationCreationCompteATransmettre'];
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
    case TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_TRANSMISE: {
      const etatCourant = { ...etat };
      delete etatCourant['finalisationCreationCompteATransmettre'];
      return {
        ...etatCourant,
      };
    }
    case TypeActionFinalisationCreationCompte.CGU_CLIQUEES: {
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
          verifieLesMotsDePasseSaisis(
            etat.nouveauMotDePasse,
            etat.motDePasseConfirme,
            etat.motDePasseTemporaire,
          ).valide,
      };
    }
    case TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_VALIDEE: {
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
        saisieValide: () =>
          etat.cguSignees && verificationMotsDePasseSaisis.valide,
        ...(etat.cguSignees &&
          verificationMotsDePasseSaisis.valide && {
            finalisationCreationCompteATransmettre:
              etat.cguSignees && verificationMotsDePasseSaisis.valide,
          }),
      };
    }
  }
};

export const finalisationCreationCompteValidee =
  (): ActionFinalisationCreationCompte => ({
    type: TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_VALIDEE,
  });

export const cguCliquees = (): ActionFinalisationCreationCompte => ({
  type: TypeActionFinalisationCreationCompte.CGU_CLIQUEES,
});

export const finalisationCreationCompteTransmise =
  (): ActionFinalisationCreationCompte => ({
    type: TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_TRANSMISE,
  });

export const finalisationCreationCompteInvalidee = (
  erreur: Error,
): ActionFinalisationCreationCompte => ({
  erreur,
  type: TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_INVALIDEE,
});

export const nouveauMotDePasseSaisi = (
  nouveauMotDePasse: string,
): ActionFinalisationCreationCompte => ({
  nouveauMotDePasse,
  type: TypeActionFinalisationCreationCompte.NOUVEAU_MOT_DE_PASSE_SAISI,
});

export const nouveauMotDePasseConfirme = (
  motDePasseConfirme: string,
): ActionFinalisationCreationCompte => ({
  motDePasseConfirme,
  type: TypeActionFinalisationCreationCompte.NOUVEAU_MOT_DE_PASSE_CONFIRME,
});

export const motDePasseTemporaireSaisi = (
  motDePasseTemporaire: string,
): ActionFinalisationCreationCompte => ({
  motDePasseTemporaire: motDePasseTemporaire,
  type: TypeActionFinalisationCreationCompte.MOT_DE_PASSE_TEMPORAIRE_SAISI,
});
export const initialiseReducteur = (): EtatFinalisationCreationCompte => ({
  cguSignees: false,
  nouveauMotDePasse: '',
  motDePasseConfirme: '',
  motDePasseTemporaire: '',
  saisieValide: () => false,
  erreur: {},
});
