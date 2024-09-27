import { describe, expect } from 'vitest';
import { unAidant } from '../../authentification/constructeurs/constructeurAidant';
import { SecteurActivite } from '../../../src/espace-aidant/preferences/secteursActivite';
import { Departement } from '../../../src/gestion-demandes/departements';
import {
  EntitesOrganisationsPubliques,
  TypesEntites,
} from '../../../src/authentification/Aidant';
import { ServicePreferencesAidant } from '../../../src/espace-aidant/preferences/ServicePreferencesAidant';
import { EntrepotAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';

describe('Service de préférences des Aidants', () => {
  it('Modifie les secteurs d’activité de l’Aidant', async () => {
    const entrepot = new EntrepotAidantMemoire();
    const aidant = unAidant()
      .ayantPourSecteursActivite([
        { nom: 'Administration' },
        { nom: 'Commerce' },
      ])
      .construis();
    await entrepot.persiste(aidant);

    await new ServicePreferencesAidant(entrepot).metsAJour({
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

  it('Modifie les départements dans lesquels l’Aidant peut intervenir', async () => {
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

    await new ServicePreferencesAidant(entrepot).metsAJour({
      identifiantAidant: aidant.identifiant,
      preferences: {
        departements: ['Finistère', 'Gironde', 'Pyrénées-Atlantiques'],
      },
    });

    const aidantModifie = await entrepot.lis(aidant.identifiant);
    expect(aidantModifie.preferences.departements).toStrictEqual<Departement[]>(
      [
        finistere,
        gironde,
        {
          nom: 'Pyrénées-Atlantiques',
          code: '64',
          codeRegion: '75',
        },
      ]
    );
  });

  it('Modifie les types d’entités dans lesquels l’Aidant peut intervenir', async () => {
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

    await new ServicePreferencesAidant(entrepot).metsAJour({
      identifiantAidant: aidant.identifiant,
      preferences: {
        typesEntites: ['Organisations publiques', 'Associations'],
      },
    });

    const aidantModifie = await entrepot.lis(aidant.identifiant);
    expect(aidantModifie.preferences.typesEntites).toStrictEqual<TypesEntites>([
      organisationsPubliques,
      {
        nom: 'Associations',
        libelle: 'Associations (ex. association loi 1901, GIP)',
      },
    ]);
  });
});
