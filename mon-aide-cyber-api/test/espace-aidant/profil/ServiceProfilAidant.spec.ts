import { describe, expect, it } from 'vitest';
import {
  ProfilAidantModifie,
  ServiceProfilAidant,
} from '../../../src/espace-aidant/profil/ServiceProfilAidant';
import { EntrepotAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import crypto from 'crypto';
import { TypeAffichageAnnuaire } from '../../../src/espace-aidant/Aidant';

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

  it.each<{
    prenomNom: string;
    typeAffichage: TypeAffichageAnnuaire;
    formatAttendu: string;
  }>([
    {
      prenomNom: 'Jean Dupont',
      typeAffichage: TypeAffichageAnnuaire.PRENOM_N,
      formatAttendu: 'Jean D.',
    },
    {
      prenomNom: 'Jean Dupont',
      typeAffichage: TypeAffichageAnnuaire.PRENOM_NOM,
      formatAttendu: 'Jean Dupont',
    },
    {
      prenomNom: 'Jean Dupont',
      typeAffichage: TypeAffichageAnnuaire.P_NOM,
      formatAttendu: 'J. Dupont',
    },
  ])(
    'Enregistre le nom d‘affichage pour l‘annuaire de l‘Aidant $formatAttendu',
    async ({ prenomNom, typeAffichage, formatAttendu }) => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const busEvenement = new BusEvenementDeTest();
      const entrepotAidant = new EntrepotAidantMemoire();
      const uuid = crypto.randomUUID();
      const aidant = unAidant()
        .avecUnIdentifiant(uuid)
        .avecUnNomPrenom(prenomNom)
        .construis();
      await entrepotAidant.persiste(aidant);

      await new ServiceProfilAidant(entrepotAidant, busEvenement).modifie(
        aidant.identifiant,
        {
          consentementAnnuaire: true,
          typeAffichageChoisi: typeAffichage,
        }
      );

      const aidantPersite = await entrepotAidant.lis(uuid);
      expect(aidantPersite.preferences.nomAffichageAnnuaire).toStrictEqual(
        formatAttendu
      );
    }
  );
});
