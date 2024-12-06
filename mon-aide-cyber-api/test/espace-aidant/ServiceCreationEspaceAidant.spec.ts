import { describe, it } from 'vitest';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { ErreurCreationEspaceAidant } from '../../src/espace-aidant/Aidant';
import { ServiceCreationEspaceAidant } from '../../src/espace-aidant/ServiceCreationEspaceAidant';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  unAidant,
  unCompteAidantRelieAUnCompteUtilisateur,
  unUtilisateur,
} from '../constructeurs/constructeursAidantUtilisateur';

describe("Service de création d'espace Aidant", () => {
  it('renvoie une erreur si les CGU ne sont pas signées', async () => {
    const entrepots = new EntrepotsMemoire();
    const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
      entrepotUtilisateur: entrepots.utilisateurs(),
      entrepotAidant: entrepots.aidants(),
      constructeurUtilisateur: unUtilisateur().sansCGUSignees(),
      constructeurAidant: unAidant(),
    });

    const service = new ServiceCreationEspaceAidant(entrepots);

    await expect(() =>
      service.cree({
        cguSignees: false,
        motDePasse: 'mdp',
        identifiant: utilisateur.identifiant,
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
    const { utilisateur } = await unCompteAidantRelieAUnCompteUtilisateur({
      entrepotUtilisateur: entrepots.utilisateurs(),
      entrepotAidant: entrepots.aidants(),
      constructeurUtilisateur: unUtilisateur(),
      constructeurAidant: unAidant(),
    });

    const service = new ServiceCreationEspaceAidant(entrepots);

    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-01-15T10:14:37+01:00'))
    );
    await service.cree({
      cguSignees: true,
      motDePasse: 'mdp',
      identifiant: utilisateur.identifiant,
    });

    const aidantRecupere = await entrepots
      .utilisateurs()
      .lis(utilisateur.identifiant);
    expect(aidantRecupere.dateSignatureCGU).toStrictEqual(dateDeSignature);
  });
});
