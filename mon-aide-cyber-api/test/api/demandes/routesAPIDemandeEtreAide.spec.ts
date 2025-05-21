import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Express } from 'express';
import testeurIntegration from '../testeurIntegration';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { executeRequete } from '../executeurRequete';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  ain,
  aisne,
  allier,
  alpesDeHauteProvence,
  alpesMaritimes,
  ardeche,
  ardennes,
  ariege,
  Departement,
  departements,
  finistere,
  gironde,
  hautesAlpes,
} from '../../../src/gestion-demandes/departements';
import { EntrepotAideMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { associations } from '../../../src/espace-aidant/Aidant';
import { unAdaptateurRechercheEntreprise } from '../../constructeurs/constructeurAdaptateurRechercheEntrepriseEnDur';

describe('Le serveur MAC, sur les routes de demande d’aide de la part de l’Aidé', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    testeurMAC.adaptateurDeRechercheEntreprise =
      unAdaptateurRechercheEntreprise().construis();
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('/api/demandes/etre-aide', () => {
    describe('Quand une requête POST est reçue', () => {
      it('Valide la demande de l’aidé', async () => {
        FournisseurHorlogeDeTest.initialise(
          new Date(Date.parse('2024-02-29T14:04:17+01:00'))
        );
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/etre-aide',
          {
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            departement: 'Corse-du-Sud',
            raisonSociale: 'beta-gouv',
            siret: '12345678901234',
          }
        );

        expect(reponse.statusCode).toBe(202);
        const aides = await (
          testeurMAC.entrepots.demandesAides() as EntrepotAideMemoire
        ).tous();
        expect(aides).toHaveLength(1);
        expect(aides[0].dateSignatureCGU).toStrictEqual(
          FournisseurHorloge.maintenant()
        );
      });

      it('Valide la demande si le code du département est fourni', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/etre-aide',
          {
            departement: '29',
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            raisonSociale: 'beta-gouv',
            siret: '12345678901234',
          }
        );

        expect(reponse.statusCode).toBe(202);
        const aides = await (
          testeurMAC.entrepots.demandesAides() as EntrepotAideMemoire
        ).tous();
        expect(aides).toHaveLength(1);
        expect(aides[0].departement).toStrictEqual(finistere);
      });

      it.each([
        ['01', ain],
        ['02', aisne],
        ['03', allier],
        ['04', alpesDeHauteProvence],
        ['05', hautesAlpes],
        ['06', alpesMaritimes],
        ['07', ardeche],
        ['08', ardennes],
        ['09', ariege],
      ])(
        'Valide la demande pour le code departement %s',
        async (code: string, departement: Departement) => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              departement: code,
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              raisonSociale: 'beta-gouv',
              siret: '12345678901234',
            }
          );

          expect(reponse.statusCode).toBe(202);
          const aides = await (
            testeurMAC.entrepots.demandesAides() as EntrepotAideMemoire
          ).tous();
          expect(aides).toHaveLength(1);
          expect(aides[0].departement).toStrictEqual(departement);
        }
      );

      it('Renvoie une erreur si la demande n’a pu aller au bout', async () => {
        const testeurMAC = testeurIntegration();
        const donneesServeur: { app: Express } = testeurMAC.initialise();
        testeurMAC.adaptateurDeRechercheEntreprise.rechercheEntreprise = () =>
          Promise.resolve([
            {
              siret: '12345678901234',
              departement: gironde.code,
              secteursActivite: [],
              nom: 'entreprise-factice',
              commune: 'BORDEAUX',
              typeEntite: associations,
            },
          ]);
        testeurMAC.adaptateurEnvoieMessage.envoie = async () => {
          throw new Error(
            'Erreur car on simule une erreur d’envoie de message.'
          );
        };

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/etre-aide',
          {
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            departement: 'Corse-du-Sud',
            raisonSociale: 'beta-gouv',
            siret: '12345678901234',
          }
        );

        expect(reponse.statusCode).toBe(500);
        expect(await reponse.json()).toStrictEqual({
          message: "Votre demande d'aide n'a pu aboutir",
        });
      });

      it('Renvoie une erreur si l‘utilisateur MAC à mettre en relation n‘existe pas', async () => {
        const testeurMAC = testeurIntegration();
        const donneesServeur: { app: Express } = testeurMAC.initialise();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/etre-aide',
          {
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            departement: 'Corse-du-Sud',
            raisonSociale: 'beta-gouv',
            relationUtilisateur: 'utilisateurinconnu@yopmail.com',
            siret: '12345678901234',
          }
        );

        expect(reponse.statusCode).toBe(400);
        expect(await reponse.json()).toStrictEqual({
          message:
            'L’adresse email de l’Aidant ou du prestataire n’est pas référencée. Veuillez entrer une adresse valide et réessayer.',
        });
      });

      it('Renvoie une erreur si l‘Aidant, ciblé par son identifiant, à mettre en relation n‘existe pas', async () => {
        const testeurMAC = testeurIntegration();
        const donneesServeur: { app: Express } = testeurMAC.initialise();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/etre-aide',
          {
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            departement: 'Corse-du-Sud',
            raisonSociale: 'beta-gouv',
            identifiantAidant: 'af9620ef-3495-493f-b5f2-28d5719f992f',
            siret: '12345678901234',
          }
        );

        expect(reponse.statusCode).toBe(400);
        expect(await reponse.json()).toStrictEqual({
          message: 'L’Aidant fourni n’est pas référencé.',
        });
      });

      it('Renvoie une erreur si l‘entité ne correspond pas au SIRET fourni', async () => {
        const testeurMAC = testeurIntegration();
        testeurMAC.adaptateurDeRechercheEntreprise =
          unAdaptateurRechercheEntreprise().vide().construis();
        const donneesServeur: { app: Express } = testeurMAC.initialise();

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          '/api/demandes/etre-aide',
          {
            cguValidees: true,
            email: 'jean.dupont@aide.com',
            departement: 'Corse-du-Sud',
            raisonSociale: 'beta-gouv',
            siret: '12345678901234',
          }
        );

        expect(reponse.statusCode).toBe(400);
        expect(await reponse.json()).toStrictEqual({
          message: 'Aucune entreprise ne correspond au SIRET',
        });
      });

      describe("En ce qui concerne les informations envoyées par l'Aidé", () => {
        const testeurMAC = testeurIntegration();
        let donneesServeur: { app: Express };

        beforeEach(() => {
          testeurMAC.adaptateurDeRechercheEntreprise =
            unAdaptateurRechercheEntreprise().construis();
          donneesServeur = testeurMAC.initialise();
        });

        afterEach(() => testeurMAC.arrete());
        it('Vérifie que les CGU sont signées', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              cguValidees: false,
              email: 'jean.dupont@aide.com',
              departement: 'Paris',
              raisonSociale: 'beta-gouv',
              siret: '12345678901234',
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message: 'Veuillez signer les CGU',
            liens: {
              'demander-aide': {
                url: '/api/demandes/etre-aide',
                methode: 'POST',
              },
            },
          });
        });

        it("Vérifie que l'email est renseigné", async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              cguValidees: true,
              email: 'ceci-n-est-pas-un-email',
              departement: 'Gironde',
              raisonSociale: 'beta-gouv',
              siret: '12345678901234',
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message: 'Veuillez renseigner votre Email',
            liens: {
              'demander-aide': {
                url: '/api/demandes/etre-aide',
                methode: 'POST',
              },
            },
          });
        });

        it('Vérifie que le département est renseigné', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              departement: '   ',
              raisonSociale: 'beta-gouv',
              siret: '12345678901234',
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json().message).toBe(
            "Veuillez renseigner le département de l'entité pour laquelle vous sollicitez une aide, Département inconnu"
          );
        });

        it('Rejette la demande si le département n’est pas connu', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              departement: 'departement-inconnu',
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              raisonSociale: 'beta-gouv',
              siret: '12345678901234',
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json().message).toBe('Département inconnu');
        });

        it('La raison sociale est optionnelle', async () => {
          FournisseurHorlogeDeTest.initialise(
            new Date(Date.parse('2024-02-29T14:04:17+01:00'))
          );
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              departement: 'Finistère',
              siret: '12345678901234',
            }
          );

          expect(reponse.statusCode).toBe(202);
          const aides = await (
            testeurMAC.entrepots.demandesAides() as EntrepotAideMemoire
          ).tous();
          expect(aides).toHaveLength(1);
          expect(aides[0].dateSignatureCGU).toStrictEqual(
            FournisseurHorloge.maintenant()
          );
        });

        it('La raison sociale, lorsque fournie ne peut pas être vide', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              departement: 'Bas-Rhin',
              raisonSociale: '    ',
              siret: '12345678901234',
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message:
              "Veuillez renseigner la raison sociale de l'entité pour laquelle vous sollicitez une aide",
            liens: {
              'demander-aide': {
                url: '/api/demandes/etre-aide',
                methode: 'POST',
              },
            },
          });
        });

        it('La relation avec un utilisateur, lorsque fournie doit être un email', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              departement: 'Bas-Rhin',
              relationUtilisateur: 'mauvaisformat',
              siret: '12345678901234',
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message:
              "Veuillez renseigner un email valide pour l'utilisateur avec qui vous êtes en relation.",
            liens: {
              'demander-aide': {
                url: '/api/demandes/etre-aide',
                methode: 'POST',
              },
            },
          });
        });

        it('L’identifiant Aidant, optionnel, est un UUID', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              departement: 'Bas-Rhin',
              identifiantAidant: 'mauvaisformat',
              siret: '12345678901234',
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message: 'Veuillez renseigner un identifiant Aidant valide.',
            liens: {
              'demander-aide': {
                url: '/api/demandes/etre-aide',
                methode: 'POST',
              },
            },
          });
        });

        it('Vérifie la présence du SIRET', async () => {
          const reponse = await executeRequete(
            donneesServeur.app,
            'POST',
            '/api/demandes/etre-aide',
            {
              cguValidees: true,
              email: 'jean.dupont@aide.com',
              departement: 'Bas-Rhin',
              siret: '',
            }
          );

          expect(reponse.statusCode).toBe(422);
          expect(await reponse.json()).toStrictEqual({
            message: 'Veuillez renseigner un SIRET valide.',
            liens: {
              'demander-aide': {
                url: '/api/demandes/etre-aide',
                methode: 'POST',
              },
            },
          });
        });
      });
    });

    describe('Quand une requête GET est reçue', () => {
      it("Retourne le lien 'demander-aide'", async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/api/demandes/etre-aide'
        );

        expect(reponse.statusCode).toBe(200);
        expect((await reponse.json()).liens).toStrictEqual({
          'demander-aide': {
            url: '/api/demandes/etre-aide',
            methode: 'POST',
          },
        });
      });

      it('Retourne la liste des noms et codes des départements', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          '/api/demandes/etre-aide'
        );

        expect((await reponse.json()).departements).toStrictEqual(
          departements.map(({ nom, code }) => ({
            nom,
            code,
          }))
        );
      });
    });
  });
});
