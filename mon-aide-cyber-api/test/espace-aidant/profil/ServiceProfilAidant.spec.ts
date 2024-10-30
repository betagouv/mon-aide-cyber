import { describe, expect } from 'vitest';
import {
  ProfilAidantModifie,
  ServiceProfilAidant,
} from '../../../src/espace-aidant/profil/ServiceProfilAidant';
import { EntrepotAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unAidant } from '../../authentification/constructeurs/constructeurAidant';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('Service Aidant', () => {
  it('Publie l’événement PROFIL_AIDANT_MODIFIE', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const busEvenement = new BusEvenementDeTest();
    const entrepotAidant = new EntrepotAidantMemoire();
    const aidant = unAidant().construis();
    await entrepotAidant.persiste(aidant);

    await new ServiceProfilAidant(entrepotAidant, busEvenement).modifie(
      aidant.identifiant,
      {
        consentementAnnuaire: true,
      }
    );

    expect(busEvenement.evenementRecu).toStrictEqual<ProfilAidantModifie>({
      identifiant: expect.any(String),
      type: 'PROFIL_AIDANT_MODIFIE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiant: aidant.identifiant,
        profil: {
          consentementAnnuaire: true,
        },
      },
    });
    expect(
      busEvenement.consommateursTestes.get('PROFIL_AIDANT_MODIFIE')?.[0]
        .evenementConsomme
    ).toStrictEqual<ProfilAidantModifie>({
      type: 'PROFIL_AIDANT_MODIFIE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiant: aidant.identifiant,
        profil: { consentementAnnuaire: true },
      },
      identifiant: aidant.identifiant,
    });
  });
});
