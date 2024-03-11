import { describe, expect, it } from 'vitest';
import {
  emailSaisi,
  EtatEnvoieMessage,
  messageEnvoye,
  messageSaisi,
  nomSaisi,
  reducteurEnvoieMessage,
  saisieInvalidee,
} from '../../src/reducteurs/reducteurEnvoieMessage.ts';
import { TexteExplicatif } from '../../src/composants/alertes/Erreurs.tsx';

describe("Réducteur d'envoie de messages", () => {
  const etatInitial: EtatEnvoieMessage = {
    nom: '',
    email: '',
    message: '',
    saisieValide: () => false,
  };

  describe('Sur la saisie du nom', () => {
    it('valide la saisie', () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
        etatInitial,
        nomSaisi('Jean Dupont'),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
        nom: 'Jean Dupont',
        email: '',
        message: '',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it('invalide la saisie', () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
        etatInitial,
        nomSaisi('   '),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
        nom: '',
        email: '',
        message: '',
        erreur: {
          nom: {
            className: 'fr-input-group--error',
            texteExplicatif: (
              <TexteExplicatif id="nom" texte="Veuillez saisir votre nom." />
            ),
          },
        },
        saisieValide: expect.any(Function),
      });
    });

    it('valide la saisie après une saisie erronée', () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
        {
          ...etatInitial,
          erreur: {
            nom: { className: 'fr-input-group--error', texteExplicatif: <></> },
          },
        },
        nomSaisi('Jean Dupont'),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
        nom: 'Jean Dupont',
        email: '',
        message: '',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it("La saisie n'est valide que lorsque tous les champs sont remplis", () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
        {
          message: 'Un message',
          email: 'jean-dupont@email.com',
          nom: '',
          saisieValide: () => false,
        },
        nomSaisi('Jean Dupont'),
      );

      expect(etatEnvoieMessage.saisieValide()).toBe(true);
    });
  });

  describe("Sur la saisie de l'adresse email", () => {
    it('valide la saisie', () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
        etatInitial,
        emailSaisi('jean-dupont@email.com'),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
        nom: '',
        email: 'jean-dupont@email.com',
        message: '',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it('invalide la saisie', () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
        etatInitial,
        emailSaisi('mauvais-email-at-mail.com'),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
        nom: '',
        email: 'mauvais-email-at-mail.com',
        message: '',
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
      });
    });

    it('valide la saisie après une saisie erronée', () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
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

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
        nom: '',
        email: 'jean-dupont@mail.com',
        message: '',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it("La saisie n'est valide que lorsque tous les champs sont remplis", () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
        {
          message: 'Un message',
          email: '',
          nom: 'Jean Dupont',
          saisieValide: () => false,
        },
        emailSaisi('jean-dupont@email.com'),
      );

      expect(etatEnvoieMessage.saisieValide()).toBe(true);
    });
  });

  describe('Sur la saisie du message', () => {
    it('valide la saisie', () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
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

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
        nom: '',
        email: '',
        message:
          'Bonjour,\n' +
          "J'aimerai avoir des renseignements.\n" +
          '\n' +
          'Cordialement.\n' +
          '\n' +
          'Jean Dupont',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it('invalide la saisie', () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
        etatInitial,
        messageSaisi('   '),
      );

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
        nom: '',
        email: '',
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
      });
    });

    it('valide la saisie après une saisie erronée', () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
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

      expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
        nom: '',
        email: '',
        message: 'Bonjour le monde!',
        erreur: {},
        saisieValide: expect.any(Function),
      });
    });

    it("La saisie n'est valide que lorsque tous les champs sont remplis", () => {
      const etatEnvoieMessage = reducteurEnvoieMessage(
        {
          message: '',
          email: 'jean-dupont@gmail.com',
          nom: 'Jean Dupont',
          saisieValide: () => false,
        },
        messageSaisi('Un message'),
      );

      expect(etatEnvoieMessage.saisieValide()).toBe(true);
    });
  });

  it('La saisie est invalidée', () => {
    const etatEnvoieMessage = reducteurEnvoieMessage(
      {
        message: '',
        email: '',
        nom: '',
        saisieValide: () => false,
      },
      saisieInvalidee(),
    );

    expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
      nom: '',
      email: '',
      message: '',
      erreur: {
        nom: {
          className: 'fr-input-group--error',
          texteExplicatif: (
            <TexteExplicatif id="nom" texte="Veuillez saisir votre nom." />
          ),
        },
        email: {
          className: 'fr-input-group--error',
          texteExplicatif: (
            <TexteExplicatif
              id="email"
              texte="Veuillez saisir un email valide."
            />
          ),
        },
        message: {
          className: 'fr-input-group--error',
          texteExplicatif: (
            <TexteExplicatif id="message" texte="Veuillez saisir un message." />
          ),
        },
      },
      saisieValide: expect.any(Function),
    });
  });

  it('Le message a été envoyé', () => {
    const etatEnvoieMessage = reducteurEnvoieMessage(
      {
        message: 'Bonjour le monde!',
        email: 'jean-dupont@mail.com',
        nom: 'Jean Dupont',
        saisieValide: () => true,
      },
      messageEnvoye(),
    );

    expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
      nom: '',
      email: '',
      message: '',
      messageEnvoye: true,
      erreur: {},
      saisieValide: expect.any(Function),
    });
  });

  it('Une fois le message envoyé si on clique sur le bouton Envoyer le mail, alors les erreurs sont affichées', () => {
    const etatEnvoieMessage = reducteurEnvoieMessage(
      {
        message: '',
        email: '',
        nom: '',
        messageEnvoye: true,
        saisieValide: () => false,
      },
      saisieInvalidee(),
    );

    expect(etatEnvoieMessage).toStrictEqual<EtatEnvoieMessage>({
      nom: '',
      email: '',
      message: '',
      erreur: {
        nom: {
          className: 'fr-input-group--error',
          texteExplicatif: (
            <TexteExplicatif id="nom" texte="Veuillez saisir votre nom." />
          ),
        },
        email: {
          className: 'fr-input-group--error',
          texteExplicatif: (
            <TexteExplicatif
              id="email"
              texte="Veuillez saisir un email valide."
            />
          ),
        },
        message: {
          className: 'fr-input-group--error',
          texteExplicatif: (
            <TexteExplicatif id="message" texte="Veuillez saisir un message." />
          ),
        },
      },
      saisieValide: expect.any(Function),
    });
  });
});
