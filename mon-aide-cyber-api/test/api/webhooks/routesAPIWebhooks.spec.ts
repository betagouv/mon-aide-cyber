import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';
import {
  CorpsReponseTallyRecue,
  ReponseTallyRecue,
} from '../../../src/api/webhooks/routesAPIWebhooks';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { uneDemandeDevenirAidant } from '../../constructeurs/constructeurDemandesDevenirAidant';
import {
  unConstructeurDeFinAtelierLivestorm,
  unConstructeurDeReponseTally,
} from './constructeursDeWebhooks';

describe('Routes Webhooks', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('Pour tally', () => {
    describe("Lorsqu'une requête POST est reçue sur /webhooks/tally", () => {
      it('Accepte la requête', async () => {
        FournisseurHorlogeDeTest.initialise(new Date());

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/webhooks/tally`,
          unConstructeurDeReponseTally()
            .creeLe(new Date(Date.parse('2025-06-20T10:00:00')))
            .avecUnNom('formulaire exemple')
            .ajouteUneReponse({ label: 'Nom', value: 'DUPONT' })
            .construis()
        );

        expect(reponse.statusCode).toBe(202);
        expect(
          testeurMAC.busEvenement.evenementRecu
        ).toStrictEqual<ReponseTallyRecue>({
          corps: {
            dateReponse: new Date(
              Date.parse('2025-06-20T10:00:00')
            ).toISOString(),
            nomFormulaire: 'formulaire exemple',
            reponses: [
              {
                libelle: 'Nom',
                valeur: 'DUPONT',
              },
            ],
          },
          identifiant: expect.any(String),
          type: 'REPONSE_TALLY_RECUE',
          date: FournisseurHorloge.maintenant(),
        });
      });

      it('La route est protégée', async () => {
        await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/webhooks/tally`,
          unConstructeurDeReponseTally()
            .creeLe(new Date(Date.parse('2025-06-20T10:00:00')))
            .avecUnNom('formulaire exemple')
            .ajouteUneReponse({ label: 'Nom', value: 'DUPONT' })
            .construis()
        );

        expect(testeurMAC.adaptateurSignatureRequete.verifiePassage()).toBe(
          true
        );
      });

      it('Ne consigne pas les champs libre (TEXTAREA pour l’instant)', async () => {
        FournisseurHorlogeDeTest.initialise(new Date());

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/webhooks/tally`,
          unConstructeurDeReponseTally()
            .creeLe(new Date(Date.parse('2025-06-20T10:00:00')))
            .avecUnNom('formulaire exemple')
            .ajouteUneReponse({ label: 'Nom', value: 'DUPONT' })
            .ajouteUneReponseZoneDeTexteLibre({
              label: 'Une saisie',
              value: 'Ma saisie libre',
            })
            .construis()
        );

        expect(reponse.statusCode).toBe(202);
        expect(
          (
            testeurMAC.busEvenement.evenementRecu
              ?.corps as unknown as CorpsReponseTallyRecue
          ).reponses
        ).toStrictEqual([
          {
            libelle: 'Nom',
            valeur: 'DUPONT',
          },
        ]);
      });
    });
  });

  describe('Pour livestorm', () => {
    describe("Lorsqu'une requête POST est reçue sur /webhooks/livestorm", () => {
      it('active le compte Aidant', async () => {
        const demandeDevenirAidant = uneDemandeDevenirAidant()
          .ayantPourMail('jean.dupont@email.com')
          .construis();
        await testeurMAC.entrepots
          .demandesDevenirAidant()
          .persiste(demandeDevenirAidant);

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/webhooks/livestorm`,
          unConstructeurDeFinAtelierLivestorm()
            .creeLe(new Date(Date.parse('2025-06-20T10:00:00')))
            .avecUnTitre('Atelier Aidant du 20/06/2025')
            .ajouteUnParticipant('jean.dupont@email.com')
            .construis()
        );

        expect(reponse.statusCode).toBe(200);
        expect(
          await testeurMAC.entrepots
            .aidants()
            .rechercheParEmail('jean.dupont@email.com')
        ).toBeDefined();
      });

      it('active les comptes de plusieurs Aidants', async () => {
        const demandeJeanDupont = uneDemandeDevenirAidant()
          .ayantPourMail('jean.dupont@email.com')
          .construis();
        const demandeJeanMartin = uneDemandeDevenirAidant()
          .ayantPourMail('jean.martin@email.com')
          .construis();
        await testeurMAC.entrepots
          .demandesDevenirAidant()
          .persiste(demandeJeanDupont);
        await testeurMAC.entrepots
          .demandesDevenirAidant()
          .persiste(demandeJeanMartin);

        const reponse = await executeRequete(
          donneesServeur.app,
          'POST',
          `/api/webhooks/livestorm`,
          unConstructeurDeFinAtelierLivestorm()
            .creeLe(new Date(Date.parse('2025-06-20T10:00:00')))
            .avecUnTitre('Atelier Aidant du 20/06/2025')
            .ajouteUnParticipant('jean.dupont@email.com')
            .ajouteUnParticipant('jean.martin@email.com')
            .construis()
        );

        expect(reponse.statusCode).toBe(200);
        expect(await testeurMAC.entrepots.aidants().tous()).toHaveLength(2);
      });
    });
  });
});
