import { assert, describe, expect, it } from 'vitest';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import {
  CapteurCommandeAttribueDemandeAide,
  DemandeAideDejaPourvue,
  DemandeAidePourvue,
} from '../../../src/gestion-demandes/aide/CapteurCommandeAttribueDemandeAide';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';

describe("Capteur de commande d'attribution de demande d'aide", () => {
  it("Attribue la demande d'aide à l'aidant", async () => {
    const relations = new AdaptateurRelationsMAC(new EntrepotRelationMemoire());

    const capteur = new CapteurCommandeAttribueDemandeAide(
      new AdaptateurEnvoiMailMemoire(),
      relations,
      new BusEvenementDeTest()
    );

    await capteur.execute({
      type: 'CommandeAttribueDemandeAide',
      identifiantDemande: '22222222-2222-2222-2222-222222222222',
      emailDemande: 'demande@societe.fr',
      identifiantAidant: '11111111-1111-1111-1111-111111111111',
    });

    expect(
      await relations.relationExiste(
        'demandeAttribuee',
        { type: 'aidant', identifiant: '11111111-1111-1111-1111-111111111111' },
        {
          type: 'demandeAide',
          identifiant: '22222222-2222-2222-2222-222222222222',
        }
      )
    ).toBe(true);
  });

  it("Publie un événement de « DEMANDE_AIDE_POURVUE » avec un statut en Succès lorsque l'Aidant est le premier arrivé", async () => {
    const bus = new BusEvenementDeTest();
    const maintenant = new Date();
    FournisseurHorlogeDeTest.initialise(maintenant);

    const relations = new AdaptateurRelationsMAC(new EntrepotRelationMemoire());

    const capteur = new CapteurCommandeAttribueDemandeAide(
      new AdaptateurEnvoiMailMemoire(),
      relations,
      bus
    );

    await capteur.execute({
      type: 'CommandeAttribueDemandeAide',
      identifiantDemande: '22222222-2222-2222-2222-222222222222',
      emailDemande: 'demande@societe.fr',
      identifiantAidant: '11111111-1111-1111-1111-111111111111',
    });

    expect(bus.evenementRecu).toStrictEqual<DemandeAidePourvue>({
      identifiant: expect.any(String),
      type: 'DEMANDE_AIDE_POURVUE',
      date: maintenant,
      corps: {
        identifiantDemande: '22222222-2222-2222-2222-222222222222',
        identifiantAidant: '11111111-1111-1111-1111-111111111111',
        statut: 'SUCCESS',
      },
    });
  });

  it('Jette une erreur de DemandeDejaPourvue si un aidant a déjà répondu à la demande', async () => {
    const relations = new AdaptateurRelationsMAC(new EntrepotRelationMemoire());
    await relations.attribueDemandeAAidant(
      '22222222-2222-2222-2222-222222222222',
      'AAAAAAAA-1111-1111-1111-111111111111'
    );

    const capteur = new CapteurCommandeAttribueDemandeAide(
      new AdaptateurEnvoiMailMemoire(),
      relations,
      new BusEvenementDeTest()
    );

    const deuxiemeAidant = 'BBBBBBBB-1111-1111-1111-111111111111';
    await expect(
      capteur.execute({
        type: 'CommandeAttribueDemandeAide',
        identifiantDemande: '22222222-2222-2222-2222-222222222222',
        emailDemande: 'demande@societe.fr',
        identifiantAidant: deuxiemeAidant,
      })
    ).rejects.toThrow(new DemandeAideDejaPourvue());
  });

  it('Publie un événement de « DEMANDE_AIDE_POURVUE » avec un statut à « DEJA_POURVUE » lorsque la demande est déjà attribuée', async () => {
    const bus = new BusEvenementDeTest();
    const maintenant = new Date();
    FournisseurHorlogeDeTest.initialise(maintenant);
    const relations = new AdaptateurRelationsMAC(new EntrepotRelationMemoire());
    await relations.attribueDemandeAAidant(
      '22222222-2222-2222-2222-222222222222',
      'AAAAAAAA-1111-1111-1111-111111111111'
    );

    const deuxiemeAidant = 'BBBBBBBB-1111-1111-1111-111111111111';
    const capteur = new CapteurCommandeAttribueDemandeAide(
      new AdaptateurEnvoiMailMemoire(),
      relations,
      bus
    );
    try {
      await capteur.execute({
        type: 'CommandeAttribueDemandeAide',
        identifiantDemande: '22222222-2222-2222-2222-222222222222',
        emailDemande: 'demande@societe.fr',
        identifiantAidant: deuxiemeAidant,
      });
      assert.fail('Ce test doit échouer car la demande est déjà pourvue');
    } catch (_erreur) {
      expect(bus.evenementRecu).toStrictEqual<DemandeAidePourvue>({
        identifiant: expect.any(String),
        type: 'DEMANDE_AIDE_POURVUE',
        date: maintenant,
        corps: {
          identifiantDemande: '22222222-2222-2222-2222-222222222222',
          identifiantAidant: deuxiemeAidant,
          statut: 'DEJA_POURVUE',
        },
      });
    }
  });
});
