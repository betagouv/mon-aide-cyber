import { describe, it } from 'vitest';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { ErreurFinalisationCompte } from '../../src/authentification/Aidant';
import { ServiceFinalisationCreationCompte } from '../../src/compte/ServiceFinalisationCompte';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';

describe('Service de finalisation de création de compte', () => {
  it("renvoie une erreur si la charte de l'aidant n'est pas signée", async () => {
    const entrepots = new EntrepotsMemoire();
    const aidant = unAidant().avecCompteEnAttenteDeFinalisation().construis();
    entrepots.aidants().persiste(aidant);
    const service = new ServiceFinalisationCreationCompte(entrepots);

    await expect(() =>
      service.finalise({
        cguCochees: true,
        charteCochee: false,
        identifiant: aidant.identifiant,
      }),
    ).rejects.toThrowError(
      ErreurMAC.cree(
        'Finalise la création du compte',
        new ErreurFinalisationCompte(
          "Vous devez signer la charte de l'aidant.",
        ),
      ),
    );
  });

  it("renvoie une erreur si ni la charte de l'aidant ni les CGU ne sont validées", async () => {
    const entrepots = new EntrepotsMemoire();
    const aidant = unAidant().avecCompteEnAttenteDeFinalisation().construis();
    entrepots.aidants().persiste(aidant);
    const service = new ServiceFinalisationCreationCompte(entrepots);

    await expect(() =>
      service.finalise({
        cguCochees: false,
        charteCochee: false,
        identifiant: aidant.identifiant,
      }),
    ).rejects.toThrowError(
      ErreurMAC.cree(
        'Finalise la création du compte',
        new ErreurFinalisationCompte(
          "Vous devez valider les CGU et signer la charte de l'aidant.",
        ),
      ),
    );
  });
});
