import { describe } from 'vitest';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { unConstructeurEnvoiDeMail } from '../../../src/infrastructure/brevo/ConstructeursBrevo';

describe('Constructeurs Brevo', () => {
  describe('Constructeur d’envoi de mail', () => {
    it('Retourne un envoi de mail Brevo', () => {
      adaptateurEnvironnement.messagerie = () => ({
        clefAPI: () => 'une clef',
        emailMAC: () => 'email',
        expediteurMAC: () => 'expéditeur',
      });
      const resultat = unConstructeurEnvoiDeMail()
        .ayantPourExpediteur('MonAideCyber', 'monaidecyber@mail.com')
        .ayantPourDestinataires([
          ['jean.dupont@email.com', 'Jean Dupont'],
          ['jean.dujardin@email.com', 'Jean Dujardin'],
        ])
        .ayantPourSujet('Un sujet')
        .ayantPourContenu('Bonjour, le monde!')
        .construis();

      expect(resultat).toStrictEqual({
        methode: 'POST',
        corps: {
          sender: {
            name: 'MonAideCyber',
            email: 'monaidecyber@mail.com',
          },
          subject: 'Un sujet',
          to: [
            { email: 'jean.dupont@email.com', name: 'Jean Dupont' },
            { email: 'jean.dujardin@email.com', name: 'Jean Dujardin' },
          ],
          textContent: 'Bonjour, le monde!',
        },
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'api-key': 'une clef',
        },
      });
    });
  });
});
