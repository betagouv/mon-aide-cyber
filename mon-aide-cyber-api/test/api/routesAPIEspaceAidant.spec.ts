import { afterEach, beforeEach, describe, expect } from 'vitest';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { ReponseHATEOAS } from '../../src/api/hateoas/hateoas';

describe('le serveur MAC sur les routes /api/espace-aidant', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête POST est reçue sur /cree', () => {
    it('marque les CGU à signées', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-02-04T13:04:25+01:00')),
      );
      const aidantCreantSonEspace = unAidant().sansEspace().construis();
      await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        aidantCreantSonEspace,
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/espace-aidant/cree`,
        donneesServeur.portEcoute,
        {
          cguSignees: true,
          motDePasse: 'EgLw5R0ItVRxkl%#>cPd',
          motDePasseTemporaire: aidantCreantSonEspace.motDePasse,
        },
      );

      expect(reponse.statusCode).toBe(200);
      const aidantRetrouve = await testeurMAC.entrepots
        .aidants()
        .lis(aidantCreantSonEspace.identifiant);
      expect(aidantRetrouve.dateSignatureCGU).toStrictEqual(
        FournisseurHorloge.maintenant(),
      );
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
        liens: {
          'lancer-diagnostic': {
            url: '/api/diagnostic',
            methode: 'POST',
          },
          'afficher-tableau-de-bord': {
            methode: 'GET',
            url: '/api/espace-aidant/tableau-de-bord',
          },
          'afficher-profil': {
            url: '/api/profil',
            methode: 'GET',
          },
        },
      });
    });

    describe('En ce qui concerne le changement du mot de passe', () => {
      it('vérifie la longueur du mot de passe', async () => {
        const aidantCreantSonEspace = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantCreantSonEspace,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/espace-aidant/cree`,
          donneesServeur.portEcoute,
          {
            cguSignees: true,
            motDePasse: 'EgLwVRxkl%#>cPd',
            motDePasseTemporaire: aidantCreantSonEspace.motDePasse,
          },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message:
            'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
        });
      });

      it('vérifie que le mot de passe contient au moins une minuscule', async () => {
        const aidantCreantSonEspace = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantCreantSonEspace,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/espace-aidant/cree`,
          donneesServeur.portEcoute,
          {
            cguSignees: true,
            motDePasse: 'EGLW5R0ITVRXKL%#>CPD',
            motDePasseTemporaire: aidantCreantSonEspace.motDePasse,
          },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message:
            'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
        });
      });

      it('vérifie que le mot de passe contient au moins une majuscule', async () => {
        const aidantCreantSonEspace = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantCreantSonEspace,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/espace-aidant/cree`,
          donneesServeur.portEcoute,
          {
            cguSignees: true,
            motDePasse: 'eglw5r0itvrxkl%#>cpd',
            motDePasseTemporaire: aidantCreantSonEspace.motDePasse,
          },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message:
            'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
        });
      });

      it('vérifie que le mot de passe contient au moins un chiffre', async () => {
        const aidantCreantSonEspace = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantCreantSonEspace,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/espace-aidant/cree`,
          donneesServeur.portEcoute,
          {
            cguSignees: true,
            motDePasse: 'EgLwCRDItVRxkl%#>cPd',
            motDePasseTemporaire: aidantCreantSonEspace.motDePasse,
          },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message:
            'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
        });
      });

      it('vérifie que le mot de passe contient au moins un caractère spécial', async () => {
        const aidantCreantSonEspace = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantCreantSonEspace,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/espace-aidant/cree`,
          donneesServeur.portEcoute,
          {
            cguSignees: true,
            motDePasse: 'EgLwCRD0tVRxklAbCcPd',
            motDePasseTemporaire: aidantCreantSonEspace.motDePasse,
          },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message:
            'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
        });
      });

      it('vérifie que le mot de passe temporaire est bien fourni', async () => {
        const aidantCreantSonEspace = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantCreantSonEspace,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/espace-aidant/cree`,
          donneesServeur.portEcoute,
          {
            cguSignees: true,
            motDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
            motDePasseTemporaire: '',
          },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message:
            'Le mot de passe temporaire est obligatoire.\nVotre mot de passe temporaire est erroné.',
        });
      });

      it('vérifie que le mot de passe temporaire est bien fourni et que le nouveau mot de passe est valide', async () => {
        const aidantCreantSonEspace = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantCreantSonEspace,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/espace-aidant/cree`,
          donneesServeur.portEcoute,
          {
            cguSignees: true,
            motDePasse: 'EgLwCRD0tVRxklAbCcPd',
            motDePasseTemporaire: '',
          },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message:
            'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.\nLe mot de passe temporaire est obligatoire.\nVotre mot de passe temporaire est erroné.',
        });
      });

      it('vérifie que le mot de passe temporaire est différent du nouveau mot de passe', async () => {
        const aidantCreantSonEspace = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantCreantSonEspace,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/espace-aidant/cree`,
          donneesServeur.portEcoute,
          {
            cguSignees: true,
            motDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
            motDePasseTemporaire: 'EgLwCRD0tVRxkl>AbCcPd',
          },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message:
            'Votre nouveau mot de passe doit être différent du mot de passe temporaire.\nVotre mot de passe temporaire est erroné.',
        });
      });

      it("vérifie que le mot de passe temporaire est bien celui de l'utilisateur", async () => {
        const aidantCreantSonEspace = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantCreantSonEspace,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/espace-aidant/cree`,
          donneesServeur.portEcoute,
          {
            cguSignees: true,
            motDePasse: 'EgLwCRD0tVRxkl>AbCcPd',
            motDePasseTemporaire: 'mauvais-mdp',
          },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: 'Votre mot de passe temporaire est erroné.',
        });
      });
    });

    it('renvoie une erreur HTTP 422 si les CGU ne sont pas acceptées', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-02-04T13:04:25+01:00')),
      );
      const aidantCreantSonEspace = unAidant().sansEspace().construis();
      await testeurMAC.entrepots.aidants().persiste(aidantCreantSonEspace);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        aidantCreantSonEspace,
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/espace-aidant/cree`,
        donneesServeur.portEcoute,
        {
          cguSignees: false,
          motDePasse: 'EgLw5R0ItVRxkl%#>cPd',
          motDePasseTemporaire: aidantCreantSonEspace.motDePasse,
        },
      );

      expect(reponse.statusCode).toBe(422);
      expect(await reponse.json()).toStrictEqual({
        message: 'Vous devez signer les CGU.',
      });
    });
  });
});
