import { describe, expect, it } from 'vitest';
import testeurIntegration from '../../api/testeurIntegration';
import { executeRequete } from '../executeurRequete';
import { Express } from 'express';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { ReponseDiagnostics } from '../../../src/api/espace-aidant/tableau-de-bord/routesAPITableauDeBord';
import { unDiagnosticInitiePar } from '../../espace-aidant/tableau-de-bord/constructeurs';
import {
  unAidant,
  unCompteAidantRelieAUnCompteUtilisateur,
  unUtilisateur,
} from '../../constructeurs/constructeursAidantUtilisateur';

describe('le serveur MAC sur les routes /api/espace-aidant/tableau-de-bord', () => {
  describe('quand une requête GET est reçue sur /', () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { portEcoute: number; app: Express };

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
        utilisateur
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/espace-aidant/tableau-de-bord`,
        donneesServeur.portEcoute
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
          'se-deconnecter': { url: '/api/token', methode: 'DELETE' },
        },
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
        utilisateur
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
        `/api/espace-aidant/tableau-de-bord`,
        donneesServeur.portEcoute
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
          'se-deconnecter': { url: '/api/token', methode: 'DELETE' },
        },
      });
    });

    it('Vérifie la signature des CGU', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/espace-aidant/tableau-de-bord`,
        donneesServeur.portEcoute
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });
  });
});
