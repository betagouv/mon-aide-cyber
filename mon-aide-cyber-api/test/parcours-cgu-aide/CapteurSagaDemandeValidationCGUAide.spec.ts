import { describe, it } from 'vitest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { CapteurSagaDemandeValidationCGUAide } from '../../src/parcours-cgu-aide/CapteurSagaDemandeValidationCGUAide';
import { BusCommandeMAC } from '../../src/infrastructure/bus/BusCommandeMAC';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { unAide } from '../aide/ConstructeurAide';

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
});
