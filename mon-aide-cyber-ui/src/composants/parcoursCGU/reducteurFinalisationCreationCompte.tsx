import {
  ChampsErreur,
  construisErreur,
  PresentationErreur,
} from '../erreurs/Erreurs.tsx';
import { ReactElement } from 'react';

type ErreurFinalisationCompte = {
  cguSignees?: PresentationErreur;
  charteSignee?: PresentationErreur;
};

export type EtatFinalisationCreationCompte = {
  cguSignees: boolean;
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
    case TypeActionFinalisationCreationCompte.FINALISATION_CREATION_COMPTE_INVALIDEE: {
      const etatCourant = { ...etat };
      delete etatCourant['finalisationCreationCompteATransmettre'];
      return {
        ...etatCourant,
        cguSignees: false,
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
      return {
        ...etat,
        erreur: { ...erreurCGUSignees },
        saisieValide: () => etat.cguSignees,
        ...(etat.cguSignees && {
          finalisationCreationCompteATransmettre: etat.cguSignees,
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
