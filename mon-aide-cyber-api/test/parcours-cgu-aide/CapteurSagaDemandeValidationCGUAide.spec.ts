import { describe, it } from 'vitest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { CapteurSagaDemandeValidationCGUAide } from '../../src/parcours-cgu-aide/CapteurSagaDemandeValidationCGUAide';
import { BusCommandeMAC } from '../../src/infrastructure/bus/BusCommandeMAC';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { unAide } from '../aide/ConstructeurAide';
import { BusCommandeTests } from '../infrastructure/bus/BusCommandeTests';

describe('Capteur saga demande de validation de CGU aidés', () => {
  it("interrompt le parcours si l'aidé est connu de MAC", async () => {
    const aide = unAide().construis();
    const entrepots = new EntrepotsMemoire();
    const busEvenement = new BusEvenementDeTest();
    const capteur = new CapteurSagaDemandeValidationCGUAide(
      entrepots,
      new BusCommandeMAC(entrepots, busEvenement),
      busEvenement
    );
    entrepots.aides().persiste(aide);

    capteur.execute({
      type: 'SagaDemandeValidationCGUAide',
      cguValidees: true,
      email: aide.email,
      departement: aide.departement,
      raisonSociale: aide.raisonSociale!,
    });

    expect(await entrepots.aides().tous()).toHaveLength(1);
    expect(await entrepots.aides().lis(aide.identifiant)).toStrictEqual(aide);
  });

  it("publie la commande de recherche de l'aidé par email", async () => {
    const busCommande = new BusCommandeTests();
    const capteur = new CapteurSagaDemandeValidationCGUAide(
      new EntrepotsMemoire(),
      busCommande,
      new BusEvenementDeTest()
    );

    await capteur.execute({
      type: 'SagaDemandeValidationCGUAide',
      cguValidees: true,
      email: 'un email',
      departement: 'un departement',
    });

    expect(busCommande.aRecu('CommandeRechercheAideParEmail')).toBe(true);
  });
});
