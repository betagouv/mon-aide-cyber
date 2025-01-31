import { describe, expect, it } from 'vitest';
import testeurIntegration from '../../api/testeurIntegration';
import { executeRequete } from '../executeurRequete';
import { Express } from 'express';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { unDiagnosticInitiePar } from '../../espace-aidant/tableau-de-bord/constructeurs';
import {
  unAidant,
  unCompteAidantRelieAUnCompteUtilisateur,
  unUtilisateur,
} from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { ReponseDiagnostics } from '../../../src/api/tableau-de-bord/routesAPITableauDeBord';

describe('le serveur MAC sur les routes /api/mon-espace/tableau-de-bord', () => {
  describe('quand une requête GET est reçue sur /', () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { app: Express };

    beforeEach(() => {
      donneesServeur = testeurMAC.initialise();
      testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
    });

    afterEach(() => {
      testeurMAC.arrete();
    });

    it("retourne une liste vide de diagnostic si l'aidant n'a jamais initié de diagnostic", async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
        constructeurAidant: unAidant(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/mon-espace/tableau-de-bord`
      );

      expect(reponse.statusCode).toBe(200);
      expect(reponse.json()).toStrictEqual<ReponseDiagnostics>({
        diagnostics: [],
        liens: {
          'lancer-diagnostic': {
            url: '/api/diagnostic',
            methode: 'POST',
          },
          'afficher-profil': { url: '/api/profil', methode: 'GET' },
          'afficher-preferences': {
            url: '/api/aidant/preferences',
            methode: 'GET',
          },
          'se-deconnecter': {
            url: '/api/token',
            methode: 'DELETE',
            typeAppel: 'API',
          },
        },
      });
    });

    it('Retourne l’action se déconnecter propre à ProConnect', async () => {
      const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurUtilisateur: unUtilisateur(),
        constructeurAidant: unAidant(),
      });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurProConnect(
        utilisateur.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/mon-espace/tableau-de-bord`
      );

      expect(reponse.statusCode).toBe(200);
      const corpsReponse: ReponseDiagnostics = await reponse.json();
      expect(corpsReponse.liens['se-deconnecter']).toStrictEqual({
        url: '/pro-connect/deconnexion',
        methode: 'GET',
        typeAppel: 'DIRECT',
      });
    });

    it("retourne les diagnostics initiés par l'Aidant", async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-02-04T13:54:07+01:00'))
      );
      const { utilisateur, aidant } =
        await unCompteAidantRelieAUnCompteUtilisateur({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurUtilisateur: unUtilisateur(),
          constructeurAidant: unAidant(),
        });
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        utilisateur.identifiant
      );
      const premierDiagnostic = await unDiagnosticInitiePar(
        'Corse-du-Sud',
        'enseignement',
        aidant,
        testeurMAC.entrepots.diagnostic(),
        testeurMAC.adaptateurRelations
      );
      const deuxiemeDiagnostic = await unDiagnosticInitiePar(
        'Corse-du-Sud',
        'enseignement',
        aidant,
        testeurMAC.entrepots.diagnostic(),
        testeurMAC.adaptateurRelations
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/mon-espace/tableau-de-bord`
      );

      expect(reponse.statusCode).toBe(200);
      expect(reponse.json()).toStrictEqual<ReponseDiagnostics>({
        diagnostics: [
          {
            identifiant: premierDiagnostic.identifiant,
            secteurActivite: 'enseignement',
            dateCreation: '04.02.2024',
            secteurGeographique: `Corse-du-Sud`,
          },
          {
            identifiant: deuxiemeDiagnostic.identifiant,
            secteurActivite: 'enseignement',
            dateCreation: '04.02.2024',
            secteurGeographique: `Corse-du-Sud`,
          },
        ],
        liens: {
          'lancer-diagnostic': {
            url: '/api/diagnostic',
            methode: 'POST',
          },
          [`afficher-diagnostic-${premierDiagnostic.identifiant}`]: {
            url: `/api/diagnostic/${premierDiagnostic.identifiant}/restitution`,
            methode: 'GET',
          },
          [`afficher-diagnostic-${deuxiemeDiagnostic.identifiant}`]: {
            url: `/api/diagnostic/${deuxiemeDiagnostic.identifiant}/restitution`,
            methode: 'GET',
          },
          'afficher-profil': { url: '/api/profil', methode: 'GET' },
          'afficher-preferences': {
            url: '/api/aidant/preferences',
            methode: 'GET',
          },
          'se-deconnecter': {
            url: '/api/token',
            methode: 'DELETE',
            typeAppel: 'API',
          },
        },
      });
    });

    it('Vérifie la signature des CGU', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/mon-espace/tableau-de-bord`
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });
  });
});
