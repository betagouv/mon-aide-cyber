import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { executeRequete } from '../executeurRequete';
import { uneDemandeAide } from '../../gestion-demandes/aide/ConstructeurDemandeAide';
import { gironde } from '../../../src/gestion-demandes/departements';

describe('Le serveur MAC, sur  les routes de réponse à une demande', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  it("Envoie la confirmation de diagnostic à l'Aidant", async () => {
    const aidant = unAidant()
      .avecUnEmail('jean.dupont@email.com')
      .avecUnNomPrenom('Jean DUPONT')
      .construis();
    const demandeAide = uneDemandeAide()
      .avecUnEmail('entite-aidee@email.com')
      .dansLeDepartement(gironde)
      .construis();
    await testeurMAC.entrepots.aidants().persiste(aidant);
    await testeurMAC.entrepots.demandesAides().persiste(demandeAide);

    const reponse = await executeRequete(
      donneesServeur.app,
      'POST',
      `/api/aidant/repondre-a-une-demande`,
      {
        token: `${demandeAide.identifiant}:${aidant.identifiant}`,
      }
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
});
