import { describe, expect } from 'vitest';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import {
  CompteAidantCree,
  CapteurCommandeCreeCompteAidant,
} from '../../src/authentification/CapteurCommandeCreeCompteAidant';
import { AidantCree } from '../../src/administration/aidant/creeAidant';
import { Aidant } from '../../src/authentification/Aidant';

describe('Capteur de commande de création de compte Aidant', () => {
  it('Crée un compte Aidant', async () => {
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));

    const aidantCree = await new CapteurCommandeCreeCompteAidant(
      entrepots,
      new BusEvenementDeTest(),
      () => 'mdp'
    ).execute({
      dateSignatureCGU,
      identifiantConnexion: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      type: 'CommandeCreeCompteAidant',
    });

    const aidants = await entrepots.aidants().tous();
    expect(aidants).toHaveLength(1);
    expect(aidants[0]).toStrictEqual<Aidant>({
      identifiant: expect.any(String),
      identifiantConnexion: 'jean.dupont@beta.fr',
      dateSignatureCGU,
      nomPrenom: 'Jean Dupont',
      motDePasse: 'mdp',
    });
    expect(aidantCree).toStrictEqual<CompteAidantCree>({
      identifiant: expect.any(String),
      email: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
    });
  });

  it('Publie l’événement "AIDANT_CREE"', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const entrepots = new EntrepotsMemoire();
    const dateSignatureCGU = new Date(Date.parse('2024-08-30T14:38:25'));
    const busEvenement = new BusEvenementDeTest();

    const aidantCree = await new CapteurCommandeCreeCompteAidant(
      entrepots,
      busEvenement
    ).execute({
      dateSignatureCGU,
      identifiantConnexion: 'jean.dupont@beta.fr',
      nomPrenom: 'Jean Dupont',
      type: 'CommandeCreeCompteAidant',
    });

    expect(busEvenement.evenementRecu).toStrictEqual<AidantCree>({
      identifiant: aidantCree.identifiant,
      type: 'AIDANT_CREE',
      date: FournisseurHorloge.maintenant(),
      corps: { identifiant: aidantCree.identifiant },
    });
  });
});
