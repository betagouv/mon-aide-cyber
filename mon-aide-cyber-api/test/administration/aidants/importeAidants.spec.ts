import { describe, expect, it } from 'vitest';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { EntrepotAidantMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
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
    const dateSignatureCGU = new Date(Date.parse('2023-12-05T12:00:00+01:00'));
    FournisseurHorlogeDeTest.initialise(dateSignatureCGU);

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;charte;mail;\n' +
        'BFC;Jean Dupont;OK;jean.dupont@mail.com;123',
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
          charteSignee: true,
          cguSignee: true,
          email: aidant.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: aidant.nomPrenom,
          telephone: '123',
          region: 'BFC',
        },
      ],
      aidantsNonImportes: [],
      aidantsExistants: [],
    });
    expect(aidant).toStrictEqual<Aidant>({
      dateSignatureCharte: dateSignatureCGU,
      dateSignatureCGU: dateSignatureCGU,
      nomPrenom: 'Jean Dupont',
      motDePasse: 'un-mot-de-passe',
      identifiantConnexion: 'jean.dupont@mail.com',
      identifiant: aidant.identifiant,
    });
  });

  it('importe un aidant en supprimant les espaces inutiles', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const dateSignatureCGU = new Date(Date.parse('2023-12-05T12:00:00+01:00'));
    FournisseurHorlogeDeTest.initialise(dateSignatureCGU);

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;charte;mail;\n' +
        'BFC;Jean Dupont;OK;  jean.dupont@mail.com ;123',
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
          charteSignee: true,
          cguSignee: true,
          email: aidant.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: aidant.nomPrenom,
          telephone: '123',
          region: 'BFC',
        },
      ],
      aidantsNonImportes: [],
      aidantsExistants: [],
    });
    expect(aidant).toStrictEqual<Aidant>({
      dateSignatureCharte: dateSignatureCGU,
      dateSignatureCGU: dateSignatureCGU,
      nomPrenom: 'Jean Dupont',
      motDePasse: 'un-mot-de-passe',
      identifiantConnexion: 'jean.dupont@mail.com',
      identifiant: aidant.identifiant,
    });
  });

  it('importe plusieurs aidants', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const dateSignatureCGU = new Date(Date.parse('2023-12-05T12:00:00+01:00'));
    FournisseurHorlogeDeTest.initialise(dateSignatureCGU);

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;charte;mail;\n' +
        'BFC;Jean Dupont;OK;jean.dupont@mail.com;123\n' +
        'BFC;Charles Martin;OK;charles.martin@mail.com;456',
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
          charteSignee: true,
          cguSignee: true,
          email: jeanDupont.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: jeanDupont.nomPrenom,
          telephone: '123',
          region: 'BFC',
        },
        {
          charteSignee: true,
          cguSignee: true,
          email: charlesMartin.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: charlesMartin.nomPrenom,
          telephone: '456',
          region: 'BFC',
        },
      ],
      aidantsNonImportes: [],
      aidantsExistants: [],
    });
    expect(charlesMartin).toStrictEqual<Aidant>({
      dateSignatureCharte: dateSignatureCGU,
      dateSignatureCGU: dateSignatureCGU,
      nomPrenom: 'Charles Martin',
      motDePasse: 'un-mot-de-passe',
      identifiantConnexion: 'charles.martin@mail.com',
      identifiant: charlesMartin.identifiant,
    });
  });

  it.skip('ON IMPORTE TOUS LES AIDANTS - importe uniquement les aidants ayant signé la charte', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const dateSignatureCGU = new Date(Date.parse('2023-12-05T12:00:00+01:00'));
    FournisseurHorlogeDeTest.initialise(dateSignatureCGU);

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;charte;mail;\n' +
        'BFC;Jean Dupont;OK;jean.dupont@mail.com;123\n' +
        'BFC;Charles Martin;A demander;charles.martin@mail.com;456',
      () => 'un-mot-de-passe',
    );

    expect(await entrepotAidant.tous()).toHaveLength(1);
    const jeanDupont =
      await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
        'jean.dupont@mail.com',
        'un-mot-de-passe',
      );
    expect(resultat).toStrictEqual<ResultatImportationAidants>({
      aidantsImportes: [
        {
          charteSignee: true,
          cguSignee: true,
          email: jeanDupont.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: jeanDupont.nomPrenom,
          telephone: '123',
          region: 'BFC',
        },
      ],
      aidantsExistants: [],
      aidantsNonImportes: [
        {
          cguSignee: false,
          charteSignee: false,
          nomPrenom: 'Charles Martin',
          email: 'charles.martin@mail.com',
          telephone: '456',
          region: 'BFC',
        },
      ],
    });
  });

  it('importe uniquement les aidants non déjà présents', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const jeanDupont = unAidant()
      .avecUnIdentifiantDeConnexion('jean.dupont@mail.com')
      .construis();
    entrepotAidant.persiste(jeanDupont);
    const dateSignatureCGU = new Date(Date.parse('2023-12-05T12:00:00+01:00'));
    FournisseurHorlogeDeTest.initialise(dateSignatureCGU);

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;charte;mail;\n' +
        'BFC;Jean Dupont;OK;jean.dupont@mail.com;123\n' +
        'BFC;Charles Martin;OK;charles.martin@mail.com;456',
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
          charteSignee: true,
          cguSignee: true,
          email: charlesMartin.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: charlesMartin.nomPrenom,
          telephone: '456',
          region: 'BFC',
        },
      ],
      aidantsNonImportes: [],
      aidantsExistants: [
        {
          nomPrenom: jeanDupont.nomPrenom,
          email: jeanDupont.identifiantConnexion,
          charteSignee: true,
          cguSignee: true,
          telephone: '123',
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
    const dateSignatureCGU = new Date(Date.parse('2023-12-05T12:00:00+01:00'));
    FournisseurHorlogeDeTest.initialise(dateSignatureCGU);

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;charte;mail;\n' +
        'BFC;Jean Dupont;OK;jean.DUPONT@mail.com;123\n' +
        'BFC;Charles Martin;OK;charles.martin@mail.com;456',
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
          charteSignee: true,
          cguSignee: true,
          email: charlesMartin.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: charlesMartin.nomPrenom,
          telephone: '456',
          region: 'BFC',
        },
      ],
      aidantsNonImportes: [],
      aidantsExistants: [
        {
          nomPrenom: jeanDupont.nomPrenom,
          email: jeanDupont.identifiantConnexion,
          charteSignee: true,
          cguSignee: true,
          telephone: '123',
          region: 'BFC',
        },
      ],
    });
  });

  it('importe un aidant avec un email contenant des majuscules', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();
    const dateSignatureCGU = new Date(Date.parse('2023-12-05T12:00:00+01:00'));
    FournisseurHorlogeDeTest.initialise(dateSignatureCGU);

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      'Région;nom;charte;mail;\n' +
        'BFC;Jean Dupont;OK;jean.dUPonT@mail.com;123',
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
          charteSignee: true,
          cguSignee: true,
          email: aidant.identifiantConnexion,
          motDePasse: 'un-mot-de-passe',
          nomPrenom: aidant.nomPrenom,
          telephone: '123',
          region: 'BFC',
        },
      ],
      aidantsNonImportes: [],
      aidantsExistants: [],
    });
    expect(aidant).toStrictEqual<Aidant>({
      dateSignatureCharte: dateSignatureCGU,
      dateSignatureCGU: dateSignatureCGU,
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

    expect(aidantsImportes.aidantsNonImportes).toHaveLength(0);
  });
});
