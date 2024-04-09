import { describe, it } from 'vitest';
import {
  AdaptateursRequeteBrevo,
  APIBrevo,
  CreationContactBrevo,
  EnvoiMailBrevo,
} from '../../src/infrastructure/adaptateurs/adaptateursRequeteBrevo';
import {
  unConstructeurCreationDeContact,
  unConstructeurEnvoiDeMail,
} from '../../src/infrastructure/brevo/ConstructeursBrevo';
import { adaptateurEnvironnement } from '../../src/adaptateurs/adaptateurEnvironnement';

class AdaptateursRequeteBrevoDeTest extends AdaptateursRequeteBrevo {
  requeteAttendue: any;

  protected adaptateur<T, R>(
    url: string,
  ): {
    execute(requete: APIBrevo<T>): Promise<R>;
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
  adaptateurEnvironnement.messagerie = () => {
    return {
      clefAPI: () => 'une clef',
      expediteurMAC: () => 'expéditeur',
      emailMAC: () => 'email',
    };
  };
  describe('Création de contact', () => {
    it('Exécute une création de contact', async () => {
      const adaptateur = new AdaptateursRequeteBrevoDeTest();

      await adaptateur
        .creationContact()
        .execute(
          unConstructeurCreationDeContact()
            .ayantPourEmail('jean.dupont@mail.com')
            .ayantPourAttributs({ donnees: 'donnees' })
            .construis(),
        );

      expect(adaptateur.requeteAttendue).toStrictEqual<
        APIBrevo<CreationContactBrevo> & { url: string }
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
  });

  describe('Envoi de mail', () => {
    it('Exécute un envoi de mail', async () => {
      const adaptateur = new AdaptateursRequeteBrevoDeTest();

      await adaptateur.envoiMail().execute(
        unConstructeurEnvoiDeMail()
          .ayantPourExpediteur('MonAideCyber', 'monaedcyber@mail.com')
          .ayantPourDestinataires([['jean.dupont@email.com', 'Jean Dupont']])
          .ayantPourSujet('Un sujet')
          .ayantPourContenu('Un contenu')
          .construis(),
      );

      expect(adaptateur.requeteAttendue).toStrictEqual<
        APIBrevo<EnvoiMailBrevo> & { url: string }
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
