import { describe, expect, it } from 'vitest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { CapteurSagaDemandeValidationCGUAide } from '../../src/parcours-cgu-aide/CapteurSagaDemandeValidationCGUAide';
import { BusCommandeMAC } from '../../src/infrastructure/bus/BusCommandeMAC';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { unAide } from '../aide/ConstructeurAide';
import { AdaptateurEnvoiMailMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('Capteur saga demande de validation de CGU Aidé', () => {
  describe("si l'Aidé est connu de MAC", () => {
    it('interrompt le parcours', async () => {
      const aide = unAide().construis();
      const entrepots = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const capteur = new CapteurSagaDemandeValidationCGUAide(
        entrepots,
        new BusCommandeMAC(entrepots, busEvenement, adaptateurEnvoiMail),
        busEvenement,
        adaptateurEnvoiMail,
      );
      await entrepots.aides().persiste(aide);

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: aide.email,
        departement: aide.departement,
        raisonSociale: aide.raisonSociale!,
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
      );
      const capteur = new CapteurSagaDemandeValidationCGUAide(
        entrepotsMemoire,
        busCommande,
        busEvenement,
        adaptateurEnvoiMail,
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'un email',
        departement: 'un departement',
      });

      expect(
        await entrepotsMemoire.aides().rechercheParEmail('un email'),
      ).not.toBeUndefined();
    });

    it('envoie un email récapitulatif à l’Aidé', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00')),
      );
      const adaptateurEnvoieMail = new AdaptateurEnvoiMailMemoire();
      const entrepotsMemoire = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const busCommande = new BusCommandeMAC(
        entrepotsMemoire,
        busEvenement,
        adaptateurEnvoieMail,
      );
      const capteur = new CapteurSagaDemandeValidationCGUAide(
        entrepotsMemoire,
        busCommande,
        busEvenement,
        adaptateurEnvoieMail,
      );

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: 'Gironde',
        raisonSociale: 'BetaGouv',
      });

      expect(
        adaptateurEnvoieMail.aEteEnvoyeA(
          'jean-dupont@email.com',
          'Bonjour,\n' +
            '\n' +
            'Votre demande a bien été validée !\n' +
            '\n' +
            'Votre demande pour bénéficier d’un accompagnement MonAideCyber a été validée par nos équipes. Vous allez être mis en relation avec un Aidant de proximité, qui vous contactera directement sur l’adresse email que vous nous avez communiquée.\n' +
            '\n' +
            'Ci-dessous vous retrouverez les informations que vous avez saisies lors de votre demande :\n' +
            '- Signature des CGU : 19.03.2024 à 14:45\n' +
            '- Département: Gironde\n' +
            '- Raison sociale: BetaGouv\n' +
            '\n' +
            'Toute l’équipe MonAideCyber reste à votre disposition : monaidecyber@ssi.gouv.fr\n',
        ),
      ).toBe(true);
    });
  });
});
