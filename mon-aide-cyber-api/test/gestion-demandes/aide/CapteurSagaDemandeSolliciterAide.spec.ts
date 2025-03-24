import { beforeEach, describe, expect, it } from 'vitest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  CapteurSagaDemandeSolliciterAide,
  DemandeSolliciterAideCree,
} from '../../../src/gestion-demandes/aide/CapteurSagaDemandeSolliciterAide';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import {
  adaptateursCorpsMessage,
  ProprietesMessageAidant,
} from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { unServiceAidant } from '../../../src/espace-aidant/ServiceAidantMAC';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { unConstructeurDeServices } from '../../constructeurs/constructeurServices';
import { unAdaptateurDeCorpsDeMessage } from './ConstructeurAdaptateurDeCorpsDeMessage';
import { finistere, gironde } from '../../../src/gestion-demandes/departements';
import { EntrepotAideMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

describe('Capteur saga demande solliciter Aide', () => {
  let adaptateurEnvoiMail: AdaptateurEnvoiMailMemoire;
  let entrepots: EntrepotsMemoire;
  let busEvenement: BusEvenementDeTest;
  let busCommande: BusCommandeMAC;

  beforeEach(() => {
    adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    entrepots = new EntrepotsMemoire();
    busEvenement = new BusEvenementDeTest();
    busCommande = new BusCommandeMAC(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      unConstructeurDeServices(entrepots.aidants())
    );
    adaptateursCorpsMessage.sollicitation =
      unAdaptateurDeCorpsDeMessage().construis().sollicitation;
  });

  describe("En ce qui concerne l'Aidant", () => {
    it("Envoie le mail sollicitant l'aide à l'Aidant indiqué", async () => {
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);

      await new CapteurSagaDemandeSolliciterAide(
        busCommande,
        busEvenement,
        adaptateurEnvoiMail,
        unServiceAidant(entrepots.aidants())
      ).execute({
        type: 'SagaDemandeSolliciterAide',
        email: 'entite@mail.com',
        departement: finistere,
        identifiantAidant: aidant.identifiant,
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(aidant.email, 'Bonjour Aidant!')
      ).toBe(true);
      expect(adaptateurEnvoiMail.aEteEnvoyePar('INFO')).toBe(true);
    });

    it("Envoie le mail sollicitant l'aide à l'Aidant indiqué avec la raison sociale", async () => {
      adaptateursCorpsMessage.sollicitation = unAdaptateurDeCorpsDeMessage()
        .notificationAidant(
          (proprietes: ProprietesMessageAidant) =>
            `Bonjour Aidant! ${proprietes.raisonSocialeEntite}`
        )
        .construis().sollicitation;
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);

      await new CapteurSagaDemandeSolliciterAide(
        busCommande,
        busEvenement,
        adaptateurEnvoiMail,
        unServiceAidant(entrepots.aidants())
      ).execute({
        type: 'SagaDemandeSolliciterAide',
        email: 'entite@mail.com',
        departement: finistere,
        identifiantAidant: aidant.identifiant,
        raisonSociale: 'BetaGouv',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          aidant.email,
          'Bonjour Aidant! BetaGouv'
        )
      ).toBe(true);
      expect(adaptateurEnvoiMail.aEteEnvoyePar('INFO')).toBe(true);
    });

    it("publie l'événément 'AIDE_VIA_SOLLICITATION_AIDANT_CREE'", async () => {
      const maintenant = new Date();
      FournisseurHorlogeDeTest.initialise(maintenant);
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);

      await new CapteurSagaDemandeSolliciterAide(
        busCommande,
        busEvenement,
        adaptateurEnvoiMail,
        unServiceAidant(entrepots.aidants())
      ).execute({
        type: 'SagaDemandeSolliciterAide',
        email: 'jean-dupont@email.com',
        departement: gironde,
        identifiantAidant: aidant.identifiant,
        raisonSociale: 'Test',
      });

      const aideRecue = (
        await (entrepots.demandesAides() as EntrepotAideMemoire).tous()
      )[0];

      expect(
        busEvenement.evenementRecu
      ).toStrictEqual<DemandeSolliciterAideCree>({
        identifiant: expect.any(String),
        type: 'AIDE_VIA_SOLLICITATION_AIDANT_CREE',
        date: maintenant,
        corps: {
          identifiantAide: aideRecue.identifiant,
          identifiantAidant: aidant.identifiant,
          departement: '33',
        },
      });
      expect(
        busEvenement.consommateursTestes.get(
          'AIDE_VIA_SOLLICITATION_AIDANT_CREE'
        )?.[0].evenementConsomme
      ).toStrictEqual<DemandeSolliciterAideCree>({
        identifiant: expect.any(String),
        type: 'AIDE_VIA_SOLLICITATION_AIDANT_CREE',
        date: maintenant,
        corps: {
          identifiantAide: aideRecue.identifiant,
          identifiantAidant: aidant.identifiant,
          departement: '33',
        },
      });
    });
  });

  describe('En ce qui concerne MAC', () => {
    it('Envoie le mail récapitulatif à MAC', async () => {
      adaptateurEnvironnement.messagerie = () =>
        adaptateursEnvironnementDeTest.messagerie('mac@mail.com');
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);

      await new CapteurSagaDemandeSolliciterAide(
        busCommande,
        busEvenement,
        adaptateurEnvoiMail,
        unServiceAidant(entrepots.aidants())
      ).execute({
        type: 'SagaDemandeSolliciterAide',
        email: 'entite@mail.com',
        departement: finistere,
        identifiantAidant: aidant.identifiant,
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA('mac@mail.com', 'Bonjour MAC!')
      ).toBe(true);
      expect(adaptateurEnvoiMail.aEteEnvoyePar('MONAIDECYBER')).toBe(true);
    });

    it('Envoie le mail récapitulatif à MAC avec la raison sociale', async () => {
      adaptateurEnvironnement.messagerie = () =>
        adaptateursEnvironnementDeTest.messagerie('mac@mail.com');
      adaptateursCorpsMessage.sollicitation = unAdaptateurDeCorpsDeMessage()
        .recapitulatifMac(
          (proprietes) => `Bonjour MAC! ${proprietes.raisonSociale}`
        )
        .construis().sollicitation;
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);

      await new CapteurSagaDemandeSolliciterAide(
        busCommande,
        busEvenement,
        adaptateurEnvoiMail,
        unServiceAidant(entrepots.aidants())
      ).execute({
        type: 'SagaDemandeSolliciterAide',
        email: 'entite@mail.com',
        departement: finistere,
        identifiantAidant: aidant.identifiant,
        raisonSociale: 'BetaGouv',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA('mac@mail.com', 'Bonjour MAC! BetaGouv')
      ).toBe(true);
    });
  });

  describe("En ce qui concerne l'Aidé", () => {
    it("Envoie le mail récapitulatif de la sollicitation à l'Aidé", async () => {
      const aidant = unAidant().construis();
      await entrepots.aidants().persiste(aidant);

      await new CapteurSagaDemandeSolliciterAide(
        busCommande,
        busEvenement,
        adaptateurEnvoiMail,
        unServiceAidant(entrepots.aidants())
      ).execute({
        type: 'SagaDemandeSolliciterAide',
        email: 'entite@mail.com',
        departement: finistere,
        identifiantAidant: aidant.identifiant,
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA('entite@mail.com', 'Bonjour Aidé!')
      ).toBe(true);
      expect(adaptateurEnvoiMail.aEteEnvoyePar('INFO')).toBe(true);
    });
  });
});
