import { construisErreur, PresentationErreur } from '../composants/erreurs/Erreurs.tsx';

enum TypeActionEnvoieMessage {
  NOM_SAISI = 'NOM_SAISI',
  EMAIL_SAISI = 'EMAIL_SAISI',
  MESSAGE_SAISI = 'MESSAGE_SAISI',
  SAISIE_INVALIDEE = 'SAISIE_INVALIDEE',
  MESSAGE_ENVOYE = 'MESSAGE_ENVOYE',
}

type ErreurEnvoieMessage = {
  nom?: PresentationErreur;
  email?: PresentationErreur;
  message?: PresentationErreur;
};
export type EtatEnvoieMessage = {
  nom: string;
  email: string;
  message: string;
  erreur?: ErreurEnvoieMessage;
  saisieValide: () => boolean;
  messageEnvoye?: boolean;
};
type ActionEnvoieMessage =
  | {
      type: TypeActionEnvoieMessage.MESSAGE_ENVOYE;
    }
  | {
      type: TypeActionEnvoieMessage.SAISIE_INVALIDEE;
    }
  | {
      nom: string;
      type: TypeActionEnvoieMessage.NOM_SAISI;
    }
  | {
      email: string;
      type: TypeActionEnvoieMessage.EMAIL_SAISI;
    }
  | {
      message: string;
      type: TypeActionEnvoieMessage.MESSAGE_SAISI;
    };

const textesExplicatif: Map<'nom' | 'email' | 'message', { texte: string; identifiant: string }> = new Map([
  ['nom', { texte: 'Veuillez saisir votre nom.', identifiant: 'nom' }],
  ['email', { texte: 'Veuillez saisir un email valide.', identifiant: 'email' }],
  ['message', { texte: 'Veuillez saisir un message.', identifiant: 'message' }],
]);
export const reducteurEnvoieMessage = (etat: EtatEnvoieMessage, action: ActionEnvoieMessage): EtatEnvoieMessage => {
  const construisErreurEnvoieMessage = (
    clef: 'nom' | 'email' | 'message',
    estValide: () => boolean,
  ): ErreurEnvoieMessage => {
    const erreur: ErreurEnvoieMessage = { ...etat.erreur };
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
    case TypeActionEnvoieMessage.MESSAGE_ENVOYE: {
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
    case TypeActionEnvoieMessage.SAISIE_INVALIDEE: {
      const nouvelEtat = { ...etat };
      delete nouvelEtat['messageEnvoye'];
      return {
        ...nouvelEtat,
        erreur: {
          ...construisErreurEnvoieMessage('message', () => false),
          ...construisErreurEnvoieMessage('nom', () => false),
          ...construisErreurEnvoieMessage('email', () => false),
        },
      };
    }
    case TypeActionEnvoieMessage.MESSAGE_SAISI: {
      const estValide = action.message.trim().length > 0;
      const erreur = construisErreurEnvoieMessage('message', () => estValide);
      return {
        ...etat,
        erreur,
        message: action.message.trim(),
        saisieValide: () => etat.email.length > 0 && etat.nom.length > 0 && estValide,
      };
    }
    case TypeActionEnvoieMessage.EMAIL_SAISI: {
      const estUnEmail = action.email.trim().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      const estValide = (estUnEmail && estUnEmail?.length > 0) || false;
      const erreur = construisErreurEnvoieMessage('email', () => estValide);
      return {
        ...etat,
        erreur,
        email: action.email.trim(),
        saisieValide: () => etat.message.length > 0 && etat.nom.length > 0 && estValide,
      };
    }
    case TypeActionEnvoieMessage.NOM_SAISI: {
      const estValide = action.nom.trim().length > 0;
      const erreur = construisErreurEnvoieMessage('nom', () => estValide);
      return {
        ...etat,
        erreur,
        nom: action.nom.trim(),
        saisieValide: () => etat.email.length > 0 && etat.message.length > 0 && estValide,
      };
    }
  }
};

export const nomSaisi = (nom: string): ActionEnvoieMessage => {
  return {
    nom,
    type: TypeActionEnvoieMessage.NOM_SAISI,
  };
};
export const emailSaisi = (email: string): ActionEnvoieMessage => {
  return {
    email,
    type: TypeActionEnvoieMessage.EMAIL_SAISI,
  };
};

export const messageSaisi = (message: string): ActionEnvoieMessage => {
  return {
    message,
    type: TypeActionEnvoieMessage.MESSAGE_SAISI,
  };
};

export const saisieInvalidee = (): ActionEnvoieMessage => {
  return {
    type: TypeActionEnvoieMessage.SAISIE_INVALIDEE,
  };
};

export const messageEnvoye = (): ActionEnvoieMessage => {
  return {
    type: TypeActionEnvoieMessage.MESSAGE_ENVOYE,
  };
};
