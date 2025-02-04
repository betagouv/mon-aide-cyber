import { describe, expect, it } from 'vitest';
import { MoteurDeLiens } from '../../src/domaine/MoteurDeLiens.ts';
import { Action, Lien } from '../../src/domaine/Lien.ts';

describe('Le moteur de liens', () => {
  describe('trouve un lien', () => {
    it('parmi une liste de liens', () => {
      let lienAttendu = {};
      new MoteurDeLiens({
        'mon-lien': { url: '/une/url', methode: 'GET' },
        'un-autre-lien': { url: '/une/autre/url', methode: 'POST' },
      }).trouve('mon-lien' as Action, (lien: Lien) => (lienAttendu = lien));
      expect(lienAttendu).toStrictEqual<Lien>({
        url: '/une/url',
        methode: 'GET',
      });
    });

    it('Exécute la fonction ’En erreur’ lorsque le lien n’est pas trouvé', () => {
      let enErreurAppele = false;
      let enSuccesRecu: Lien | undefined = undefined;
      const enErreur = () => (enErreurAppele = true);
      const enSucces = (lien: Lien) => (enSuccesRecu = lien);
      new MoteurDeLiens({
        'mon-lien': { url: '/une/url', methode: 'GET' },
        'un-autre-lien': { url: '/une/autre/url', methode: 'POST' },
      }).trouve('lien-introuvable' as Action, enSucces, enErreur);

      expect(enSuccesRecu).toBeUndefined();
      expect(enErreurAppele).toBeTruthy();
    });
  });
});
