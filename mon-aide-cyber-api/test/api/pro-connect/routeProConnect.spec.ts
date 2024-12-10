import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';

const enObjet = <T extends { [clef: string]: string }>(cookie: string): T =>
  cookie.split('; ').reduce((acc: T, v: string) => {
    const [cle, valeur] = v.split('=');
    return { ...acc, [cle]: valeur };
  }, {} as T);

describe('Le serveur MAC, sur les routes de connexion ProConnect', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    testeurMAC.adaptateurProConnect.genereDemandeAutorisation = () =>
      Promise.resolve({
        nonce: 'coucou',
        url: new URL('http://mom-domaine'),
        state: 'etat',
      });
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('Lorsqu’une requête GET est reçue sur /pro-connect/connexion', () => {
    beforeEach(() => {
      donneesServeur = testeurMAC.initialise();
    });

    it('L’utilisateur est redirigé', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/pro-connect/connexion',
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toStrictEqual(302);
      const objet = enObjet<{ ProConnectInfo: string; [clef: string]: string }>(
        reponse.headers['set-cookie'] as string
      );
      expect(objet.ProConnectInfo).toStrictEqual(
        'j%3A%7B%22state%22%3A%22etat%22%2C%22nonce%22%3A%22coucou%22%7D'
      );
    });
  });
});
