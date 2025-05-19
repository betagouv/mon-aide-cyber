import { describe, expect, it } from 'vitest';
import { AdaptateurRelationsMAC } from '../../../src/relation/AdaptateurRelationsMAC';
import { EntrepotRelationMemoire } from '../../../src/relation/infrastructure/EntrepotRelationMemoire';
import {
  CapteurCommandeAttribueDemandeAide,
  DemandeAideDejaPourvue,
} from '../../../src/gestion-demandes/aide/CapteurCommandeAttribueDemandeAide';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';

describe("Capteur de commande d'attribution de demande d'aide", () => {
  it("Attribue la demande d'aide à l'aidant", async () => {
    const relations = new AdaptateurRelationsMAC(new EntrepotRelationMemoire());

    const capteur = new CapteurCommandeAttribueDemandeAide(
      new AdaptateurEnvoiMailMemoire(),
      relations
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

  it('Jette une erreur de DemandeDejaPourvue si un aidant a déjà répondu à la demande', async () => {
    const relations = new AdaptateurRelationsMAC(new EntrepotRelationMemoire());
    await relations.attribueDemandeAAidant(
      '22222222-2222-2222-2222-222222222222',
      'AAAAAAAA-1111-1111-1111-111111111111'
    );

    const capteur = new CapteurCommandeAttribueDemandeAide(
      new AdaptateurEnvoiMailMemoire(),
      relations
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
});
