import { describe, expect } from 'vitest';
import { MoteurDeLiens } from '../../src/domaine/MoteurDeLiens.ts';
import { Action, Lien, Liens } from '../../src/domaine/Lien.ts';

describe('Le moteur de liens', () => {
  describe.each([
    {
      lien: {
        'afficher-profil': { url: '/une/url', methode: 'GET' },
      },
      attendu: '/profil',
    },
    {
      lien: {
        'afficher-diagnostic-6c6ae6e2-96e1-4e6c-87a3-8817bd505bc2': {
          url: '/une/1/url',
          methode: 'GET',
        },
      },
      attendu: '/diagnostic/6c6ae6e2-96e1-4e6c-87a3-8817bd505bc2/restitution',
    },
    {
      lien: {
        'afficher-diagnostic-c4b21920-cb04-488b-abfa-7514d1c698b9': {
          url: '/une/2/url',
          methode: 'GET',
        },
      },
      attendu: '/diagnostic/c4b21920-cb04-488b-abfa-7514d1c698b9/restitution',
    },
    {
      lien: {
        'afficher-tableau-de-bord': { url: '/une/url', methode: 'GET' },
      },
      attendu: '/tableau-de-bord',
    },
    {
      lien: { 'creer-espace-aidant': { url: '/une/url', methode: 'GET' } },
      attendu: '/finalise-creation-espace-aidant',
    },
    {
      lien: { 'lancer-diagnostic': { url: '/une/url', methode: 'GET' } },
      attendu: '/tableau-de-bord',
    },
    {
      lien: {
        'modifier-diagnostic': { url: '/une/url/dynamique', methode: 'GET' },
      },
      attendu: '/diagnostic/dynamique',
    },
  ])('détermine la route des actions fournies', (liens) => {
    it(`lorsque l'on recherche le lien correspondant à ${Object.keys(
      liens.lien
    )} et donne comme route ${liens.attendu}`, () => {
      let routeAttendue = '';
      new MoteurDeLiens(liens.lien as unknown as Liens).trouve(
        Object.keys(liens.lien)[0] as Action,
        (lien: Lien) => {
          routeAttendue = lien.route!;
        }
      );
      expect(routeAttendue).toStrictEqual(liens.attendu);
    });

    it(`lorsque l'on extrait les liens correspondants à ${Object.keys(
      liens.lien
    )} et donne comme route ${liens.attendu}`, () => {
      const lien = new MoteurDeLiens(liens.lien as unknown as Liens).extrais();

      expect(lien[Object.keys(liens.lien)[0]].route).toStrictEqual(
        liens.attendu
      );
    });
  });

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

  describe('extrais les liens', () => {
    it('en filtrant la suite', () => {
      const liens = new MoteurDeLiens({
        'mon-lien': { url: '/une/url', methode: 'GET' },
        'un-autre-lien': { url: '/une/autre/url', methode: 'POST' },
      }).extrais();

      expect(liens).toStrictEqual<Liens>({
        'mon-lien': { url: '/une/url', methode: 'GET' },
        'un-autre-lien': { url: '/une/autre/url', methode: 'POST' },
      });
    });

    it('en excluant ceux mentionnés', () => {
      const liens = new MoteurDeLiens({
        'mon-lien': { url: '/une/url', methode: 'GET' },
        'un-autre-lien': { url: '/une/autre/url', methode: 'POST' },
        'un-troisieme-lien': { url: '/une/troisieme/url', methode: 'POST' },
      }).extrais(['mon-lien', 'un-troisieme-lien']);

      expect(liens).toStrictEqual<Liens>({
        'un-autre-lien': { url: '/une/autre/url', methode: 'POST' },
      });
    });
  });
});
