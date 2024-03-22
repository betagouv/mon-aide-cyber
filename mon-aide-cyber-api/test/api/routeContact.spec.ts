import { afterEach, beforeEach, describe, expect } from 'vitest';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { AdaptateurEnvoiMailMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';

describe('le serveur MAC sur les routes /api/public', () => {
  let testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    testeurMAC = testeurIntegration();
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête POST est reçue sur /message', () => {
    it('envoie un email à MonAideCyber', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/contact/',
        donneesServeur.portEcoute,
        {
          nom: 'Jean Dupont',
          email: 'jean-dupont@email.com',
          message: 'Bonjour le monde!',
        },
      );

      expect(reponse.statusCode).toBe(202);
      expect(
        (
          testeurMAC.adaptateurEnvoieMessage as AdaptateurEnvoiMailMemoire
        ).aEteEnvoye(
          'jean-dupont@email.com',
          'Bonjour le monde!',
          'Jean Dupont',
        ),
      ).toBe(true);
    });

    it("retourne une erreur 500 si le message n'a pu être envoyé", async () => {
      (
        testeurMAC.adaptateurEnvoieMessage as AdaptateurEnvoiMailMemoire
      ).genereErreur();
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/contact/',
        donneesServeur.portEcoute,
        {
          nom: 'Jean Dupont',
          email: 'jean-dupont@email.com',
          message: 'Bonjour le monde!',
        },
      );

      expect(reponse.statusCode).toBe(500);
      expect(await reponse.json()).toStrictEqual({
        message: "MonAideCyber n'est pas en mesure de traiter votre demande.",
      });
    });

    describe('MAC valide la présence des champs', () => {
      it('valide le nom', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/contact/',
          donneesServeur.portEcoute,
          {
            nom: ' ',
            email: 'jean-dupont@email.com',
            message: 'Bonjour le monde!',
          },
        );

        expect(reponse.statusCode).toBe(400);
        expect(await reponse.json()).toStrictEqual({
          message:
            "Des erreurs se trouvent dans le(s) champ(s) suivant(s): 'nom'",
        });
      });

      it("valide l'email", async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/contact/',
          donneesServeur.portEcoute,
          {
            nom: 'Jean Dupont',
            email: 'mauvais-email.com',
            message: 'Bonjour le monde!',
          },
        );

        expect(reponse.statusCode).toBe(400);
        expect(await reponse.json()).toStrictEqual({
          message:
            "Des erreurs se trouvent dans le(s) champ(s) suivant(s): 'email'",
        });
      });

      it('valide le message', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/contact/',
          donneesServeur.portEcoute,
          {
            nom: 'Jean Dupont',
            email: 'jean-dupont@email.com',
            message: ' ',
          },
        );

        expect(reponse.statusCode).toBe(400);
        expect(await reponse.json()).toStrictEqual({
          message:
            "Des erreurs se trouvent dans le(s) champ(s) suivant(s): 'message'",
        });
      });
    });

    describe('MAC aseptise les champs', () => {
      it('aseptise le nom', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/contact/',
          donneesServeur.portEcoute,
          {
            nom: 'Jean <b>Dupont</b>',
            email: 'jean-dupont@email.com',
            message: 'Bonjour le monde!',
          },
        );

        expect(reponse.statusCode).toBe(202);
        expect(
          (
            testeurMAC.adaptateurEnvoieMessage as AdaptateurEnvoiMailMemoire
          ).aEteEnvoye(
            'jean-dupont@email.com',
            'Bonjour le monde!',
            'Jean &lt;b&gt;Dupont&lt;&#x2F;b&gt;',
          ),
        ).toBe(true);
      });

      it('aseptise le message', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/contact/',
          donneesServeur.portEcoute,
          {
            nom: 'Jean Dupont',
            email: 'jean-dupont@email.com',
            message: 'Bonjour <script>alert("le monde!")</script>',
          },
        );

        expect(reponse.statusCode).toBe(202);
        expect(
          (
            testeurMAC.adaptateurEnvoieMessage as AdaptateurEnvoiMailMemoire
          ).aEteEnvoye(
            'jean-dupont@email.com',
            'Bonjour &lt;script&gt;alert(&quot;le monde!&quot;)&lt;&#x2F;script&gt;',
            'Jean Dupont',
          ),
        ).toBe(true);
      });
    });
  });
});
