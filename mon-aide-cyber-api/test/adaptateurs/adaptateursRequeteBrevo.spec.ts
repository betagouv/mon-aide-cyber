import { describe, expect, it } from 'vitest';
import {
  AdaptateursRequeteBrevo,
  CreationContactBrevo,
  EnvoiMailBrevo,
  RechercheContactBrevo,
  RequeteBrevo,
} from '../../src/infrastructure/adaptateurs/adaptateursRequeteBrevo';
import {
  unConstructeurCreationDeContact,
  unConstructeurEnvoiDeMail,
  unConstructeurRechercheDeContact,
} from '../../src/infrastructure/brevo/ConstructeursBrevo';
import { adaptateurEnvironnement } from '../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateursEnvironnementDeTest } from './adaptateursEnvironnementDeTest';

class AdaptateursRequeteBrevoDeTest extends AdaptateursRequeteBrevo {
  requeteAttendue: any;

  protected adaptateur<T, R>(
    url: string
  ): {
    execute(requete: RequeteBrevo<T>): Promise<R>;
  } {
    return {
      execute: (requete) => {
        this.requeteAttendue = { url, ...requete };
        return Promise.resolve() as unknown as Promise<R>;
      },
    };
  }
}

describe('Adaptateurs requete Brevo', () => {
  adaptateurEnvironnement.messagerie = () =>
    adaptateursEnvironnementDeTest.messagerie(
      'email',
      'expéditeur',
      'une clef'
    );

  describe('Création de contact', () => {
    it('Exécute une création de contact', async () => {
      const adaptateur = new AdaptateursRequeteBrevoDeTest();

      await adaptateur
        .creationContact()
        .execute(
          unConstructeurCreationDeContact()
            .ayantPourEmail('jean.dupont@mail.com')
            .ayantPourAttributs({ donnees: 'donnees' })
            .construis()
        );

      expect(adaptateur.requeteAttendue).toStrictEqual<
        RequeteBrevo<CreationContactBrevo> & { url: string }
      >({
        methode: 'POST',
        corps: {
          attributes: {
            donnees: 'donnees',
          },
          email: 'jean.dupont@mail.com',
        },
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'api-key': 'une clef',
        },
        url: 'https://api.brevo.com/v3/contacts',
      });
    });

    it('Exécute une recherche par email', async () => {
      const adaptateur = new AdaptateursRequeteBrevoDeTest();

      await adaptateur
        .rechercheContact('jean.dupont@mail.com')
        .execute(unConstructeurRechercheDeContact().construis());

      expect(adaptateur.requeteAttendue).toStrictEqual<
        RequeteBrevo<RechercheContactBrevo> & { url: string }
      >({
        methode: 'GET',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'api-key': 'une clef',
        },
        url: 'https://api.brevo.com/v3/contacts/jean.dupont@mail.com',
      });
    });
  });

  describe('API de mail', () => {
    it('Exécute un envoi de mail', async () => {
      const adaptateur = new AdaptateursRequeteBrevoDeTest();

      await adaptateur.envoiMail().execute(
        unConstructeurEnvoiDeMail()
          .ayantPourExpediteur('MonAideCyber', 'monaedcyber@mail.com')
          .ayantPourDestinataires([['jean.dupont@email.com', 'Jean Dupont']])
          .ayantPourSujet('Un sujet')
          .ayantPourContenu('Un contenu')
          .construis()
      );

      expect(adaptateur.requeteAttendue).toStrictEqual<
        RequeteBrevo<EnvoiMailBrevo> & { url: string }
      >({
        methode: 'POST',
        corps: {
          sender: {
            email: 'monaedcyber@mail.com',
            name: 'MonAideCyber',
          },
          subject: 'Un sujet',
          textContent: 'Un contenu',
          to: [
            {
              email: 'jean.dupont@email.com',
              name: 'Jean Dupont',
            },
          ],
        },
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'api-key': 'une clef',
        },
        url: 'https://api.brevo.com/v3/smtp/email',
      });
    });
  });
});
