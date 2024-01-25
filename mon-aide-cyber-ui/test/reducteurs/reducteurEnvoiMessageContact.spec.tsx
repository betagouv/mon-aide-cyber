import { describe, expect, it } from 'vitest';
import {
  emailSaisi,
  envoiMessageInvalide,
  EtatEnvoiMessageContact,
  messageComplete,
  messageEnvoye,
  messageSaisi,
  nomSaisi,
  reducteurEnvoiMessageContact,
} from '../../src/reducteurs/reducteurEnvoiMessageContact.tsx';
import {
  ChampsErreur,
  TexteExplicatif,
} from '../../src/composants/erreurs/Erreurs.tsx';

describe("Réducteur d'envoie de message de contact", () => {
  const etatInitial: EtatEnvoiMessageContact = {
    nom: '',
    email: '',
    message: '',
    saisieValide: () => false,
  };

  describe('Sur la saisie du nom', () => {
    it('contient le nom', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        etatInitial,
        nomSaisi('Jean Dupont'),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: 'Jean Dupont',
        email: '',
        message: '',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it("la saisie est toujours erronée si elle n'est pas correcte", () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          erreur: {
            nom: { className: 'fr-input-group--error', texteExplicatif: <></> },
          },
        },
        nomSaisi('   '),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: '   ',
        email: '',
        message: '',
        erreur: {
          nom: { className: 'fr-input-group--error', texteExplicatif: <></> },
        },
        saisieValide: expect.any(Function),
      });
    });

    it('valide la saisie après une saisie erronée', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          erreur: {
            nom: { className: 'fr-input-group--error', texteExplicatif: <></> },
          },
        },
        nomSaisi('Jean Dupont'),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: 'Jean Dupont',
        email: '',
        message: '',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it('ne valide pas la saisie du formulaire', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          message: 'Un message',
          email: 'jean-dupont@email.com',
          nom: '',
          saisieValide: () => false,
        },
        nomSaisi('Jean Dupont'),
      );

      expect(etatEnvoieMessage.saisieValide()).toBe(false);
    });
  });

  describe("Sur la saisie de l'adresse email", () => {
    it("contient l'email", () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        etatInitial,
        emailSaisi('jean-dupont@email.com'),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: '',
        email: 'jean-dupont@email.com',
        message: '',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it("la saisie est toujours erronée si elle n'est pas correcte", () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          erreur: {
            email: {
              className: 'fr-input-group--error',
              texteExplicatif: <></>,
            },
          },
        },
        emailSaisi('   '),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: '',
        email: '   ',
        message: '',
        erreur: {
          email: { className: 'fr-input-group--error', texteExplicatif: <></> },
        },
        saisieValide: expect.any(Function),
      });
    });

    it('valide la saisie après une saisie erronée', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          erreur: {
            email: {
              className: 'fr-input-group--error',
              texteExplicatif: <></>,
            },
          },
        },
        emailSaisi('jean-dupont@mail.com'),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: '',
        email: 'jean-dupont@mail.com',
        message: '',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it('ne valide pas la saisie du formulaire', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          message: 'Un message',
          email: '',
          nom: 'Jean Dupont',
          saisieValide: () => false,
        },
        emailSaisi('jean-dupont@email.com'),
      );

      expect(etatEnvoieMessage.saisieValide()).toBe(false);
    });
  });

  describe('Sur la saisie du message', () => {
    it('contient le message', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        etatInitial,
        messageSaisi(
          'Bonjour,\n' +
            "J'aimerai avoir des renseignements.\n" +
            '\n' +
            'Cordialement.\n' +
            '\n' +
            'Jean Dupont\n',
        ),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: '',
        email: '',
        message:
          'Bonjour,\n' +
          "J'aimerai avoir des renseignements.\n" +
          '\n' +
          'Cordialement.\n' +
          '\n' +
          'Jean Dupont\n',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it("la saisie est toujours erronée si elle n'est pas correcte", () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          erreur: {
            message: {
              className: 'fr-input-group--error',
              texteExplicatif: <></>,
            },
          },
        },
        messageSaisi('   '),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: '',
        email: '',
        message: '   ',
        erreur: {
          message: {
            className: 'fr-input-group--error',
            texteExplicatif: <></>,
          },
        },
        saisieValide: expect.any(Function),
      });
    });

    it('valide la saisie après une saisie erronée', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          erreur: {
            message: {
              className: 'fr-input-group--error',
              texteExplicatif: <></>,
            },
          },
        },
        messageSaisi('Bonjour le monde!'),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: '',
        email: '',
        message: 'Bonjour le monde!',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it('ne valide pas la saisie du formulaire', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          message: '',
          email: 'jean-dupont@gmail.com',
          nom: 'Jean Dupont',
          saisieValide: () => false,
        },
        messageSaisi('Un message'),
      );

      expect(etatEnvoieMessage.saisieValide()).toBe(false);
    });
  });

  it('Le message a été envoyé', () => {
    const etatEnvoieMessage = reducteurEnvoiMessageContact(
      {
        message: 'Bonjour le monde!',
        email: 'jean-dupont@mail.com',
        nom: 'Jean Dupont',
        saisieValide: () => true,
      },
      messageEnvoye(),
    );

    expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
      nom: '',
      email: '',
      message: '',
      messageEnvoye: true,
      erreur: {},
      saisieValide: expect.any(Function),
    });
  });

  it('Le message a été envoyé mais une erreur nous est retournée par MAC', () => {
    const etatEnvoieMessage = reducteurEnvoiMessageContact(
      {
        message: 'Bonjour le monde!',
        email: 'jean-dupont@mail.com',
        nom: 'Jean Dupont',
        saisieValide: () => true,
      },
      envoiMessageInvalide(new Error('Une erreur est survenue')),
    );

    expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
      champsErreur: (
        <ChampsErreur erreur={new Error('Une erreur est survenue')} />
      ),
      nom: 'Jean Dupont',
      email: 'jean-dupont@mail.com',
      message: 'Bonjour le monde!',
      messageEnvoye: false,
      erreur: {},
      saisieValide: expect.any(Function),
    });
  });

  describe('Sur le message complété', () => {
    it('valide toute la saisie', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          nom: 'Jean Dupont',
          email: 'jean-dupont@email.com',
          message: 'Bonjour, le monde!',
        },
        messageComplete(),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: 'Jean Dupont',
        email: 'jean-dupont@email.com',
        message: 'Bonjour, le monde!',
        erreur: {},
        saisieValide: expect.any(Function),
        messageEnvoye: false,
      });
      expect(etatEnvoieMessage.saisieValide()).toBe(true);
    });

    it('réinitialise sur une nouvelle saisie', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          nom: 'Jean Dupont',
          email: 'jean-dupont@email.com',
          message: 'Bonjour, le monde!',
          messageEnvoye: true,
        },
        messageComplete(),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: 'Jean Dupont',
        email: 'jean-dupont@email.com',
        message: 'Bonjour, le monde!',
        erreur: {},
        saisieValide: expect.any(Function),
        messageEnvoye: false,
      });
      expect(etatEnvoieMessage.saisieValide()).toBe(true);
    });

    it('invalide la saisie du nom', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          nom: '   ',
          email: 'jean-dupont@email.com',
          message: 'Bonjour, le monde!',
        },
        messageComplete(),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: '',
        email: 'jean-dupont@email.com',
        message: 'Bonjour, le monde!',
        erreur: {
          nom: {
            className: 'fr-input-group--error',
            texteExplicatif: (
              <TexteExplicatif id="nom" texte="Veuillez saisir votre nom." />
            ),
          },
        },
        saisieValide: expect.any(Function),
        messageEnvoye: false,
      });
      expect(etatEnvoieMessage.saisieValide()).toBe(false);
    });

    it("invalide la saisie de l'email", () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          nom: 'Jean Dupont',
          email: 'email-non-valide.com',
          message: 'Bonjour, le monde!',
        },
        messageComplete(),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: 'Jean Dupont',
        email: 'email-non-valide.com',
        message: 'Bonjour, le monde!',
        erreur: {
          email: {
            className: 'fr-input-group--error',
            texteExplicatif: (
              <TexteExplicatif
                id="email"
                texte="Veuillez saisir un email valide."
              />
            ),
          },
        },
        saisieValide: expect.any(Function),
        messageEnvoye: false,
      });
      expect(etatEnvoieMessage.saisieValide()).toBe(false);
    });

    it('invalide la saisie du message', () => {
      const etatEnvoieMessage = reducteurEnvoiMessageContact(
        {
          ...etatInitial,
          nom: 'Jean Dupont',
          email: 'jean-dupont@email.com',
          message: '   ',
        },
        messageComplete(),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoiMessageContact>({
        nom: 'Jean Dupont',
        email: 'jean-dupont@email.com',
        message: '',
        erreur: {
          message: {
            className: 'fr-input-group--error',
            texteExplicatif: (
              <TexteExplicatif
                id="message"
                texte="Veuillez saisir un message."
              />
            ),
          },
        },
        saisieValide: expect.any(Function),
        messageEnvoye: false,
      });
      expect(etatEnvoieMessage.saisieValide()).toBe(false);
    });
  });
});
