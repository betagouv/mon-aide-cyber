import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { ReponseHATEOAS } from '../../src/api/hateoas/hateoas';
import { FauxGestionnaireDeJeton } from '../infrastructure/authentification/FauxGestionnaireDeJeton';

import { unUtilisateur } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { liensPublicsAttendus } from './hateoas/liensAttendus';
import { utilitairesCookies } from '../../src/adaptateurs/utilitairesDeCookies';
import { unConstructeurDeJwtPayload } from '../constructeurs/constructeurJwtPayload';

describe('Route contexte', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  it('Retourne les actions publiques si le contexte n’est pas fourni', async () => {
    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      `/api/contexte`
    );

    expect(reponse.statusCode).toBe(200);
    expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
      ...liensPublicsAttendus,
    });
  });

  it('Retourne les actions spécifiques au contexte fourni', async () => {
    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      `/api/contexte?contexte=demande-devenir-aidant:finalise-creation-espace-aidant`
    );

    expect(reponse.statusCode).toBe(200);
    expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
      liens: {
        'finalise-creation-nouvel-espace-aidant': {
          url: '/api/demandes/devenir-aidant/creation-espace-aidant',
          methode: 'POST',
        },
      },
    });
  });

  describe('Dans le cas d’un Aidant avec espace ayant une session', () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { app: Express };

    beforeEach(async () => {
      donneesServeur = testeurMAC.initialise();
    });

    it('Retourne le tableau de bord Aidant si il revient sur la page d’accueil de MAC', async () => {
      const utilisateur = unUtilisateur().construis();
      await testeurMAC.entrepots.utilisateurs().persiste(utilisateur);
      utilitairesCookies.jwtPayload = () =>
        unConstructeurDeJwtPayload()
          .ayantPourAidant(utilisateur.identifiant)
          .construis();
      utilitairesCookies.recuperateurDeCookies = () => 'cookies';

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/contexte`
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
        liens: {
          'afficher-tableau-de-bord': {
            url: '/api/mon-espace/tableau-de-bord',
            methode: 'GET',
          },
        },
      });
    });

    it('Retourne le tableau de bord Aidant si il revient sur la page de statistiques publique de MAC', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/contexte?contexte=afficher-statistiques`
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
        liens: {
          'afficher-tableau-de-bord': {
            url: '/api/mon-espace/tableau-de-bord',
            methode: 'GET',
          },
          'afficher-statistiques': {
            url: '/statistiques',
            methode: 'GET',
          },
        },
      });
    });

    describe('Lorsqu’une erreur est levée', () => {
      beforeEach(() => {
        testeurMAC.gestionnaireDeJeton = new FauxGestionnaireDeJeton(true);
        donneesServeur = testeurMAC.initialise();
      });

      afterEach(() => {
        testeurMAC.arrete();
      });

      it('Retourne les liens publics', async () => {
        utilitairesCookies.recuperateurDeCookies = () => 'cookie';
        utilitairesCookies.jwtPayload = () => {
          throw new Error('Erreur survenue');
        };

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          `/api/contexte`
        );

        expect(reponse.statusCode).toBe(200);
        expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
          ...liensPublicsAttendus,
        });
      });
    });
  });
});
