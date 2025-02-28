import { beforeEach, describe, expect, it } from 'vitest';
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
import { CapteurCommande } from '../../../src/domaine/commande';
import { unConstructeurDeServices } from '../../constructeurs/constructeurServices';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { adaptateursCorpsMessage } from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { unAdaptateurDeCorpsDeMessage } from './ConstructeurAdaptateurDeCorpsDeMessage';
import {
  allier,
  Departement,
  gironde,
} from '../../../src/gestion-demandes/departements';
import { DemandeAide } from '../../../src/gestion-demandes/aide/DemandeAide';
import { CapteurCommandeRechercheDemandeAideParEmail } from '../../../src/gestion-demandes/aide/CapteurCommandeRechercheDemandeAideParEmail';
import {
  CapteurCommandeCreerDemandeAide,
  CommandeCreerDemandeAide,
} from '../../../src/gestion-demandes/aide/CapteurCommandeCreerDemandeAide';
import { uneDemandeAide } from './ConstructeurDemandeAide';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { EntrepotAideMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

describe('Capteur saga demande de validation de CGU Aidé', () => {
  const cotParDefaut = {
    rechercheEmailParDepartement: (__departement: Departement) =>
      'cot@email.com',
  };

  beforeEach(() => {
    adaptateursCorpsMessage.demande =
      unAdaptateurDeCorpsDeMessage().construis().demande;
    adaptateurEnvironnement.messagerie = () =>
      adaptateursEnvironnementDeTest.messagerie('mac@email.com');
  });
  describe("Si l'Aidé est connu de MAC", () => {
    it('Mets à jour la demande d’aide', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const aide = uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          new Date(Date.parse('2025-01-31T14:42:00'))
        )
        .construis();
      const entrepots = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      await entrepots.demandesAides().persiste(aide);
      const capteur = new CapteurSagaDemandeAide(
        new BusCommandeMAC(
          entrepots,
          busEvenement,
          adaptateurEnvoiMail,
          unConstructeurDeServices(entrepots.aidants())
        ),
        busEvenement,
        adaptateurEnvoiMail,
        () => cotParDefaut
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: aide.email,
        departement: aide.departement,
        raisonSociale: 'beta-gouv',
        relationAidant: true,
      });

      const entrepotDemandeAide =
        entrepots.demandesAides() as EntrepotAideMemoire;
      expect(await entrepotDemandeAide.tous()).toHaveLength(1);
      expect(
        await entrepotDemandeAide.lis(aide.identifiant)
      ).toStrictEqual<DemandeAide>({
        email: aide.email,
        departement: aide.departement,
        identifiant: aide.identifiant,
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        raisonSociale: 'beta-gouv',
      });
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
        adaptateurEnvoiMail,
        () => cotParDefaut
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'un email',
        departement: allier,
        relationAidant: false,
      });

      expect(
        await entrepotsMemoire.demandesAides().rechercheParEmail('un email')
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
        adaptateurEnvoieMail,
        () => cotParDefaut
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
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

    it('Envoie un email de demande d’aide en copie à MAC', async () => {
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
        adaptateurEnvoieMail,
        () => cotParDefaut
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
        relationAidant: false,
      });

      expect(
        adaptateurEnvoieMail.aEteEnvoyeEnCopieA(
          'mac@email.com',
          'Bonjour une entité a fait une demande d’aide'
        )
      ).toBe(true);
    });

    it('Envoie un email de demande d’aide au COT de la région', async () => {
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
        adaptateurEnvoieMail,
        () => ({
          rechercheEmailParDepartement: (__departement) =>
            'gironde@ssi.gouv.fr',
        })
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
        relationAidant: false,
      });

      expect(
        adaptateurEnvoieMail.aEteEnvoyeA(
          'gironde@ssi.gouv.fr',
          'Bonjour une entité a fait une demande d’aide'
        )
      ).toBe(true);
    });

    it('Envoie un email de demande d’aide au COT en prenant en compte la relation existante avec un Aidant', async () => {
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .recapitulatifDemandeAide(
          (_aide: DemandeAide, relationAidant: boolean) =>
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
        adaptateurEnvoieMail,
        () => cotParDefaut
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
        relationAidant: true,
      });

      expect(
        adaptateurEnvoieMail.aEteEnvoyeA(
          'cot@email.com',
          'Bonjour une entité a fait une demande d’aide, relation Aidant : true'
        )
      ).toBe(true);
      expect(
        adaptateurEnvoieMail.aEteEnvoyeEnCopieA(
          'mac@email.com',
          'Bonjour une entité a fait une demande d’aide, relation Aidant : true'
        )
      ).toBe(true);
    });

    it("Envoie un email de confirmation à l'Aidé en prenant en compte la relation existante avec un Aidant", async () => {
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .confirmationDemandeAide(
          (_aide: DemandeAide, relationAidant: boolean) =>
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
        adaptateurEnvoieMail,
        () => cotParDefaut
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
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
        CommandeRechercheAideParEmail:
          new CapteurCommandeRechercheDemandeAideParEmail(entrepotsMemoire),
        CommandeCreerDemandeAide: new CapteurCommandeCreerDemandeAide(
          entrepotsMemoire
        ),
      });
      const adaptateurEnvoieMail = new AdaptateurEnvoiMailMemoire();

      await new CapteurSagaDemandeAide(
        busCommande,
        busEvenement,
        adaptateurEnvoieMail,
        () => cotParDefaut
      ).execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
        relationAidant: false,
      });
      const aideRecu = (
        await (entrepotsMemoire.demandesAides() as EntrepotAideMemoire).tous()
      )[0];

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
            new CapteurCommandeRechercheDemandeAideParEmail(entrepotsMemoire),
          CommandeCreerAide: new CapteurCommandeCreerAideQuiEchoue(),
        });
        const capteur = new CapteurSagaDemandeAide(
          busCommande,
          busEvenement,
          adaptateurEnvoieMail,
          () => cotParDefaut
        );

        await expect(() =>
          capteur.execute({
            type: 'SagaDemandeValidationCGUAide',
            cguValidees: true,
            email: 'jean-dupont@email.com',
            departement: gironde,
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
  implements CapteurCommande<CommandeCreerDemandeAide, any>
{
  execute(_commande: CommandeCreerDemandeAide): Promise<any> {
    throw new Error('une erreur est survenue');
  }
}
