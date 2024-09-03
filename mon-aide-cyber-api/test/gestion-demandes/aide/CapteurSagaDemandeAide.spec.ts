import { describe, expect, it } from 'vitest';
import { unAide } from '../../aide/ConstructeurAide';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { CapteurSagaDemandeAide } from '../../../src/gestion-demandes/aide/CapteurSagaDemandeAide';
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
import { unServiceAidant } from '../../../src/authentification/ServiceAidantMAC';

describe('Capteur saga demande de validation de CGU Aidé', () => {
  describe("si l'Aidé est connu de MAC", () => {
    it('interrompt le parcours', async () => {
      const aide = unAide().construis();
      const entrepots = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const capteur = new CapteurSagaDemandeAide(
        new BusCommandeMAC(entrepots, busEvenement, adaptateurEnvoiMail, {
          aidant: unServiceAidant(entrepots.aidants()),
        }),
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

  describe("si l'Aidé n'est pas connu de MAC", () => {
    it("crée l'Aidé", async () => {
      const entrepotsMemoire = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const busCommande = new BusCommandeMAC(
        entrepotsMemoire,
        busEvenement,
        adaptateurEnvoiMail,
        { aidant: unServiceAidant(entrepotsMemoire.aidants()) }
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
        departement: 'un departement',
        relationAidant: false,
      });

      expect(
        await entrepotsMemoire.aides().rechercheParEmail('un email')
      ).not.toBeUndefined();
    });

    it('envoie un email de confirmation à l’Aidé', async () => {
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
        { aidant: unServiceAidant(entrepotsMemoire.aidants()) }
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
          'Bonjour,\n' +
            '\n' +
            'Votre demande pour bénéficier de MonAideCyber a été prise en compte.\n' +
            'Un Aidant de proximité vous contactera sur l’adresse email que vous nous avez communiquée dans les meilleurs délais.\n' +
            '\n' +
            'Voici les informations que vous avez renseignées :\n' +
            `- Signature des CGU le 19.03.2024 à 14:45\n` +
            `- Département : Gironde\n` +
            '- Raison sociale : BetaGouv\n' +
            '\n' +
            'Toute l’équipe reste à votre disposition,\n\n' +
            "L'équipe MonAideCyber\n" +
            'monaidecyber@ssi.gouv.fr\n'
        )
      ).toBe(true);
    });

    it('envoie un email de demande d’aide à MAC', async () => {
      adaptateurEnvironnement.messagerie = () => ({
        emailMAC: () => 'mac@email.com',
        expediteurMAC: () => 'expéditeur',
        clefAPI: () => 'clef',
      });
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
        { aidant: unServiceAidant(entrepotsMemoire.aidants()) }
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
          'Bonjour,\n' +
            '\n' +
            'Une demande d’aide a été faite par jean-dupont@email.com\n' +
            '\n' +
            'Ci-dessous, les informations concernant cette demande :\n' +
            '- Date de la demande : 19.03.2024 à 14:45\n' +
            '- Département: Gironde\n' +
            '- Raison sociale: BetaGouv\n'
        )
      ).toBe(true);
    });

    it('envoie un email de demande d’aide à MAC en prenant en compte la relation existante avec un Aidant', async () => {
      adaptateurEnvironnement.messagerie = () => ({
        emailMAC: () => 'mac@email.com',
        expediteurMAC: () => 'expéditeur',
        clefAPI: () => 'clef',
      });
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
        { aidant: unServiceAidant(entrepotsMemoire.aidants()) }
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
          'Bonjour,\n' +
            '\n' +
            'Une demande d’aide a été faite par jean-dupont@email.com\n' +
            '\n' +
            'Ci-dessous, les informations concernant cette demande :\n' +
            '- Est déjà en relation avec un Aidant\n' +
            '- Date de la demande : 19.03.2024 à 14:45\n' +
            '- Département: Gironde\n' +
            '- Raison sociale: BetaGouv\n'
        )
      ).toBe(true);
    });

    it("Envoie un email de confirmation l'Aidé en prenant en compte la relation existante avec un Aidant", async () => {
      adaptateurEnvironnement.messagerie = () => ({
        emailMAC: () => 'mac@email.com',
        expediteurMAC: () => 'expéditeur',
        clefAPI: () => 'clef',
      });
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
        { aidant: unServiceAidant(entrepotsMemoire.aidants()) }
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
          'Bonjour,\n' +
            '\n' +
            'Votre demande a bien été prise en compte.\n' +
            '\n' +
            'Votre Aidant va vous accompagner dans la suite de votre démarche MonAideCyber.\n' +
            'Voici les informations que vous avez renseignées :\n' +
            `- Signature des CGU le 19.03.2024 à 14:45\n` +
            `- Département : Gironde\n` +
            '- Raison sociale : BetaGouv\n' +
            '\n' +
            'Toute l’équipe reste à votre disposition,\n\n' +
            "L'équipe MonAideCyber\n" +
            'monaidecyber@ssi.gouv.fr\n'
        )
      ).toBe(true);
    });

    it("envoie un email de confirmation à l’Aidé qui n'a pas saisi de raison sociale", async () => {
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
        { aidant: unServiceAidant(entrepotsMemoire.aidants()) }
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
        relationAidant: false,
      });

      expect(
        adaptateurEnvoieMail.aEteEnvoyeA(
          'jean-dupont@email.com',
          'Bonjour,\n' +
            '\n' +
            'Votre demande pour bénéficier de MonAideCyber a été prise en compte.\n' +
            'Un Aidant de proximité vous contactera sur l’adresse email que vous nous avez communiquée dans les meilleurs délais.\n' +
            '\n' +
            'Voici les informations que vous avez renseignées :\n' +
            `- Signature des CGU le 19.03.2024 à 14:45\n` +
            `- Département : Gironde\n` +
            '\n' +
            'Toute l’équipe reste à votre disposition,\n\n' +
            "L'équipe MonAideCyber\n" +
            'monaidecyber@ssi.gouv.fr\n'
        )
      ).toBe(true);
    });

    it("publie l'évènement 'AIDE_CREE'", async () => {
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

      expect(busEvenement.evenementRecu).toStrictEqual({
        identifiant: expect.any(String),
        type: 'AIDE_CREE',
        date: maintenant,
        corps: {
          identifiantAide: aideRecu.identifiant,
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
