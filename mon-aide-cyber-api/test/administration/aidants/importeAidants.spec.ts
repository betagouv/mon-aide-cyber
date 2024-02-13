import { describe, expect, it } from 'vitest';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { EntrepotAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { Aidant } from '../../../src/authentification/Aidant';
import {
  importeAidants,
  ResultatImportationAidants,
} from '../../../src/administration/aidants/importeAidants';
import { unAidant } from '../../authentification/constructeurs/constructeurAidant';
import * as fs from 'fs';

describe('Importe des aidants', () => {
  let busEvenement: BusEvenementDeTest;

  beforeEach(() => {
    busEvenement = new BusEvenementDeTest();
  });

  it('importe un aidant', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;mail;\n' + 'BFC;Jean Dupont;jean.dupont@mail.com;123',
      () => 'un-mot-de-passe',
    );

    const aidant =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'jean.dupont@mail.com',
        'un-mot-de-passe',
      );
    expect(resultat).toStrictEqual<ResultatImportationAidants>({
      aidantsImportes: [
        {
          email: aidant.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: aidant.nomPrenom,
          telephone: '123',
          status: 'importé',
          region: 'BFC',
        },
      ],
      aidantsExistants: [],
    });
    expect(aidant).toStrictEqual<Aidant>({
      nomPrenom: 'Jean Dupont',
      motDePasse: 'un-mot-de-passe',
      identifiantConnexion: 'jean.dupont@mail.com',
      identifiant: aidant.identifiant,
    });
  });

  it('importe un aidant en supprimant les espaces inutiles', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;mail;\n' + 'BFC;Jean Dupont;  jean.dupont@mail.com ;123',
      () => 'un-mot-de-passe',
    );

    const aidant =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'jean.dupont@mail.com',
        'un-mot-de-passe',
      );
    expect(resultat).toStrictEqual<ResultatImportationAidants>({
      aidantsImportes: [
        {
          email: aidant.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: aidant.nomPrenom,
          telephone: '123',
          status: 'importé',
          region: 'BFC',
        },
      ],
      aidantsExistants: [],
    });
    expect(aidant).toStrictEqual<Aidant>({
      nomPrenom: 'Jean Dupont',
      motDePasse: 'un-mot-de-passe',
      identifiantConnexion: 'jean.dupont@mail.com',
      identifiant: aidant.identifiant,
    });
  });

  it('importe plusieurs aidants', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;mail;\n' +
        'BFC;Jean Dupont;jean.dupont@mail.com;123\n' +
        'BFC;Charles Martin;charles.martin@mail.com;456',
      () => 'un-mot-de-passe',
    );

    const jeanDupont =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'jean.dupont@mail.com',
        'un-mot-de-passe',
      );
    const charlesMartin =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'charles.martin@mail.com',
        'un-mot-de-passe',
      );
    expect(resultat).toStrictEqual<ResultatImportationAidants>({
      aidantsImportes: [
        {
          email: jeanDupont.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: jeanDupont.nomPrenom,
          telephone: '123',
          status: 'importé',
          region: 'BFC',
        },
        {
          email: charlesMartin.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: charlesMartin.nomPrenom,
          telephone: '456',
          status: 'importé',
          region: 'BFC',
        },
      ],
      aidantsExistants: [],
    });
    expect(charlesMartin).toStrictEqual<Aidant>({
      nomPrenom: 'Charles Martin',
      motDePasse: 'un-mot-de-passe',
      identifiantConnexion: 'charles.martin@mail.com',
      identifiant: charlesMartin.identifiant,
    });
  });

  it('importe uniquement les aidants non déjà présents', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const jeanDupont = unAidant()
      .avecUnIdentifiantDeConnexion('jean.dupont@mail.com')
      .construis();
    entrepotAidant.persiste(jeanDupont);

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;mail;\n' +
        'BFC;Jean Dupont;jean.dupont@mail.com;123\n' +
        'BFC;Charles Martin;charles.martin@mail.com;456',
      () => 'un-mot-de-passe',
    );

    expect(await entrepotAidant.tous()).toHaveLength(2);
    const charlesMartin =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'charles.martin@mail.com',
        'un-mot-de-passe',
      );
    expect(resultat).toStrictEqual<ResultatImportationAidants>({
      aidantsImportes: [
        {
          email: charlesMartin.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: charlesMartin.nomPrenom,
          telephone: '456',
          status: 'importé',
          region: 'BFC',
        },
      ],
      aidantsExistants: [
        {
          nomPrenom: jeanDupont.nomPrenom,
          email: jeanDupont.identifiantConnexion,
          telephone: '123',
          status: 'existant',
          region: 'BFC',
        },
      ],
    });
  });

  it('importe uniquement les aidants non déjà présents contenant des majuscules dans leur email de connexion', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const jeanDupont = unAidant()
      .avecUnIdentifiantDeConnexion('jean.dupont@mail.com')
      .construis();
    entrepotAidant.persiste(jeanDupont);

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;mail;\n' +
        'BFC;Jean Dupont;jean.DUPONT@mail.com;123\n' +
        'BFC;Charles Martin;charles.martin@mail.com;456',
      () => 'un-mot-de-passe',
    );

    expect(await entrepotAidant.tous()).toHaveLength(2);
    const charlesMartin =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'charles.martin@mail.com',
        'un-mot-de-passe',
      );
    expect(resultat).toStrictEqual<ResultatImportationAidants>({
      aidantsImportes: [
        {
          email: charlesMartin.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: charlesMartin.nomPrenom,
          telephone: '456',
          status: 'importé',
          region: 'BFC',
        },
      ],
      aidantsExistants: [
        {
          nomPrenom: jeanDupont.nomPrenom,
          email: jeanDupont.identifiantConnexion,
          telephone: '123',
          status: 'existant',
          region: 'BFC',
        },
      ],
    });
  });

  it('importe un aidant avec un email contenant des majuscules', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;mail;\n' + 'BFC;Jean Dupont;jean.dUPonT@mail.com;123',
      () => 'un-mot-de-passe',
    );

    const aidant =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'jean.dupont@mail.com',
        'un-mot-de-passe',
      );
    expect(resultat).toStrictEqual<ResultatImportationAidants>({
      aidantsImportes: [
        {
          email: aidant.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: aidant.nomPrenom,
          telephone: '123',
          status: 'importé',
          region: 'BFC',
        },
      ],
      aidantsExistants: [],
    });
    expect(aidant).toStrictEqual<Aidant>({
      nomPrenom: 'Jean Dupont',
      motDePasse: 'un-mot-de-passe',
      identifiantConnexion: 'jean.dupont@mail.com',
      identifiant: aidant.identifiant,
    });
  });

  it("importe les aidants à partir d'un fichier", async () => {
    const entrepot = new EntrepotAidantMemoire();
    const aidantsAImporter = fs.readFileSync(
      './test/administration/aidants/beta_testeur.csv',
      {
        encoding: 'utf-8',
      },
    );

    const aidantsImportes = await importeAidants(
      entrepot,
      new BusEvenementDeTest(),
      aidantsAImporter,
    );

    expect(aidantsImportes.aidantsImportes).toHaveLength(1);
  });
});
