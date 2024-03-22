import {
  ChampsErreur,
  construisErreur,
  PresentationErreur,
} from '../composants/alertes/Erreurs.tsx';
import { ReactElement } from 'react';

enum TypeActionEnvoiMessageContact {
  NOM_SAISI = 'NOM_SAISI',
  EMAIL_SAISI = 'EMAIL_SAISI',
  MESSAGE_SAISI = 'MESSAGE_SAISI',
  MESSAGE_ENVOYE = 'MESSAGE_ENVOYE',
  ENVOI_MESSAGE_INVALIDE = 'ENVOI_MESSAGE_INVALIDE',
  MESSAGE_COMPLETE = 'MESSAGE_COMPLETE',
}

type ErreurEnvoiMessageContact = {
  nom?: PresentationErreur;
  email?: PresentationErreur;
  message?: PresentationErreur;
};
export type EtatEnvoiMessageContact = {
  champsErreur?: ReactElement;
  nom: string;
  email: string;
  message: string;
  erreur?: ErreurEnvoiMessageContact;
  saisieValide: () => boolean;
  messageEnvoye?: boolean;
};
type ActionEnvoiMessageContact =
  | {
      type: TypeActionEnvoiMessageContact.MESSAGE_COMPLETE;
    }
  | {
      erreur: Error;
      type: TypeActionEnvoiMessageContact.ENVOI_MESSAGE_INVALIDE;
    }
  | {
      type: TypeActionEnvoiMessageContact.MESSAGE_ENVOYE;
    }
  | {
      nom: string;
      type: TypeActionEnvoiMessageContact.NOM_SAISI;
    }
  | {
      email: string;
      type: TypeActionEnvoiMessageContact.EMAIL_SAISI;
    }
  | {
      message: string;
      type: TypeActionEnvoiMessageContact.MESSAGE_SAISI;
    };

const textesExplicatif: Map<
  'nom' | 'email' | 'message',
  { texte: string; identifiant: string }
> = new Map([
  ['nom', { texte: 'Veuillez saisir votre nom.', identifiant: 'nom' }],
  [
    'email',
    { texte: 'Veuillez saisir un email valide.', identifiant: 'email' },
  ],
  ['message', { texte: 'Veuillez saisir un message.', identifiant: 'message' }],
]);
export const reducteurEnvoiMessageContact = (
  etat: EtatEnvoiMessageContact,
  action: ActionEnvoiMessageContact,
): EtatEnvoiMessageContact => {
  const construisErreurEnvoieMessage = (
    clef: 'nom' | 'email' | 'message',
    estValide: () => boolean,
  ): ErreurEnvoiMessageContact => {
    const erreur: ErreurEnvoiMessageContact = { ...etat.erreur };
    delete erreur[clef];
    const texteExplicatif = textesExplicatif.get(clef)!;
    return {
      ...erreur,
      ...(!estValide() &&
        construisErreur(clef, {
          texte: texteExplicatif.texte,
          identifiantTexteExplicatif: texteExplicatif.identifiant,
        })),
    };
  };

  switch (action.type) {
    case TypeActionEnvoiMessageContact.MESSAGE_COMPLETE: {
      const nomEstValide = etat.nom.trim().length > 0;
      const erreurNom = construisErreurEnvoieMessage('nom', () => nomEstValide);
      const estUnEmail = etat.email
        .trim()
        .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      const emailEstValide = (estUnEmail && estUnEmail?.length > 0) || false;
      const erreurEmail = construisErreurEnvoieMessage(
        'email',
        () => emailEstValide,
      );
      const messageEstValide = etat.message.trim().length > 0;
      const erreurMessage = construisErreurEnvoieMessage(
        'message',
        () => messageEstValide,
      );
      return {
        ...etat,
        erreur: { ...erreurNom, ...erreurEmail, ...erreurMessage },
        nom: etat.nom.trim(),
        email: etat.email.trim(),
        message: etat.message.trim(),
        saisieValide: () => nomEstValide && emailEstValide && messageEstValide,
        messageEnvoye: false,
      };
    }
    case TypeActionEnvoiMessageContact.ENVOI_MESSAGE_INVALIDE: {
      return {
        ...etat,
        champsErreur: <ChampsErreur erreur={action.erreur} />,
        messageEnvoye: true,
        erreur: {},
      };
    }
    case TypeActionEnvoiMessageContact.MESSAGE_ENVOYE: {
      return {
        ...etat,
        email: '',
        message: '',
        nom: '',
        erreur: {},
        saisieValide: () => false,
        messageEnvoye: true,
      };
    }
    case TypeActionEnvoiMessageContact.MESSAGE_SAISI: {
      const estValide = action.message.trim().length > 0;
      const erreur = { ...etat.erreur };
      estValide && delete erreur['message'];
      return {
        ...etat,
        erreur,
        message: action.message,
      };
    }
    case TypeActionEnvoiMessageContact.EMAIL_SAISI: {
      const estUnEmail = action.email
        .trim()
        .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      const estValide = (estUnEmail && estUnEmail?.length > 0) || false;
      const erreur = { ...etat.erreur };
      estValide && delete erreur['email'];
      return {
        ...etat,
        erreur,
        email: action.email,
      };
    }
    case TypeActionEnvoiMessageContact.NOM_SAISI: {
      const estValide = action.nom.trim().length > 0;
      const erreur = { ...etat.erreur };
      estValide && delete erreur['nom'];
      return {
        ...etat,
        erreur,
        nom: action.nom,
      };
    }
  }
};

export const nomSaisi = (nom: string): ActionEnvoiMessageContact => {
  return {
    nom,
    type: TypeActionEnvoiMessageContact.NOM_SAISI,
  };
};
export const emailSaisi = (email: string): ActionEnvoiMessageContact => {
  return {
    email,
    type: TypeActionEnvoiMessageContact.EMAIL_SAISI,
  };
};

export const messageSaisi = (message: string): ActionEnvoiMessageContact => {
  return {
    message,
    type: TypeActionEnvoiMessageContact.MESSAGE_SAISI,
  };
};

export const messageEnvoye = (): ActionEnvoiMessageContact => {
  return {
    type: TypeActionEnvoiMessageContact.MESSAGE_ENVOYE,
  };
};

export const envoiMessageInvalide = (
  erreur: Error,
): ActionEnvoiMessageContact => {
  return {
    erreur,
    type: TypeActionEnvoiMessageContact.ENVOI_MESSAGE_INVALIDE,
  };
};

export const messageComplete = (): ActionEnvoiMessageContact => {
  return {
    type: TypeActionEnvoiMessageContact.MESSAGE_COMPLETE,
  };
};
