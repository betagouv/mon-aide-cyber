import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from '../executeurRequete';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';

describe('Le serveur MAC, sur  les routes de demande pour devenir Aidant', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('Quand une requête POST est reçue', () => {
    it('Réponds à la requête', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        { nom: 'nom', prenom: 'prenom', mail: 'mail@fournisseur.fr' }
      );

      expect(reponse.statusCode).toStrictEqual(200);
    });

    it("retourne une erreur et un message informant que le nom de l'aidant est requis si le champs 'nom' est absent", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        {}
      );

      expect(reponse.statusCode).toBe(422);
      expect(JSON.parse(reponse.body).message).toBe(
        'Veuillez renseigner votre nom'
      );
    });

    it("retourne une erreur et un message informant que le nom l'aidant est requis si le champs 'nom' est vide", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        { nom: '', prenom: 'prenom' }
      );

      expect(reponse.statusCode).toBe(422);
      expect(JSON.parse(reponse.body).message).toBe(
        'Veuillez renseigner votre nom'
      );
    });

    it("retourne une erreur et un message informant que le prénom de l'aidant est requis si le champs 'prenom' est absent", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        { prenom: '', nom: 'nom' }
      );

      expect(reponse.statusCode).toBe(422);
      expect(JSON.parse(reponse.body).message).toBe(
        'Veuillez renseigner votre prénom'
      );
    });

    it("retourne une erreur et un message informant que le prénom l'aidant est requis si le champs 'prenom' est vide", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        { prenom: '', nom: 'nom' }
      );

      expect(reponse.statusCode).toBe(422);
      expect(JSON.parse(reponse.body).message).toBe(
        'Veuillez renseigner votre prénom'
      );
    });

    it("retourne une erreur et un message informant que le mail de l'aidant est requis si le champs 'mail' est absent", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        { prenom: 'prenom', nom: 'nom' }
      );

      expect(reponse.statusCode).toBe(422);
      expect(JSON.parse(reponse.body).message).toBe(
        'Veuillez renseigner votre e-mail'
      );
    });

    it("retourne une erreur et un message informant que le mail l'aidant est requis si le champs 'mail' est vide", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        { prenom: 'prenom', nom: 'nom', mail: '' }
      );

      expect(reponse.statusCode).toBe(422);
      expect(JSON.parse(reponse.body).message).toBe(
        'Veuillez renseigner votre e-mail'
      );
    });

    it("retourne une erreur et un message informant que le mail l'aidant est requis si le champs 'mail' est malformé", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        { prenom: 'prenom', nom: 'nom', mail: 'pas-un-mail' }
      );

      expect(reponse.statusCode).toBe(422);
      expect(JSON.parse(reponse.body).message).toBe(
        'Veuillez renseigner votre e-mail'
      );
    });
  });
});
