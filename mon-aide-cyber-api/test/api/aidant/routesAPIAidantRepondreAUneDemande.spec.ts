import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { executeRequete } from '../executeurRequete';
import { uneDemandeAide } from '../../gestion-demandes/aide/ConstructeurDemandeAide';
import { gironde } from '../../../src/gestion-demandes/departements';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';

import { tokenAttributionDemandeAide } from '../../../src/gestion-demandes/aide/MiseEnRelationParCriteres';
import { DemandePourPostuler } from '../../../src/api/aidant/miseEnRelation';

describe('Le serveur MAC, sur  les routes de réponse à une demande', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
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
      const aidant = unAidant()

        .construis();
      const demandeAide: DemandeAide = uneDemandeAide()
          .avecUnEmail('banal@email.com')
          .dansLeDepartement(gironde)
          .construis();

      await testeurMAC.entrepots.aidants().persiste(aidant);
      await testeurMAC.entrepots.demandesAides().persiste(demandeAide);
      const token = tokenAttributionDemandeAide().chiffre(
        demandeAide.email,
        aidant.identifiant
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/aidant/repondre-a-une-demande`,
        {
          token,
        }
      );

      expect(reponse.statusCode).toBe(400);
    });
  });

  describe("Concernant l'obtention des détails de la demande d'aide", () => {
    it('Renvoie systématiquement des infos en dur, le temps de développer complètement la feature', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/repondre-a-une-demande/informations-de-demande`
      );

      expect(reponse.statusCode).toBe(200);

      expect(reponse.json()).toStrictEqual<DemandePourPostuler>({
        dateCreation: '2025-05-15T13:30:00.000Z',
        departement: {
          nom: 'Gironde',
          code: '33',
          codeRegion: '75',
        },
        typeEntite: 'Entreprise privée',
        secteurActivite: 'Tertiaire',
      });
    });

    it('Rejette la requête avec une erreur 400 si le token commence par ’x’, le temps de développer complètement la feature', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/repondre-a-une-demande/informations-de-demande?token=xa`
      );

      expect(reponse.statusCode).toBe(400);
      expect(await reponse.json()).toStrictEqual({
        codeErreur: 'TOKEN_INVALIDE',
      });
    });
  });
});
