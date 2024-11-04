import { describe, expect } from 'vitest';
import { unAidant } from '../../espace-aidant/constructeurs/constructeurAidant';
import { SecteurActivite } from '../../../src/espace-aidant/preferences/secteursActivite';
import { Departement } from '../../../src/gestion-demandes/departements';
import {
  EntitesOrganisationsPubliques,
  TypesEntites,
} from '../../../src/espace-aidant/Aidant';
import {
  PreferencesAidantModifiees,
  ServicePreferencesAidant,
} from '../../../src/espace-aidant/preferences/ServicePreferencesAidant';
import { EntrepotAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';

describe('Service de préférences des Aidants', () => {
  describe('Pour les secteurs d’activité de l’Aidant', () => {
    it('Les modifie', async () => {
      const entrepot = new EntrepotAidantMemoire();
      const aidant = unAidant()
        .ayantPourSecteursActivite([
          { nom: 'Administration' },
          { nom: 'Commerce' },
        ])
        .construis();
      await entrepot.persiste(aidant);

      await new ServicePreferencesAidant(
        entrepot,
        new BusEvenementDeTest()
      ).metsAJour({
        identifiantAidant: aidant.identifiant,
        preferences: {
          secteursActivite: ['Administration', 'Transports'],
        },
      });

      const aidantModifie = await entrepot.lis(aidant.identifiant);
      expect(aidantModifie.preferences.secteursActivite).toStrictEqual<
        SecteurActivite[]
      >([{ nom: 'Administration' }, { nom: 'Transports' }]);
    });

    it('Publie l’événement PREFERENCES_AIDANT_MODIFIEES', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const busEvenement = new BusEvenementDeTest();
      const entrepot = new EntrepotAidantMemoire();
      const aidant = unAidant().construis();
      await entrepot.persiste(aidant);

      await new ServicePreferencesAidant(entrepot, busEvenement).metsAJour({
        identifiantAidant: aidant.identifiant,
        preferences: {
          secteursActivite: ['Administration', 'Transports'],
        },
      });

      expect(
        busEvenement.evenementRecu
      ).toStrictEqual<PreferencesAidantModifiees>({
        identifiant: aidant.identifiant,
        type: 'PREFERENCES_AIDANT_MODIFIEES',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiant: aidant.identifiant,
          preferences: { secteursActivite: ['Administration', 'Transports'] },
        },
      });
      expect(
        busEvenement.consommateursTestes.get(
          'PREFERENCES_AIDANT_MODIFIEES'
        )?.[0].evenementConsomme
      ).toStrictEqual<PreferencesAidantModifiees>({
        identifiant: expect.any(String),
        type: 'PREFERENCES_AIDANT_MODIFIEES',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiant: expect.any(String),
          preferences: {
            secteursActivite: ['Administration', 'Transports'],
          },
        },
      });
    });
  });

  describe('Pour les départements dans lesquels l’Aidant peut intervenir', () => {
    it('Les modifie', async () => {
      const entrepot = new EntrepotAidantMemoire();
      const finistere: Departement = {
        nom: 'Finistère',
        code: '29',
        codeRegion: '53',
      };
      const gironde: Departement = {
        nom: 'Gironde',
        code: '33',
        codeRegion: '75',
      };
      const aidant = unAidant()
        .ayantPourDepartements([finistere, gironde])
        .construis();
      await entrepot.persiste(aidant);

      await new ServicePreferencesAidant(
        entrepot,
        new BusEvenementDeTest()
      ).metsAJour({
        identifiantAidant: aidant.identifiant,
        preferences: {
          departements: ['Finistère', 'Gironde', 'Pyrénées-Atlantiques'],
        },
      });

      const aidantModifie = await entrepot.lis(aidant.identifiant);
      expect(aidantModifie.preferences.departements).toStrictEqual<
        Departement[]
      >([
        finistere,
        gironde,
        {
          nom: 'Pyrénées-Atlantiques',
          code: '64',
          codeRegion: '75',
        },
      ]);
    });

    it('Publie l’événement PREFERENCES_AIDANT_MODIFIEES', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const busEvenement = new BusEvenementDeTest();
      const entrepot = new EntrepotAidantMemoire();
      const aidant = unAidant().construis();
      await entrepot.persiste(aidant);

      await new ServicePreferencesAidant(entrepot, busEvenement).metsAJour({
        identifiantAidant: aidant.identifiant,
        preferences: {
          departements: ['Finistère', 'Gironde', 'Pyrénées-Atlantiques'],
        },
      });

      expect(
        busEvenement.evenementRecu
      ).toStrictEqual<PreferencesAidantModifiees>({
        identifiant: aidant.identifiant,
        type: 'PREFERENCES_AIDANT_MODIFIEES',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiant: aidant.identifiant,
          preferences: { departements: ['29', '33', '64'] },
        },
      });
    });
  });

  describe('Pour les types d’entités dans lesquels l’Aidant peut intervenir', () => {
    it('Les modifie', async () => {
      const entrepot = new EntrepotAidantMemoire();
      const organisationsPubliques: EntitesOrganisationsPubliques = {
        nom: 'Organisations publiques',
        libelle:
          'Organisations publiques (ex. collectivité, administration, etc.)',
      };
      const aidant = unAidant()
        .ayantPourTypesEntite([organisationsPubliques])
        .construis();
      await entrepot.persiste(aidant);

      await new ServicePreferencesAidant(
        entrepot,
        new BusEvenementDeTest()
      ).metsAJour({
        identifiantAidant: aidant.identifiant,
        preferences: {
          typesEntites: ['Organisations publiques', 'Associations'],
        },
      });

      const aidantModifie = await entrepot.lis(aidant.identifiant);
      expect(
        aidantModifie.preferences.typesEntites
      ).toStrictEqual<TypesEntites>([
        organisationsPubliques,
        {
          nom: 'Associations',
          libelle: 'Associations (ex. association loi 1901, GIP)',
        },
      ]);
    });

    it('Publie l’événement PREFERENCES_AIDANT_MODIFIEES', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const busEvenement = new BusEvenementDeTest();
      const entrepot = new EntrepotAidantMemoire();
      const aidant = unAidant().construis();
      await entrepot.persiste(aidant);

      await new ServicePreferencesAidant(entrepot, busEvenement).metsAJour({
        identifiantAidant: aidant.identifiant,
        preferences: {
          typesEntites: ['Organisations publiques', 'Associations'],
        },
      });

      expect(
        busEvenement.evenementRecu
      ).toStrictEqual<PreferencesAidantModifiees>({
        identifiant: aidant.identifiant,
        type: 'PREFERENCES_AIDANT_MODIFIEES',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiant: aidant.identifiant,
          preferences: {
            typesEntites: [
              'Organisations publiques (ex. collectivité, administration, etc.)',
              'Associations (ex. association loi 1901, GIP)',
            ],
          },
        },
      });
    });
  });
});
