import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { executeRequete } from '../executeurRequete';
import { uneDemandeAide } from '../../gestion-demandes/aide/ConstructeurDemandeAide';
import { finistere, gironde } from '../../../src/gestion-demandes/departements';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';

import { tokenAttributionDemandeAide } from '../../../src/gestion-demandes/aide/MiseEnRelationParCriteres';
import { DemandePourPostuler } from '../../../src/api/aidant/miseEnRelation';
import { AdaptateurDeRequeteHTTPMemoire } from '../../adaptateurs/AdaptateurDeRequeteHTTPMemoire';
import { ReponseAPIRechercheEntreprise } from '../recherche-entreprise/api';
import { adaptateurRechercheEntreprise } from '../../../src/infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import crypto from 'crypto';

describe('Le serveur MAC, sur  les routes de réponse à une demande', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };
  const uneEntrepriseDuSecteurPublicDansLeFinistere: ReponseAPIRechercheEntreprise =
    {
      results: [
        {
          complements: { est_association: false, est_service_public: true },
          nom_complet: 'Plouguerneau',
          siege: {
            departement: '29',
            siret: '0987654321',
            libelle_commune: 'PLOUGUERNEAU',
          },
          section_activite_principale: 'O',
        },
      ],
    };

  beforeEach(() => {
    const adaptateurDeRequeteHTTP = new AdaptateurDeRequeteHTTPMemoire();
    adaptateurDeRequeteHTTP.reponse<ReponseAPIRechercheEntreprise>(
      uneEntrepriseDuSecteurPublicDansLeFinistere
    );
    testeurMAC.adaptateurDeRechercheEntreprise = adaptateurRechercheEntreprise(
      adaptateurDeRequeteHTTP
    );
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe("Concernant la réponse par l'aidant", () => {
    it("Envoie la confirmation de diagnostic à l'Aidant", async () => {
      const aidant = unAidant()
        .avecUnEmail('jean.dupont@email.com')
        .avecUnNomPrenom('Jean DUPONT')
        .construis();
      const demandeAide: DemandeAide = uneDemandeAide()
        .avecUnEmail('entite-aidee@email.com')
        .dansLeDepartement(gironde)
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);
      await testeurMAC.entrepots.demandesAides().persiste(demandeAide);
      const token = tokenAttributionDemandeAide().chiffre(
        demandeAide.email,
        demandeAide.identifiant,
        aidant.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/aidant/repondre-a-une-demande`,
        { token }
      );

      expect(reponse.statusCode).toBe(202);
      expect(
        (
          testeurMAC.adaptateurEnvoieMessage as AdaptateurEnvoiMailMemoire
        ).demandeAideAttribueeEnvoyee({
          emailAidant: 'user-xavier@yopmail.com',
          nomPrenomAidant: 'User XAVIER',
          emailEntite: 'entite-aidee@yopmail.com',
          departement: gironde,
        })
      ).toBe(true);
    });

    it('Retourne une erreur 400 si la demande ne peut être pourvue (le mail de la demande commence par b)', async () => {
      const aidant = unAidant().construis();
      const demandeAide: DemandeAide = uneDemandeAide()
        .avecUnEmail('banal@email.com')
        .dansLeDepartement(gironde)
        .construis();

      await testeurMAC.entrepots.aidants().persiste(aidant);
      await testeurMAC.entrepots.demandesAides().persiste(demandeAide);
      const token = tokenAttributionDemandeAide().chiffre(
        demandeAide.email,
        demandeAide.identifiant,
        aidant.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/aidant/repondre-a-une-demande`,
        { token }
      );

      expect(reponse.statusCode).toBe(400);
    });
  });

  describe("Concernant l'obtention des détails de la demande d'aide", () => {
    it('Renvoie les infos de la demande dont l’email est dans le token', async () => {
      const token = tokenAttributionDemandeAide(
        testeurMAC.serviceDeChiffrement
      ).chiffre(
        'entite-aidee@email.com',
        '11111111-1111-1111-1111-111111111111',
        crypto.randomUUID()
      );
      const demandeAide: DemandeAide = uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(new Date('2025-04-02T12:37:00.000Z'))
        .avecUnEmail('entite-aidee@email.com')
        .avecIdentifiant('11111111-1111-1111-1111-111111111111')
        .dansLeDepartement(finistere)
        .avecLeSiret('0987654321')
        .construis();
      await testeurMAC.entrepots.demandesAides().persiste(demandeAide);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/repondre-a-une-demande/informations-de-demande?token=${token}`
      );

      expect(reponse.statusCode).toBe(200);
      expect(reponse.json()).toStrictEqual<DemandePourPostuler>({
        dateCreation: '2025-04-02T12:37:00.000Z',
        departement: {
          nom: 'Finistère',
          code: '29',
          codeRegion: '53',
        },
        typeEntite: 'Organisations publiques',
        secteurActivite: 'Administration, Tertiaire',
      });
    });

    it('Rejette la requête avec une erreur 400 si le déchiffrement du token lève une exception', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/repondre-a-une-demande/informations-de-demande?token=xa`
      );

      expect(reponse.statusCode).toBe(400);
      expect(await reponse.json()).toStrictEqual({
        codeErreur: 'TOKEN_INVALIDE',
        message: '',
      });
    });

    it('Rejette la requête avec une erreur 400 (et non une 404) si la demande d’Aide est introuvable', async () => {
      const tokenSansDemande = tokenAttributionDemandeAide(
        testeurMAC.serviceDeChiffrement
      ).chiffre(
        'entite-aidee@email.com',
        crypto.randomUUID(),
        crypto.randomUUID()
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/repondre-a-une-demande/informations-de-demande?token=${tokenSansDemande}`
      );

      expect(reponse.statusCode).toBe(400);
      expect(await reponse.json()).toStrictEqual({
        codeErreur: 'TOKEN_SANS_DEMANDE',
        message: '',
      });
    });
  });
});
