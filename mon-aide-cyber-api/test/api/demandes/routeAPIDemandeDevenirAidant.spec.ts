import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from '../executeurRequete';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import {
  Departement,
  departements,
} from '../../../src/gestion-demandes/departements';
import { unConstructeurDeDemandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/constructeurDeDemandeDevenirAidant';
import { uneRequeteDemandeDevenirAidant } from './constructeurRequeteDemandeDevenirAidant';
import crypto from 'crypto';
import { FauxServiceDeChiffrement } from '../../infrastructure/securite/FauxServiceDeChiffrement';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateur';
import { Aidant } from '../../../src/espace-aidant/Aidant';

describe('Le serveur MAC, sur  les routes de demande pour devenir Aidant', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('Quand une requête GET est reçue', () => {
    it('Fournis la liste des départements et leurs codes', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute
      );

      expect(await reponse.json()).toStrictEqual({
        departements: departements.map(({ nom, code }) => ({
          nom,
          code,
        })),
        liens: {
          'envoyer-demande-devenir-aidant': {
            url: '/api/demandes/devenir-aidant',
            methode: 'POST',
          },
        },
      });
    });
  });

  describe('Quand une requête POST est reçue /api/demandes/devenir-aidant', () => {
    let donneesServeur: { portEcoute: number; app: Express };

    beforeEach(() => {
      donneesServeur = testeurMAC.initialise();
    });

    afterEach(() => testeurMAC.arrete());
    it('Réponds OK à la requête', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        uneRequeteDemandeDevenirAidant()
          .dansLeDepartement('Hautes-Alpes')
          .construis()
      );

      expect(reponse.statusCode).toStrictEqual(200);
      expect(
        (await testeurMAC.entrepots.demandesDevenirAidant().tous())[0]
          .departement
      ).toStrictEqual<Departement>({
        nom: 'Hautes-Alpes',
        code: '5',
        codeRegion: '93',
      });
    });

    it('Réponds OK à la requête lorsque le mail contient des majuscules', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        uneRequeteDemandeDevenirAidant()
          .avecUnMail('JeaN.DupOnT@mail.com')
          .dansLeDepartement('Hautes-Alpes')
          .construis()
      );

      expect(reponse.statusCode).toStrictEqual(200);
      expect(
        (
          await testeurMAC.entrepots
            .demandesDevenirAidant()
            .rechercheDemandeEnCoursParMail('jean.dupont@mail.com')
        )?.mail
      ).toStrictEqual('jean.dupont@mail.com');
    });

    it("Renvoie une erreur 400 si l'utilisateur a déjà fait une demande préalable", async () => {
      await testeurMAC.entrepots
        .demandesDevenirAidant()
        .persiste(
          unConstructeurDeDemandeDevenirAidant()
            .avecUnMail('mail@fournisseur.fr')
            .construis()
        );
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        uneRequeteDemandeDevenirAidant()
          .avecUnMail('mail@fournisseur.fr')
          .construis()
      );

      expect(reponse.statusCode).toStrictEqual(400);
      expect(await reponse.json()).toStrictEqual({
        message: 'Une demande existe déjà',
      });
    });

    describe('Valide les paramètres de la requête', () => {
      let donneesServeur: { portEcoute: number; app: Express };

      beforeEach(() => {
        donneesServeur = testeurMAC.initialise();
      });

      afterEach(() => testeurMAC.arrete());

      it("Retourne le code 422 en cas d'invalidité", async () => {
        const corpsDeRequeteInvalide = {};

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          donneesServeur.portEcoute,
          corpsDeRequeteInvalide
        );

        expect(reponse.statusCode).toStrictEqual(422);
      });

      it("Précise l'erreur dans un message, si une erreur est rencontré", async () => {
        const corpsDeRequeteAvecMailInvalide = uneRequeteDemandeDevenirAidant()
          .avecUnMail('mail-invalide')
          .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          donneesServeur.portEcoute,
          corpsDeRequeteAvecMailInvalide
        );

        expect(JSON.parse(reponse.body).message).toStrictEqual(
          'Veuillez renseigner votre e-mail'
        );
      });

      it('Précise toutes les erreurs dans un message, si plusieurs erreurs sont rencontrées', async () => {
        const corpsDeRequeteAvecMailEtNomInvalides =
          uneRequeteDemandeDevenirAidant()
            .avecUnMail('mail-invalide')
            .avecUnNomVide()
            .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          donneesServeur.portEcoute,
          corpsDeRequeteAvecMailEtNomInvalides
        );

        expect(JSON.parse(reponse.body).message).toStrictEqual(
          'Veuillez renseigner votre nom, Veuillez renseigner votre e-mail'
        );
      });

      it('Retourne le code 422 en cas de mauvais département', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          donneesServeur.portEcoute,
          {
            nom: 'nom',
            prenom: 'prenom',
            mail: 'test.mail@fournisseur.fr',
            departement: 'Grandes-Hautes-Alpes',
          }
        );

        expect(reponse.statusCode).toStrictEqual(422);
      });
    });
  });

  describe('Quand une requête POST est reçue sur /api/demandes/devenir-aidant/creation-espace-aidant', async () => {
    it('Crée l’espace de l’Aidant', async () => {
      const demande = unConstructeurDeDemandeDevenirAidant().construis();
      await testeurMAC.entrepots.demandesDevenirAidant().persiste(demande);
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-08-08T13:22:31'))
      );
      const token = btoa(
        JSON.stringify({ demande: demande.identifiant, mail: demande.mail })
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant/creation-espace-aidant',
        donneesServeur.portEcoute,
        {
          motDePasse: 'mon_Mot-D3p4ssee',
          confirmationMotDePasse: 'mon_Mot-D3p4ssee',
          token,
          cguSignees: true,
        }
      );

      expect(reponse.statusCode).toStrictEqual(201);
      expect(await reponse.json()).toStrictEqual({
        liens: {
          'se-connecter': { url: '/api/token', methode: 'POST' },
        },
      });
      const utilisateurs = await testeurMAC.entrepots.utilisateurs().tous();
      expect(utilisateurs).toHaveLength(1);
      const utilisateur = utilisateurs[0];
      expect(utilisateur.dateSignatureCGU).toStrictEqual(
        FournisseurHorloge.maintenant()
      );
      const aidants = await testeurMAC.entrepots.aidants().tous();
      expect(aidants[0]).toStrictEqual<Aidant>({
        identifiant: utilisateur.identifiant,
        email: demande.mail,
        nomPrenom: utilisateur.nomPrenom,
        preferences: {
          secteursActivite: [],
          departements: [demande.departement],
          typesEntites: [],
        },
        consentementAnnuaire: false,
      });
    });

    it('Retourne une erreur HTTP', async () => {
      const aidant = unAidant().construis();
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail(aidant.email)
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);
      await testeurMAC.entrepots.demandesDevenirAidant().persiste(demande);
      const token = btoa(
        JSON.stringify({ demande: demande.identifiant, mail: demande.mail })
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant/creation-espace-aidant',
        donneesServeur.portEcoute,
        {
          motDePasse: 'mon_Mot-D3p4ssee',
          confirmationMotDePasse: 'mon_Mot-D3p4ssee',
          token,
          cguSignees: true,
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(await reponse.json()).toStrictEqual({
        message: 'Un compte Aidant avec cette adresse email existe déjà.',
      });
    });

    describe('Lors de la phase de validation', () => {
      it('Vérifie la correspondance entre les deux mots de passes saisis', async () => {
        const demande = unConstructeurDeDemandeDevenirAidant().construis();
        await testeurMAC.entrepots.demandesDevenirAidant().persiste(demande);
        const token = btoa(
          JSON.stringify({ demande: demande.identifiant, mail: demande.mail })
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant/creation-espace-aidant',
          donneesServeur.portEcoute,
          {
            motDePasse: 'mon_Mot-D3p4sse',
            confirmationMotDePasse: 'mon_Mot-D3p4sseeeeeee',
            token,
            cguSignees: true,
          }
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message:
            'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber., Les deux mots de passe saisis ne correspondent pas.',
        });
      });

      it('Vérifie que les CGU sont signées', async () => {
        const demande = unConstructeurDeDemandeDevenirAidant().construis();
        await testeurMAC.entrepots.demandesDevenirAidant().persiste(demande);
        const token = btoa(
          JSON.stringify({ demande: demande.identifiant, mail: demande.mail })
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant/creation-espace-aidant',
          donneesServeur.portEcoute,
          {
            motDePasse: 'mon_Mot-D3p4ssee',
            confirmationMotDePasse: 'mon_Mot-D3p4ssee',
            token,
            cguSignees: false,
          }
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: 'Veuillez signer les CGU.',
        });
      });

      describe('De la demande', () => {
        beforeEach(() => {
          testeurMAC.serviceDeChiffrement = new FauxServiceDeChiffrement(
            new Map()
          );
          donneesServeur = testeurMAC.initialise();
        });

        afterEach(() => testeurMAC.arrete());

        it('Vérifie que la demande est connue', async () => {
          const token = btoa(
            JSON.stringify({
              demande: crypto.randomUUID(),
              mail: 'jean.dupont@email.com',
            })
          );
          const fauxServiceDeChiffrement =
            testeurMAC.serviceDeChiffrement as FauxServiceDeChiffrement;
          fauxServiceDeChiffrement.ajoute(token, 'cccc');

          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/devenir-aidant/creation-espace-aidant',
            donneesServeur.portEcoute,
            {
              motDePasse: 'mon_Mot-D3p4ssee',
              confirmationMotDePasse: 'mon_Mot-D3p4ssee',
              token: 'cccc',
              cguSignees: true,
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message: 'Aucune demande ne correspond.',
          });
          expect(fauxServiceDeChiffrement.aEteAppele()).toBe(true);
        });

        it('Vérifie que le mail est bien rattaché à la demande', async () => {
          const demande = unConstructeurDeDemandeDevenirAidant()
            .avecUnMail('jean.dupont@mail.fr')
            .construis();
          await testeurMAC.entrepots.demandesDevenirAidant().persiste(demande);
          const token = btoa(
            JSON.stringify({
              demande: demande.identifiant,
              mail: 'marc.dupont@mail.fr',
            })
          );
          const fauxServiceDeChiffrement =
            testeurMAC.serviceDeChiffrement as FauxServiceDeChiffrement;
          fauxServiceDeChiffrement.ajoute(token, 'aaa');

          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/devenir-aidant/creation-espace-aidant',
            donneesServeur.portEcoute,
            {
              motDePasse: 'mon_Mot-D3p4ssee',
              confirmationMotDePasse: 'mon_Mot-D3p4ssee',
              token: 'aaa',
              cguSignees: true,
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message: 'Aucune demande ne correspond.',
          });
          expect(fauxServiceDeChiffrement.aEteAppele()).toBe(true);
        });

        it('Vérifie que le mail est bien rattaché à une demande en cours', async () => {
          const demande = unConstructeurDeDemandeDevenirAidant()
            .traitee()
            .construis();
          await testeurMAC.entrepots.demandesDevenirAidant().persiste(demande);
          const token = btoa(
            JSON.stringify({
              demande: demande.identifiant,
              mail: demande.mail,
            })
          );
          const fauxServiceDeChiffrement =
            testeurMAC.serviceDeChiffrement as FauxServiceDeChiffrement;
          fauxServiceDeChiffrement.ajoute(token, 'bbbb');

          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/devenir-aidant/creation-espace-aidant',
            donneesServeur.portEcoute,
            {
              motDePasse: 'mon_Mot-D3p4ssee',
              confirmationMotDePasse: 'mon_Mot-D3p4ssee',
              token: 'bbbb',
              cguSignees: true,
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message: 'Aucune demande ne correspond.',
          });
          expect(fauxServiceDeChiffrement.aEteAppele()).toBe(true);
        });
      });
    });
  });
});
