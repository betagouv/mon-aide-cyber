import { describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonneesAidants } from '../../../utilitaires/nettoyeurBDD';
import { EntrepotAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';
import {
  Aidant,
  EntitesAssociations,
  EntitesOrganisationsPubliques,
  TypesEntites,
} from '../../../../src/authentification/Aidant';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../horloge/FournisseurHorlogeDeTest';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';
import { Departement } from '../../../../src/gestion-demandes/departements';
import { ServiceDeChiffrementClair } from '../../securite/ServiceDeChiffrementClair';
import { SecteurActivite } from '../../../../src/espace-aidant/preferences/secteursActivite';

describe('Entrepot Aidant', () => {
  afterEach(async () => {
    await nettoieLaBaseDeDonneesAidants();
  });

  it('Persiste un aidant', async () => {
    const aidant = unAidant().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [aidant.identifiantConnexion, 'aaa'],
        [aidant.motDePasse, 'bbb'],
        [aidant.nomPrenom, 'ccc'],
      ])
    );

    await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

    const aidantRecu = await new EntrepotAidantPostgres(
      serviceDeChiffrement
    ).lis(aidant.identifiant);
    expect(aidantRecu).toStrictEqual<Aidant>(aidant);
  });

  it('Persiste les types d’entités de l’Aidant', async () => {
    const organisationsPubliques: EntitesOrganisationsPubliques = {
      nom: 'Organisations publiques',
      libelle:
        'Organisations publiques (ex. collectivité, administration, etc.)',
    };
    const associations: EntitesAssociations = {
      nom: 'Associations',
      libelle: 'Associations (ex. association loi 1901, GIP)',
    };
    const aidant = unAidant()
      .ayantPourTypesEntite([organisationsPubliques, associations])
      .construis();
    const serviceDeChiffrement = new ServiceDeChiffrementClair();

    await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

    const aidantRecu = await new EntrepotAidantPostgres(
      serviceDeChiffrement
    ).lis(aidant.identifiant);
    expect(aidantRecu.preferences.typesEntites).toStrictEqual<TypesEntites>([
      organisationsPubliques,
      associations,
    ]);
  });

  it('Persiste les départements où l’Aidant souhaite intervenir', async () => {
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
    const gard: Departement = {
      nom: 'Gard',
      code: '30',
      codeRegion: '76',
    };
    const aidant = unAidant()
      .ayantPourDepartements([finistere, gironde, gard])
      .construis();
    const serviceDeChiffrement = new ServiceDeChiffrementClair();

    await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

    const aidantRecu = await new EntrepotAidantPostgres(
      serviceDeChiffrement
    ).lis(aidant.identifiant);
    expect(aidantRecu.preferences.departements).toStrictEqual<Departement[]>([
      finistere,
      gard,
      gironde,
    ]);
  });

  it('Persiste les secteurs d’activité pour lesquels l’Aidant peut intervenir', async () => {
    const administration: SecteurActivite = {
      nom: 'Administration',
    };
    const industrie: SecteurActivite = {
      nom: 'Industrie',
    };
    const aidant = unAidant()
      .ayantPourSecteursActivite([administration, industrie])
      .construis();
    const serviceDeChiffrement = new ServiceDeChiffrementClair();

    await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

    const aidantRecu = await new EntrepotAidantPostgres(
      serviceDeChiffrement
    ).lis(aidant.identifiant);
    expect(aidantRecu.preferences.secteursActivite).toStrictEqual<
      SecteurActivite[]
    >([administration, industrie]);
  });

  describe('Mets à jour un aidant', () => {
    it('Mets à jour les dates de signature des CGU et de la charte', async () => {
      const dateSignature = new Date(Date.parse('2024-02-04T13:25:17+01:00'));
      FournisseurHorlogeDeTest.initialise(dateSignature);
      const aidant = unAidant().sansEspace().construis();
      const serviceDeChiffrement = new ServiceDeChiffrementClair();
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
      aidant.dateSignatureCharte = FournisseurHorloge.maintenant();
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.dateSignatureCharte).toStrictEqual(dateSignature);
      expect(aidantRecu.dateSignatureCGU).toStrictEqual(dateSignature);
    });
  });

  describe('Recherche par identifiant et mot de passe', () => {
    it("l'aidant est trouvé", async () => {
      const aidant = unAidant().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [aidant.identifiantConnexion, 'aaa'],
          [aidant.motDePasse, 'bbb'],
          [aidant.nomPrenom, 'ccc'],
        ])
      );

      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).rechercheParIdentifiantConnexionEtMotDePasse(
        aidant.identifiantConnexion,
        aidant.motDePasse
      );
      expect(aidantRecu).toStrictEqual<Aidant>(aidant);
    });

    it("l'aidant n'est pas trouvé", () => {
      expect(
        new EntrepotAidantPostgres(
          new FauxServiceDeChiffrement(new Map())
        ).rechercheParIdentifiantConnexionEtMotDePasse(
          'identifiant-inconnu',
          'mdp'
        )
      ).rejects.toThrow(new Error("Le aidant demandé n'existe pas."));
    });
  });

  describe('Recherche par identifiant', () => {
    it("l'aidant est trouvé", async () => {
      const aidant = unAidant().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [aidant.identifiantConnexion, 'aaa'],
          [aidant.motDePasse, 'bbb'],
          [aidant.nomPrenom, 'ccc'],
        ])
      );
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantTrouve = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).rechercheParIdentifiantDeConnexion(aidant.identifiantConnexion);

      expect(aidantTrouve).toStrictEqual<Aidant>(aidant);
    });

    it("l'aidant n'est pas trouvé", () => {
      expect(
        new EntrepotAidantPostgres(
          new FauxServiceDeChiffrement(new Map())
        ).rechercheParIdentifiantDeConnexion('identifiant-inconnu')
      ).rejects.toThrow(new Error("Le aidant demandé n'existe pas."));
    });
  });
});
