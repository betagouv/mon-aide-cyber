import { afterEach, beforeEach, describe, expect } from 'vitest';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { ReponseHATEOAS } from '../../src/api/hateoas/hateoas';

describe('le serveur MAC sur les routes /api/utilisateur', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête POST est reçue sur /finalise', () => {
    it('finalise la création du compte en marquant les CGU à signées et en modifiant le mot de passe', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-02-04T13:04:25+01:00')),
      );
      const aidantFinalisantSonCompte = unAidant()
        .avecCompteEnAttenteDeFinalisation()
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidantFinalisantSonCompte);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        aidantFinalisantSonCompte,
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/finalise`,
        donneesServeur.portEcoute,
        { cguSignees: true, motDePasse: 'EgLw5R0ItVRxkl%#>cPd' },
      );

      expect(reponse.statusCode).toBe(200);
      const aidantRetrouve = await testeurMAC.entrepots
        .aidants()
        .lis(aidantFinalisantSonCompte.identifiant);
      expect(aidantRetrouve.dateSignatureCGU).toStrictEqual(
        FournisseurHorloge.maintenant(),
      );
      expect(aidantRetrouve.motDePasse).toStrictEqual('EgLw5R0ItVRxkl%#>cPd');
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
        liens: {
          suite: { url: '/tableau-de-bord' },
          'lancer-diagnostic': {
            url: '/api/diagnostic',
            methode: 'POST',
          },
        },
      });
    });

    describe('En ce qui concerne le changement du mot de passe', () => {
      it('vérifie la longueur du mot de passe', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-02-04T13:04:25+01:00')),
        );
        const aidantFinalisantSonCompte = unAidant()
          .avecCompteEnAttenteDeFinalisation()
          .construis();
        await testeurMAC.entrepots
          .aidants()
          .persiste(aidantFinalisantSonCompte);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantFinalisantSonCompte,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/finalise`,
          donneesServeur.portEcoute,
          { cguSignees: true, motDePasse: 'EgLwVRxkl%#>cPd' },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: 'Le mot de passe est trop simple.',
        });
      });

      it('vérifie que le mot de passe contient au moins une minuscule', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-02-04T13:04:25+01:00')),
        );
        const aidantFinalisantSonCompte = unAidant()
          .avecCompteEnAttenteDeFinalisation()
          .construis();
        await testeurMAC.entrepots
          .aidants()
          .persiste(aidantFinalisantSonCompte);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantFinalisantSonCompte,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/finalise`,
          donneesServeur.portEcoute,
          { cguSignees: true, motDePasse: 'EGLW5R0ITVRXKL%#>CPD' },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: 'Le mot de passe est trop simple.',
        });
      });

      it('vérifie que le mot de passe contient au moins une majuscule', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-02-04T13:04:25+01:00')),
        );
        const aidantFinalisantSonCompte = unAidant()
          .avecCompteEnAttenteDeFinalisation()
          .construis();
        await testeurMAC.entrepots
          .aidants()
          .persiste(aidantFinalisantSonCompte);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantFinalisantSonCompte,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/finalise`,
          donneesServeur.portEcoute,
          { cguSignees: true, motDePasse: 'eglw5r0itvrxkl%#>cpd' },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: 'Le mot de passe est trop simple.',
        });
      });

      it('vérifie que le mot de passe contient au moins un chiffre', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-02-04T13:04:25+01:00')),
        );
        const aidantFinalisantSonCompte = unAidant()
          .avecCompteEnAttenteDeFinalisation()
          .construis();
        await testeurMAC.entrepots
          .aidants()
          .persiste(aidantFinalisantSonCompte);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantFinalisantSonCompte,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/finalise`,
          donneesServeur.portEcoute,
          { cguSignees: true, motDePasse: 'EgLwCRDItVRxkl%#>cPd' },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: 'Le mot de passe est trop simple.',
        });
      });

      it('vérifie que le mot de passe contient au moins un caractère spécial', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-02-04T13:04:25+01:00')),
        );
        const aidantFinalisantSonCompte = unAidant()
          .avecCompteEnAttenteDeFinalisation()
          .construis();
        await testeurMAC.entrepots
          .aidants()
          .persiste(aidantFinalisantSonCompte);
        testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
          aidantFinalisantSonCompte,
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/utilisateur/finalise`,
          donneesServeur.portEcoute,
          { cguSignees: true, motDePasse: 'EgLwCRD0tVRxklAbCcPd' },
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: 'Le mot de passe est trop simple.',
        });
      });
    });

    it('renvoie une erreur HTTP 422 si les CGU ne sont pas acceptées', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-02-04T13:04:25+01:00')),
      );
      const aidantFinalisantSonCompte = unAidant()
        .avecCompteEnAttenteDeFinalisation()
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidantFinalisantSonCompte);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        aidantFinalisantSonCompte,
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/finalise`,
        donneesServeur.portEcoute,
        { cguSignees: false, motDePasse: 'EgLw5R0ItVRxkl%#>cPd' },
      );

      expect(reponse.statusCode).toBe(422);
      expect(await reponse.json()).toStrictEqual({
        message: 'Vous devez signer les CGU.',
      });
    });
  });
});
