import { describe, expect, it } from 'vitest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { DemandeDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { CapteurCommandeDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';

describe('Capteur de demande devenir aidant', () => {
  it('Créé la demande', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-08-01T14:45:17+01:00'))
    );

    const demandeDevenirAidant = await new CapteurCommandeDevenirAidant(
      new EntrepotsMemoire()
    ).execute({
      departement: 'departement',
      mail: 'email',
      nom: 'nom',
      prenom: 'prenom',
      type: 'CommandeDevenirAidant',
    });

    expect(demandeDevenirAidant).toStrictEqual<DemandeDevenirAidant>({
      departement: 'departement',
      mail: 'email',
      nom: 'nom',
      prenom: 'prenom',
      identifiant: expect.any(String),
      date: new Date(Date.parse('2024-08-01T14:45:17+01:00')),
    });
  });
});
