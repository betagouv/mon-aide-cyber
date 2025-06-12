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
import {
  unAidant,
  unCompteUtilisateurInscritConnecteViaProConnect,
  unUtilisateurInscrit,
} from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { Aidant } from '../../../src/espace-aidant/Aidant';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { uneDemandeDevenirAidant } from '../../constructeurs/constructeurDemandesDevenirAidant';
import { ReponseDemandeDevenirAidant } from '../../../src/api/demandes/routeAPIDemandeDevenirAidant';
import { AdaptateurDeVerificationDeSessionDeTest } from '../../adaptateurs/AdaptateurDeVerificationDeSessionDeTest';

describe('Le serveur MAC, sur  les routes de demande pour devenir Aidant', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };
  let adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;

  beforeEach(() => {
    adaptateurDeVerificationDeSession =
      testeurMAC.adaptateurDeVerificationDeSession as AdaptateurDeVerificationDeSessionDeTest;
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('Quand une requête GET est reçue', () => {
    it('Dans le cas d’un utilisateur non connecté, fournit la liste des départements ainsi que le lien pour accéder à la ressource pour envoyer la demande pour devenir Aidant', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/demandes/devenir-aidant'
      );

      expect(await reponse.json()).toStrictEqual<ReponseDemandeDevenirAidant>({
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

    it('Dans le cas d’un utilisateur connecté, fournit ses informations', async () => {
      await unCompteUtilisateurInscritConnecteViaProConnect({
        entrepotUtilisateurInscrit: testeurMAC.entrepots.utilisateursInscrits(),
        constructeurUtilisateur: unUtilisateurInscrit()
          .avecUnEmail('jean.dupont@email.com')
          .avecUnNomPrenom('Jean Dupont')
          .sansValidationDeCGU(),
        adaptateurDeVerificationDeSession,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        '/api/demandes/devenir-aidant'
      );

      expect(await reponse.json()).toStrictEqual<ReponseDemandeDevenirAidant>({
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
        donneesUtilisateur: {
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@email.com',
        },
      });
    });
  });

  describe('Quand une requête POST est reçue /api/demandes/devenir-aidant', () => {
    let donneesServeur: { app: Express };

    beforeEach(() => {
      donneesServeur = testeurMAC.initialise();
    });

    afterEach(() => testeurMAC.arrete());
    it('Réponds OK à la requête', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        uneRequeteDemandeDevenirAidant()
          .dansLeDepartement('Hautes-Alpes')
          .ayantSigneLaCharte()
          .construis()
      );

      expect(reponse.statusCode).toStrictEqual(200);
      expect(
        (await testeurMAC.entrepots.demandesDevenirAidant().tous())[0]
          .departement
      ).toStrictEqual<Departement>({
        nom: 'Hautes-Alpes',
        code: '05',
        codeRegion: '93',
      });
    });

    it('Réponds OK à la requête lorsque le mail contient des majuscules', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        uneRequeteDemandeDevenirAidant()
          .avecUnMail('JeaN.DupOnT@mail.com')
          .dansLeDepartement('Hautes-Alpes')
          .ayantSigneLaCharte()
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

    describe('Valide les paramètres de la requête', () => {
      const testeurMAC = testeurIntegration();
      let donneesServeur: { app: Express };

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
          corpsDeRequeteInvalide
        );

        expect(reponse.statusCode).toStrictEqual(422);
        expect(
          await testeurMAC.entrepots.demandesDevenirAidant().tous()
        ).toHaveLength(0);
      });

      it("Précise l'erreur dans un message, si une erreur est rencontrée", async () => {
        const corpsDeRequeteAvecMailInvalide = uneRequeteDemandeDevenirAidant()
          .avecUnMail('mail-invalide')
          .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          corpsDeRequeteAvecMailInvalide
        );

        expect(JSON.parse(reponse.body).message).toStrictEqual(
          'Veuillez renseigner votre e-mail, Veuillez signer la Charte Aidant.'
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
          corpsDeRequeteAvecMailEtNomInvalides
        );

        expect(JSON.parse(reponse.body).message).toStrictEqual(
          'Veuillez renseigner votre nom, Veuillez renseigner votre e-mail, Veuillez signer la Charte Aidant.'
        );
      });

      it('Retourne le code 422 en cas de mauvais département', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
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
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUneEntite('Association')
        .construis();
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
        {
          token,
          cguSignees: true,
        }
      );

      expect(reponse.statusCode).toStrictEqual(201);
      expect(await reponse.json()).toStrictEqual({
        liens: {
          'se-connecter': { url: '/api/token', methode: 'POST' },
          'se-connecter-avec-pro-connect': {
            methode: 'GET',
            url: '/pro-connect/connexion',
          },
        },
      });
      const aidants = await testeurMAC.entrepots.aidants().tous();
      expect(aidants[0]).toStrictEqual<Aidant>({
        identifiant: expect.any(String),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        email: demande.mail,
        nomPrenom: `${demande.prenom} ${demande.nom}`,
        preferences: {
          secteursActivite: [],
          departements: [demande.departement],
          typesEntites: [],
          nomAffichageAnnuaire: aidants[0].preferences.nomAffichageAnnuaire,
        },
        entite: demande.entite!,
        consentementAnnuaire: false,
        dateSignatureCharte: demande.date,
      });
    });

    it('Retourne une erreur HTTP', async () => {
      const aidant = unAidant().construis();
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail(aidant.email)
        .avecUneEntite('Association')
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

        it('Lève une erreur si la demande a déjà été traitée', async () => {
          const demandeDejaTraitee = uneDemandeDevenirAidant()
            .traitee()
            .construis();
          await testeurMAC.entrepots
            .demandesDevenirAidant()
            .persiste(demandeDejaTraitee);
          const token = btoa(
            JSON.stringify({
              demande: demandeDejaTraitee.identifiant,
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
            {
              motDePasse: 'mon_Mot-D3p4ssee',
              confirmationMotDePasse: 'mon_Mot-D3p4ssee',
              token: 'cccc',
              cguSignees: true,
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message:
              'Votre demande pour devenir Aidant a déjà été traitée. Votre espace Aidant est disponible, vous pouvez vous connecter à celui-ci.',
          });
        });

        it('Lève une erreur si le mail dans le token ne correspond pas à celui de la demande', async () => {
          const demandeEnCours = unConstructeurDeDemandeDevenirAidant()
            .avecUnMail('jean.dupont@mail.fr')
            .construis();
          await testeurMAC.entrepots
            .demandesDevenirAidant()
            .persiste(demandeEnCours);
          const token = btoa(
            JSON.stringify({
              demande: demandeEnCours.identifiant,
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
      });
    });
  });

  describe('Dans le cadre de la mise en place des profils Aidants / Utilisateurs inscrits à partir du 31/01/2025', () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { app: Express };

    beforeEach(() => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-01-31T08:30:00'))
      );
      donneesServeur = testeurMAC.initialise();
      adaptateurEnvironnement.nouveauParcoursDevenirAidant = () =>
        '2025-01-31T00:00:00';
    });

    afterEach(() => testeurMAC.arrete());

    describe('Quand une requête POST est reçue /api/demandes/devenir-aidant', () => {
      it('Crée la demande', async () => {
        const corpsDeRequete = uneRequeteDemandeDevenirAidant()
          .ayantSigneLaCharte()
          .dansUneEntite('Beta-Gouv', '1234567890', 'ServicePublic')
          .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          corpsDeRequete
        );

        expect(reponse.statusCode).toBe(200);
        const demandes = await testeurMAC.entrepots
          .demandesDevenirAidant()
          .tous();
        expect(demandes[0].entite).toStrictEqual(corpsDeRequete.entite);
      });

      it('Retourne le code 422 si la charte n’est pas signée', async () => {
        const corpsDeRequete = uneRequeteDemandeDevenirAidant()
          .sansCharteAidant()
          .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          corpsDeRequete
        );

        expect(JSON.parse(reponse.body).message).toStrictEqual(
          'Veuillez signer la Charte Aidant.'
        );
        expect(reponse.statusCode).toStrictEqual(422);
      });

      it('Retourne le code 422 si les informations de l’entité fournie sont incorrectes', async () => {
        const corpsDeRequete = uneRequeteDemandeDevenirAidant()
          .dansUneEntite('', '', '')
          .ayantSigneLaCharte()
          .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          corpsDeRequete
        );

        expect(JSON.parse(reponse.body).message).toStrictEqual(
          'Veuillez renseigner un nom pour votre entité, Veuillez renseigner un SIRET pour votre entité, Veuillez fournir l’une des valeurs suivantes pour le type d’entité ’ServicePublic’, ’ServiceEtat’, ’Association’'
        );
        expect(reponse.statusCode).toStrictEqual(422);
      });

      it("Retourne OK si le futur Aidant est en attente d'adhésion à une association", async () => {
        const corpsDeRequete = uneRequeteDemandeDevenirAidant()
          .enAttenteAdhesionAssociation()
          .construis();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant',
          corpsDeRequete
        );

        expect(reponse.statusCode).toStrictEqual(200);
        const demandes = await testeurMAC.entrepots
          .demandesDevenirAidant()
          .tous();
        expect(demandes[0].entite).toStrictEqual({
          type: corpsDeRequete.entite?.type,
        });
      });
    });

    describe('Quand une requête POST est reçue /api/demandes/creation-espace-aidant', () => {
      it('Le mot de passe devient optionnel', async () => {
        const demande = unConstructeurDeDemandeDevenirAidant()
          .avecUneEntite('ServicePublic')
          .construis();
        await testeurMAC.entrepots.demandesDevenirAidant().persiste(demande);
        const token = btoa(
          JSON.stringify({ demande: demande.identifiant, mail: demande.mail })
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant/creation-espace-aidant',
          {
            token,
            cguSignees: true,
          }
        );

        expect(reponse.statusCode).toStrictEqual(201);
      });

      it("Crée l'espace de l'Aidant", async () => {
        const demande = unConstructeurDeDemandeDevenirAidant()
          .avecUneEntite('ServicePublic')
          .construis();
        await testeurMAC.entrepots.demandesDevenirAidant().persiste(demande);
        const token = btoa(
          JSON.stringify({ demande: demande.identifiant, mail: demande.mail })
        );

        await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant/creation-espace-aidant',
          {
            token,
            cguSignees: true,
          }
        );

        const aidantRecu = await testeurMAC.entrepots
          .aidants()
          .rechercheParEmail(demande.mail);
        expect(aidantRecu).toStrictEqual<Aidant>({
          identifiant: expect.any(String),
          email: demande.mail,
          nomPrenom: `${demande.prenom} ${demande.nom}`,
          preferences: {
            secteursActivite: [],
            departements: [demande.departement],
            typesEntites: [],
            nomAffichageAnnuaire: aidantRecu.preferences.nomAffichageAnnuaire,
          },
          consentementAnnuaire: false,
          dateSignatureCharte: demande.date,
          dateSignatureCGU: demande.date,
          entite: {
            nom: demande.entite!.nom!,
            siret: demande.entite!.siret!,
            type: 'ServicePublic',
          },
        });
      });

      it('Les CGU deviennent optionnelles', async () => {
        const demande = unConstructeurDeDemandeDevenirAidant()
          .avecUneEntite('ServicePublic')
          .construis();
        await testeurMAC.entrepots.demandesDevenirAidant().persiste(demande);
        const token = btoa(
          JSON.stringify({ demande: demande.identifiant, mail: demande.mail })
        );

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/devenir-aidant/creation-espace-aidant',
          {
            token,
          }
        );

        expect(reponse.statusCode).toStrictEqual(201);
      });
    });
  });
});
