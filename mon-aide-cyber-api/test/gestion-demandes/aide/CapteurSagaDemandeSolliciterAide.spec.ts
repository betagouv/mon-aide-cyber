import { beforeEach, describe, expect, it } from 'vitest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { CapteurSagaDemandeSolliciterAide } from '../../../src/gestion-demandes/aide/CapteurSagaDemandeSolliciterAide';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { unServiceAidant } from '../../../src/authentification/ServiceAidantMAC';
import { unAidant } from '../../authentification/constructeurs/constructeurAidant';
import {
  adaptateurCorpsMessage,
  ProprietesMessageAidant,
} from '../../../src/gestion-demandes/aide/adaptateurCorpsMessage';

describe('Capteur saga demande solliciter Aide', () => {
  describe("En ce qui concerne l'Aidant", () => {
    beforeEach(
      () =>
        (adaptateurCorpsMessage.notificationAidantSollicitation = () => ({
          genereCorpsMessage: () => 'Bonjour Aidant!',
        }))
    );

    it("Envoie le mail sollicitant l'aide à l'Aidant indiqué", async () => {
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const entrepots = new EntrepotsMemoire();
      const busCommande = new BusCommandeMAC(
        entrepots,
        new BusEvenementDeTest(),
        adaptateurEnvoiMail,
        { aidant: unServiceAidant(entrepots.aidants()) }
      );
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);

      await new CapteurSagaDemandeSolliciterAide(
        entrepots,
        busCommande,
        adaptateurEnvoiMail
      ).execute({
        type: 'SagaDemandeSolliciterAide',
        email: 'entite@mail.com',
        departement: 'Finistère',
        identifiantAidant: aidant.identifiant,
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          aidant.identifiantConnexion,
          'Bonjour Aidant!'
        )
      ).toBe(true);
      expect(adaptateurEnvoiMail.aEteEnvoyePar('INFO')).toBe(true);
    });

    it("Envoie le mail sollicitant l'aide à l'Aidant indiqué avec la raison sociale", async () => {
      adaptateurCorpsMessage.notificationAidantSollicitation = () => ({
        genereCorpsMessage: (proprietes: ProprietesMessageAidant) =>
          `Bonjour Aidant! ${proprietes.raisonSocialeEntite}`,
      });
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const entrepots = new EntrepotsMemoire();
      const busCommande = new BusCommandeMAC(
        entrepots,
        new BusEvenementDeTest(),
        adaptateurEnvoiMail,
        { aidant: unServiceAidant(entrepots.aidants()) }
      );
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);

      await new CapteurSagaDemandeSolliciterAide(
        entrepots,
        busCommande,
        adaptateurEnvoiMail
      ).execute({
        type: 'SagaDemandeSolliciterAide',
        email: 'entite@mail.com',
        departement: 'Finistère',
        identifiantAidant: aidant.identifiant,
        raisonSociale: 'BetaGouv',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          aidant.identifiantConnexion,
          'Bonjour Aidant! BetaGouv'
        )
      ).toBe(true);
      expect(adaptateurEnvoiMail.aEteEnvoyePar('INFO')).toBe(true);
    });
  });
});
