import { afterEach, beforeEach, describe, expect } from 'vitest';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { Profil } from '../../src/api/representateurs/profil/Profil';

describe('le serveur MAC sur les routes /api/profil', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête GET est reçue sur /', () => {
    it("retourne les informations le l'utilisateur", async () => {
      const aidant = unAidant().construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/profil/`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(200);
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual<Profil>({
        nomPrenom: aidant.nomPrenom,
        dateSignatureCGU: FournisseurHorloge.formateDate(
          aidant.dateSignatureCGU!,
        ).date,
        identifiantConnexion: aidant.identifiantConnexion,
        liens: {
          'lancer-diagnostic': {
            url: '/api/diagnostic',
            methode: 'POST',
          },
        },
      });
    });

    it('ne peut pas accéder au profil si les CGU ne sont pas signés', async () => {
      const aidant = unAidant().sansEspace().construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/profil/`,
        donneesServeur.portEcoute,
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true,
      );
    });

    it("ne peut pas accéder au profil si l'aidant n'existe pas", async () => {
      testeurMAC.adaptateurDeVerificationDeSession.reinitialise();

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/profil/`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual({
        message: "Le aidant demandé n'existe pas.",
      });
    });
  });
});
