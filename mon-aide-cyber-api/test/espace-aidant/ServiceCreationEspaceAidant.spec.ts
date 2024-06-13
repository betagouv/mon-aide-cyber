import { describe, it } from 'vitest';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { ErreurCreationEspaceAidant } from '../../src/authentification/Aidant';
import { ServiceCreationEspaceAidant } from '../../src/espace-aidant/ServiceCreationEspaceAidant';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe("Service de création d'espace Aidant", () => {
  it('renvoie une erreur si les CGU ne sont pas signées', async () => {
    const entrepots = new EntrepotsMemoire();
    const aidant = unAidant().sansEspace().construis();
    entrepots.aidants().persiste(aidant);
    const service = new ServiceCreationEspaceAidant(entrepots);

    await expect(() =>
      service.cree({
        cguSignees: false,
        motDePasse: 'mdp',
        identifiant: aidant.identifiant,
      })
    ).rejects.toThrowError(
      ErreurMAC.cree(
        "Crée l'espace Aidant",
        new ErreurCreationEspaceAidant('Vous devez signer les CGU.')
      )
    );
  });

  it("ne modifie pas les dates de signature si l'espace Aidant a été créé", async () => {
    const dateDeSignature = new Date(Date.parse('2024-01-12T12:34:26+01:00'));
    FournisseurHorlogeDeTest.initialise(dateDeSignature);
    const entrepots = new EntrepotsMemoire();
    const aidant = unAidant().construis();
    entrepots.aidants().persiste(aidant);
    const service = new ServiceCreationEspaceAidant(entrepots);

    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-01-15T10:14:37+01:00'))
    );
    await service.cree({
      cguSignees: true,
      motDePasse: 'mdp',
      identifiant: aidant.identifiant,
    });

    const aidantRecupere = await entrepots.aidants().lis(aidant.identifiant);
    expect(aidantRecupere.dateSignatureCharte).toStrictEqual(dateDeSignature);
    expect(aidantRecupere.dateSignatureCGU).toStrictEqual(dateDeSignature);
  });
});
