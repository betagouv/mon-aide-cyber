import { beforeEach, describe, expect, it } from 'vitest';
import { unAide } from '../../aide/ConstructeurAide';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  CapteurSagaDemandeAide,
  DemandeAideCree,
} from '../../../src/gestion-demandes/aide/CapteurSagaDemandeAide';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { BusCommandeTest } from '../../infrastructure/bus/BusCommandeTest';
import { CapteurCommandeRechercheAideParEmail } from '../../../src/aide/CapteurCommandeRechercheAideParEmail';
import {
  CapteurCommandeCreerAide,
  CommandeCreerAide,
} from '../../../src/aide/CapteurCommandeCreerAide';
import { CapteurCommande } from '../../../src/domaine/commande';
import { unConstructeurDeServices } from '../../constructeurs/constructeurServices';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { adaptateursCorpsMessage } from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { unAdaptateurDeCorpsDeMessage } from './ConstructeurAdaptateurDeCorpsDeMessage';
import { Aide } from '../../../src/aide/Aide';

describe('Capteur saga demande de validation de CGU Aidé', () => {
  beforeEach(() => {
    adaptateursCorpsMessage.demande =
      unAdaptateurDeCorpsDeMessage().construis().demande;
  });
  describe("Si l'Aidé est connu de MAC", () => {
    it('Interrompt le parcours', async () => {
      const aide = unAide().construis();
      const entrepots = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const capteur = new CapteurSagaDemandeAide(
        new BusCommandeMAC(
          entrepots,
          busEvenement,
          adaptateurEnvoiMail,
          unConstructeurDeServices(entrepots.aidants())
        ),
        busEvenement,
        adaptateurEnvoiMail
      );
      await entrepots.aides().persiste(aide);

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: aide.email,
        departement: aide.departement,
        raisonSociale: aide.raisonSociale!,
        relationAidant: false,
      });

      expect(await entrepots.aides().tous()).toHaveLength(1);
      expect(await entrepots.aides().lis(aide.identifiant)).toStrictEqual(aide);
    });
  });

  describe("Si l'Aidé n'est pas connu de MAC", () => {
    it("Crée l'Aidé", async () => {
      const entrepotsMemoire = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const busCommande = new BusCommandeMAC(
        entrepotsMemoire,
        busEvenement,
        adaptateurEnvoiMail,
        unConstructeurDeServices(entrepotsMemoire.aidants())
      );
      const capteur = new CapteurSagaDemandeAide(
        busCommande,
        busEvenement,
        adaptateurEnvoiMail
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'un email',
        departement: 'Allier',
        relationAidant: false,
      });

      expect(
        await entrepotsMemoire.aides().rechercheParEmail('un email')
      ).not.toBeUndefined();
    });

    it('Envoie un email de confirmation à l’Aidé', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00'))
      );
      const adaptateurEnvoieMail = new AdaptateurEnvoiMailMemoire();
      const entrepotsMemoire = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const busCommande = new BusCommandeMAC(
        entrepotsMemoire,
        busEvenement,
        adaptateurEnvoieMail,
        unConstructeurDeServices(entrepotsMemoire.aidants())
      );
      const capteur = new CapteurSagaDemandeAide(
        busCommande,
        busEvenement,
        adaptateurEnvoieMail
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: 'Gironde',
        raisonSociale: 'BetaGouv',
        relationAidant: false,
      });

      expect(
        adaptateurEnvoieMail.aEteEnvoyeA(
          'jean-dupont@email.com',
          'Bonjour entité Aidée'
        )
      ).toBe(true);
    });

    it('Envoie un email de demande d’aide à MAC', async () => {
      adaptateurEnvironnement.messagerie = () =>
        adaptateursEnvironnementDeTest.messagerie('mac@email.com');
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00'))
      );
      const adaptateurEnvoieMail = new AdaptateurEnvoiMailMemoire();
      const entrepotsMemoire = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const busCommande = new BusCommandeMAC(
        entrepotsMemoire,
        busEvenement,
        adaptateurEnvoieMail,
        unConstructeurDeServices(entrepotsMemoire.aidants())
      );
      const capteur = new CapteurSagaDemandeAide(
        busCommande,
        busEvenement,
        adaptateurEnvoieMail
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: 'Gironde',
        raisonSociale: 'BetaGouv',
        relationAidant: false,
      });

      expect(
        adaptateurEnvoieMail.aEteEnvoyeA(
          'mac@email.com',
          'Bonjour une entité a fait une demande d’aide'
        )
      ).toBe(true);
    });

    it('Envoie un email de demande d’aide à MAC en prenant en compte la relation existante avec un Aidant', async () => {
      adaptateurEnvironnement.messagerie = () =>
        adaptateursEnvironnementDeTest.messagerie('mac@email.com');
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .recapitulatifDemandeAide(
          (_aide: Aide, relationAidant: boolean) =>
            `Bonjour une entité a fait une demande d’aide, relation Aidant : ${relationAidant}`
        )
        .construis().demande;
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00'))
      );
      const adaptateurEnvoieMail = new AdaptateurEnvoiMailMemoire();
      const entrepotsMemoire = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const busCommande = new BusCommandeMAC(
        entrepotsMemoire,
        busEvenement,
        adaptateurEnvoieMail,
        unConstructeurDeServices(entrepotsMemoire.aidants())
      );
      const capteur = new CapteurSagaDemandeAide(
        busCommande,
        busEvenement,
        adaptateurEnvoieMail
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: 'Gironde',
        raisonSociale: 'BetaGouv',
        relationAidant: true,
      });

      expect(
        adaptateurEnvoieMail.aEteEnvoyeA(
          'mac@email.com',
          'Bonjour une entité a fait une demande d’aide, relation Aidant : true'
        )
      ).toBe(true);
    });

    it("Envoie un email de confirmation l'Aidé en prenant en compte la relation existante avec un Aidant", async () => {
      adaptateurEnvironnement.messagerie = () =>
        adaptateursEnvironnementDeTest.messagerie();
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .confirmationDemandeAide(
          (_aide: Aide, relationAidant: boolean) =>
            `Bonjour entité Aidée, relation Aidant : ${relationAidant}`
        )
        .construis().demande;
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00'))
      );
      const adaptateurEnvoieMail = new AdaptateurEnvoiMailMemoire();
      const entrepotsMemoire = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const busCommande = new BusCommandeMAC(
        entrepotsMemoire,
        busEvenement,
        adaptateurEnvoieMail,
        unConstructeurDeServices(entrepotsMemoire.aidants())
      );
      const capteur = new CapteurSagaDemandeAide(
        busCommande,
        busEvenement,
        adaptateurEnvoieMail
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: 'Gironde',
        raisonSociale: 'BetaGouv',
        relationAidant: true,
      });

      expect(
        adaptateurEnvoieMail.aEteEnvoyeA(
          'jean-dupont@email.com',
          'Bonjour entité Aidée, relation Aidant : true'
        )
      ).toBe(true);
    });

    it("Publie l'évènement 'AIDE_CREE'", async () => {
      const maintenant = new Date();
      FournisseurHorlogeDeTest.initialise(maintenant);
      const entrepotsMemoire = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const busCommande = new BusCommandeTest({
        CommandeRechercheAideParEmail: new CapteurCommandeRechercheAideParEmail(
          entrepotsMemoire
        ),
        CommandeCreerAide: new CapteurCommandeCreerAide(entrepotsMemoire),
      });
      const adaptateurEnvoieMail = new AdaptateurEnvoiMailMemoire();

      await new CapteurSagaDemandeAide(
        busCommande,
        busEvenement,
        adaptateurEnvoieMail
      ).execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: 'Gironde',
        relationAidant: false,
      });
      const aideRecu = (await entrepotsMemoire.aides().tous())[0];

      expect(busEvenement.evenementRecu).toStrictEqual<DemandeAideCree>({
        identifiant: expect.any(String),
        type: 'AIDE_CREE',
        date: maintenant,
        corps: {
          identifiantAide: aideRecu.identifiant,
          departement: '33',
        },
      });
    });

    describe('Lorsque la validation des CGU a échoué', () => {
      it("N'envoie pas d'Email de confirmation à l'Aidé", async () => {
        const adaptateurEnvoieMail = new AdaptateurEnvoiMailMemoire();
        const entrepotsMemoire = new EntrepotsMemoire();
        const busEvenement = new BusEvenementDeTest();
        const busCommande = new BusCommandeTest({
          CommandeRechercheAideParEmail:
            new CapteurCommandeRechercheAideParEmail(entrepotsMemoire),
          CommandeCreerAide: new CapteurCommandeCreerAideQuiEchoue(),
        });
        const capteur = new CapteurSagaDemandeAide(
          busCommande,
          busEvenement,
          adaptateurEnvoieMail
        );

        await expect(() =>
          capteur.execute({
            type: 'SagaDemandeValidationCGUAide',
            cguValidees: true,
            email: 'jean-dupont@email.com',
            departement: 'Gironde',
            relationAidant: false,
          })
        ).rejects.toThrowError("Votre demande d'aide n'a pu aboutir");
        expect(adaptateurEnvoieMail.mailEnvoye()).toBe(false);
        expect(busEvenement.evenementRecu).toBeUndefined();
      });
    });
  });
});

class CapteurCommandeCreerAideQuiEchoue
  implements CapteurCommande<CommandeCreerAide, any>
{
  execute(_commande: CommandeCreerAide): Promise<any> {
    throw new Error('une erreur est survenue');
  }
}
