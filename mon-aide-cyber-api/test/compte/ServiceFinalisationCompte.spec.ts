import { describe, it } from 'vitest';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { ErreurFinalisationCompte } from '../../src/authentification/Aidant';
import { ServiceFinalisationCreationCompte } from '../../src/compte/ServiceFinalisationCompte';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('Service de finalisation de création de compte', () => {
  it("renvoie une erreur si la charte de l'aidant n'est pas signée", async () => {
    const entrepots = new EntrepotsMemoire();
    const aidant = unAidant().avecCompteEnAttenteDeFinalisation().construis();
    entrepots.aidants().persiste(aidant);
    const service = new ServiceFinalisationCreationCompte(entrepots);

    await expect(() =>
      service.finalise({
        cguSignees: true,
        charteSignee: false,
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
        cguSignees: false,
        charteSignee: false,
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

  it('ne modifie pas les dates de signature si le compte a déjà été finalisé', async () => {
    const dateDeSignature = new Date(Date.parse('2024-01-12T12:34:26+01:00'));
    FournisseurHorlogeDeTest.initialise(dateDeSignature);
    const entrepots = new EntrepotsMemoire();
    const aidant = unAidant().construis();
    entrepots.aidants().persiste(aidant);
    const service = new ServiceFinalisationCreationCompte(entrepots);

    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-01-15T10:14:37+01:00')),
    );
    await service.finalise({
      cguSignees: true,
      charteSignee: true,
      identifiant: aidant.identifiant,
    });

    const aidantRecupere = await entrepots.aidants().lis(aidant.identifiant);
    expect(aidantRecupere.dateSignatureCharte).toStrictEqual(dateDeSignature);
    expect(aidantRecupere.dateSignatureCGU).toStrictEqual(dateDeSignature);
  });
});