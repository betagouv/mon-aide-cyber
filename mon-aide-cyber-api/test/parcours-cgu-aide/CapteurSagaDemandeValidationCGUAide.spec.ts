import { describe, expect, it } from 'vitest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { CapteurSagaDemandeValidationCGUAide } from '../../src/parcours-cgu-aide/CapteurSagaDemandeValidationCGUAide';
import { BusCommandeMAC } from '../../src/infrastructure/bus/BusCommandeMAC';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { unAide } from '../aide/ConstructeurAide';

describe('Capteur saga demande de validation de CGU Aidé', () => {
  describe("si l'Aidé est connu de MAC", () => {
    it('interrompt le parcours', async () => {
      const aide = unAide().construis();
      const entrepots = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();
      const capteur = new CapteurSagaDemandeValidationCGUAide(
        entrepots,
        new BusCommandeMAC(entrepots, busEvenement),
        busEvenement,
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
      const busCommande = new BusCommandeMAC(entrepotsMemoire, busEvenement);
      const capteur = new CapteurSagaDemandeValidationCGUAide(
        entrepotsMemoire,
        busCommande,
        busEvenement,
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
  });
});
