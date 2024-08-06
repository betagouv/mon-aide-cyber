import { describe, expect, it } from 'vitest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { DemandeDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { CapteurCommandeDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import { departements } from '../../../src/gestion-demandes/departements';

describe('Capteur de commande devenir aidant', () => {
  it('Créé la demande', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-08-01T14:45:17+01:00'))
    );

    const demandeDevenirAidant = await new CapteurCommandeDevenirAidant(
      new EntrepotsMemoire()
    ).execute({
      departement: departements[1],
      mail: 'email',
      nom: 'nom',
      prenom: 'prenom',
      type: 'CommandeDevenirAidant',
    });

    expect(demandeDevenirAidant).toStrictEqual<DemandeDevenirAidant>({
      departement: { nom: 'Aisne', code: '2', codeRegion: '32' },
      mail: 'email',
      nom: 'nom',
      prenom: 'prenom',
      identifiant: expect.any(String),
      date: new Date(Date.parse('2024-08-01T14:45:17+01:00')),
    });
  });

  it('Créé la demande avec un mail unique', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-08-01T14:45:17+01:00'))
    );
    const entrepots = new EntrepotsMemoire();
    await entrepots
      .demandesDevenirAidant()
      .persiste(
        unConstructeurDeDemandeDevenirAidant().avecUnMail('email').construis()
      );

    await expect(() =>
      new CapteurCommandeDevenirAidant(entrepots).execute({
        departement: departements[0],
        mail: 'email',
        nom: 'nom',
        prenom: 'prenom',
        type: 'CommandeDevenirAidant',
      })
    ).rejects.toThrowError('Une demande pour ce compte existe déjà');
  });
});
