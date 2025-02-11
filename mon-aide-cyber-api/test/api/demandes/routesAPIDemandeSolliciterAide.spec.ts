import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import crypto from 'crypto';
import { ReponseDemandeSolliciterAideEnErreur } from '../../../src/api/demandes/routesAPIDemandeSolliciterAide';
import { adaptateurUUID } from '../../../src/infrastructure/adaptateurs/adaptateurUUID';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';

describe('Le serveur MAC, sur les routes de sollicitation d’aide de la part de l’Aidé pour un Aidant donné', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('Quand une requête POST est reçue', () => {
    it('Traite la demande de sollicitation de l’Aidé', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const aidant = unAidant()
        .ayantPourDepartements([
          {
            nom: 'Corse-du-Sud',
            code: '2A',
            codeRegion: '94',
          },
        ])
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        {
          cguValidees: true,
          email: 'jean.dupont@aide.com',
          departement: 'Corse-du-Sud',
          aidantSollicite: aidant.identifiant,
        }
      );

      expect(reponse.statusCode).toBe(202);
      const aides = await testeurMAC.entrepots.demandesAides().tous();
      expect(aides).toHaveLength(1);
      expect(aides[0].dateSignatureCGU).toStrictEqual(
        FournisseurHorloge.maintenant()
      );
    });

    it('Valide l’Aidant', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        {
          cguValidees: true,
          email: 'jean.dupont@aide.com',
          departement: 'Corse-du-Sud',
          aidantSollicite: crypto.randomUUID(),
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(
        await reponse.json()
      ).toStrictEqual<ReponseDemandeSolliciterAideEnErreur>({
        message: "Le aidant demandé n'existe pas.",
        liens: {
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        },
      });
    });

    it('Valide le département', async () => {
      const aidant = unAidant()
        .ayantPourDepartements([
          {
            nom: 'Corse-du-Sud',
            code: '2A',
            codeRegion: '94',
          },
        ])
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        {
          cguValidees: true,
          email: 'jean.dupont@aide.com',
          departement: 'Département-inconnu',
          aidantSollicite: aidant.identifiant,
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(
        await reponse.json()
      ).toStrictEqual<ReponseDemandeSolliciterAideEnErreur>({
        message:
          'Veuillez renseigner un département.\n' +
          'L’Aidant n’intervient pas sur ce département.',
        liens: {
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        },
      });
    });

    it('Le département est obligatoire', async () => {
      const aidant = unAidant()
        .ayantPourDepartements([
          {
            nom: 'Corse-du-Sud',
            code: '2A',
            codeRegion: '94',
          },
        ])
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        {
          cguValidees: true,
          email: 'jean.dupont@aide.com',
          aidantSollicite: aidant.identifiant,
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(
        await reponse.json()
      ).toStrictEqual<ReponseDemandeSolliciterAideEnErreur>({
        message:
          'Veuillez renseigner un département.\n' +
          'L’Aidant n’intervient pas sur ce département.',
        liens: {
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        },
      });
    });

    it('Valide que l’Aidant est bien dans le département saisi', async () => {
      const aidant = unAidant()
        .ayantPourDepartements([
          {
            nom: 'Corse-du-Sud',
            code: '2A',
            codeRegion: '94',
          },
        ])
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        {
          cguValidees: true,
          email: 'jean.dupont@aide.com',
          departement: 'Finistère',
          aidantSollicite: aidant.identifiant,
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(
        await reponse.json()
      ).toStrictEqual<ReponseDemandeSolliciterAideEnErreur>({
        message: 'L’Aidant n’intervient pas sur ce département.',
        liens: {
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        },
      });
    });

    it('Prend en compte la raison sociale', async () => {
      const uuid = crypto.randomUUID();
      adaptateurUUID.genereUUID = () => uuid;
      FournisseurHorlogeDeTest.initialise(new Date());
      const aidant = unAidant()
        .ayantPourDepartements([
          {
            nom: 'Corse-du-Sud',
            code: '2A',
            codeRegion: '94',
          },
        ])
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        {
          cguValidees: true,
          email: 'jean.dupont@aide.com',
          departement: 'Corse-du-Sud',
          raisonSociale: 'Beta-gouv',
          aidantSollicite: aidant.identifiant,
        }
      );

      expect(reponse.statusCode).toBe(202);
      expect(
        (await testeurMAC.entrepots.demandesAides().lis(uuid)).raisonSociale
      ).toBe('Beta-gouv');
    });

    it("Valide le mail de l'Aidé", async () => {
      const uuid = crypto.randomUUID();
      adaptateurUUID.genereUUID = () => uuid;
      FournisseurHorlogeDeTest.initialise(new Date());
      const aidant = unAidant()
        .ayantPourDepartements([
          {
            nom: 'Corse-du-Sud',
            code: '2A',
            codeRegion: '94',
          },
        ])
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        {
          cguValidees: true,
          email: '',
          departement: 'Corse-du-Sud',
          raisonSociale: 'Beta-gouv',
          aidantSollicite: aidant.identifiant,
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(
        await reponse.json()
      ).toStrictEqual<ReponseDemandeSolliciterAideEnErreur>({
        message: 'Veuillez renseigner votre email.',
        liens: {
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        },
      });
    });

    it('Valide que les CGU ont été signées', async () => {
      const uuid = crypto.randomUUID();
      adaptateurUUID.genereUUID = () => uuid;
      FournisseurHorlogeDeTest.initialise(new Date());
      const aidant = unAidant()
        .ayantPourDepartements([
          {
            nom: 'Corse-du-Sud',
            code: '2A',
            codeRegion: '94',
          },
        ])
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/solliciter-aide',
        {
          cguValidees: false,
          email: 'mail@mail.com',
          departement: 'Corse-du-Sud',
          raisonSociale: 'Beta-gouv',
          aidantSollicite: aidant.identifiant,
        }
      );

      expect(reponse.statusCode).toBe(422);
      expect(
        await reponse.json()
      ).toStrictEqual<ReponseDemandeSolliciterAideEnErreur>({
        message: 'Veuillez valider les CGU.',
        liens: {
          'solliciter-aide': {
            methode: 'POST',
            url: '/api/demandes/solliciter-aide',
          },
        },
      });
    });
  });
});
