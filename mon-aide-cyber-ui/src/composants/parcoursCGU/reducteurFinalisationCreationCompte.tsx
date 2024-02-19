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
  motDePasseConfirme?: string;
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

  switch (action.type) {
    case TypeActionFinalisationCreationCompte.NOUVEAU_MOT_DE_PASSE_SAISI: {
      return {
        ...etat,
        nouveauMotDePasse: action.nouveauMotDePasse,
        saisieValide: () =>
          action.nouveauMotDePasse === etat.motDePasseConfirme &&
          etat.cguSignees,
      };
    }
    case TypeActionFinalisationCreationCompte.NOUVEAU_MOT_DE_PASSE_CONFIRME: {
      const motsDePasseEgaux =
        action.motDePasseConfirme === etat.nouveauMotDePasse;
      const erreur = { ...etat.erreur };
      delete erreur['motDePasse'];
      return {
        ...etat,
        erreur: { ...erreur },
        motDePasseConfirme: action.motDePasseConfirme,
        saisieValide: () => motsDePasseEgaux && etat.cguSignees,
      };
    }
    case TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_INVALIDEE: {
      const etatCourant = { ...etat };
      delete etatCourant['finalisationCreationCompteATransmettre'];
      return {
        ...etatCourant,
        cguSignees: false,
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
        saisieValide: () => cguSignees,
      };
    }
    case TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_VALIDEE: {
      const erreurCGUSignees = !etat.cguSignees && {
        ...construisErreurCGU(),
      };
      const motsDePasseIdentiques =
        etat.motDePasseConfirme === etat.nouveauMotDePasse;
      const erreurMotDePasse = !motsDePasseIdentiques && {
        ...construisErreur('motDePasse', {
          texte:
            'La confirmation de votre mot de passe ne correspond pas au mot de passe saisi.',
          identifiantTexteExplicatif: 'motDePasseConfirme',
        }),
      };

      return {
        ...etat,
        erreur: { ...erreurCGUSignees, ...erreurMotDePasse },
        saisieValide: () => etat.cguSignees && motsDePasseIdentiques,
        ...(etat.cguSignees &&
          motsDePasseIdentiques && {
            finalisationCreationCompteATransmettre:
              etat.cguSignees && motsDePasseIdentiques,
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
