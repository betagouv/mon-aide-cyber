import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import { BusEvenementDeTest } from '../../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  AidantTranscris,
  importeAidants,
  ResultatImportationAidants,
} from '../../../../src/administration/aidants/importe/importeAidants';
import { EntrepotAidantMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { Aidant } from '../../../../src/authentification/Aidant';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';

const enTeteCsv =
  'Région;nom;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n';
describe('Importe des aidants', () => {
  let busEvenement: BusEvenementDeTest;
  FournisseurHorlogeDeTest.initialise(
    new Date(Date.parse('2024-01-12T13:24:31+01:00')),
  );

  beforeEach(() => {
    busEvenement = new BusEvenementDeTest();
  });

  function genereFichierCsv(aidantsCsv: AidantTranscris[]) {
    const ligne = aidantsCsv.map(
      (aidantCsv) =>
        `${aidantCsv.region};${aidantCsv.nomPrenom};${aidantCsv.charte};${aidantCsv.identifiantConnexion};${aidantCsv.numeroTelephone};${aidantCsv.todo};${aidantCsv.qui};${aidantCsv.compteCree};${aidantCsv.commentaires};${aidantCsv.messageAvecMDP}`,
    );
    return enTeteCsv + `${ligne.join('\n')}`;
  }

  it('importe un aidant', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      genereFichierCsv([
        {
          numeroTelephone: '123',
          identifiantConnexion: 'jean.dupont@mail.com',
          nomPrenom: 'Jean Dupont',
          region: 'BFC',
          charte: 'OK',
          qui: '',
          todo: 'compte à créer',
          commentaires: '',
          messageAvecMDP: '',
          compteCree: 'non',
        },
      ]),
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
          nomPrenom: aidant.nomPrenom,
          telephone: '123',
          status: 'importé',
          region: 'BFC',
          charte: 'OK',
          qui: '',
          todo: 'message à envoyer',
          commentaires: `importé le ${FournisseurHorloge.maintenant().toISOString()}`,
          compteCree: 'oui',
          messageAvecMDP: `"Bonjour,\nVotre mot de passe MonAideCyber : un-mot-de-passe\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`,
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
      genereFichierCsv([
        {
          numeroTelephone: '123',
          identifiantConnexion: '  jean.dupont@mail.com ',
          nomPrenom: 'Jean Dupont',
          region: 'BFC',
          charte: 'NOK',
          qui: '',
          todo: 'compte à créer',
          commentaires: '',
          messageAvecMDP: '',
          compteCree: 'non',
        },
      ]),
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
          nomPrenom: aidant.nomPrenom,
          telephone: '123',
          status: 'importé',
          region: 'BFC',
          charte: 'NOK',
          qui: '',
          todo: 'message à envoyer',
          commentaires: `importé le ${FournisseurHorloge.maintenant().toISOString()}`,
          compteCree: 'oui',
          messageAvecMDP: `"Bonjour,\nVotre mot de passe MonAideCyber : un-mot-de-passe\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`,
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
      genereFichierCsv([
        {
          numeroTelephone: '123',
          identifiantConnexion: 'jean.dupont@mail.com',
          nomPrenom: 'Jean Dupont',
          region: 'BFC',
          charte: 'NOK',
          qui: '',
          todo: 'compte à créer',
          commentaires: '',
          messageAvecMDP: '',
          compteCree: 'non',
        },
        {
          numeroTelephone: '456',
          identifiantConnexion: 'charles.martin@mail.com',
          nomPrenom: 'Charles Martin',
          region: 'NAQ',
          charte: 'OK',
          qui: 'DEV',
          todo: 'compte à créer',
          commentaires: '',
          messageAvecMDP: '',
          compteCree: 'non',
        },
      ]),
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
          nomPrenom: jeanDupont.nomPrenom,
          telephone: '123',
          status: 'importé',
          region: 'BFC',
          charte: 'NOK',
          qui: '',
          todo: 'message à envoyer',
          commentaires: `importé le ${FournisseurHorloge.maintenant().toISOString()}`,
          compteCree: 'oui',
          messageAvecMDP: `"Bonjour,\nVotre mot de passe MonAideCyber : un-mot-de-passe\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`,
        },
        {
          email: charlesMartin.identifiantConnexion,
          nomPrenom: charlesMartin.nomPrenom,
          telephone: '456',
          status: 'importé',
          region: 'NAQ',
          charte: 'OK',
          qui: '',
          todo: 'message à envoyer',
          commentaires: `importé le ${FournisseurHorloge.maintenant().toISOString()}`,
          compteCree: 'oui',
          messageAvecMDP: `"Bonjour,\nVotre mot de passe MonAideCyber : un-mot-de-passe\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`,
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
      genereFichierCsv([
        {
          numeroTelephone: '123',
          identifiantConnexion: 'jean.dupont@mail.com',
          nomPrenom: 'Jean Dupont',
          region: 'BFC',
          charte: 'NOK',
          qui: 'FC',
          todo: 'en attente de réponse',
          commentaires: 'importé le 2024-01-05',
          messageAvecMDP: 'Message',
          compteCree: 'oui',
        },
        {
          numeroTelephone: '456',
          identifiantConnexion: 'charles.martin@mail.com',
          nomPrenom: 'Charles Martin',
          region: 'NAQ',
          charte: 'OK',
          qui: 'DEV',
          todo: 'compte à créer',
          commentaires: '',
          messageAvecMDP: '',
          compteCree: 'non',
        },
      ]),
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
          nomPrenom: charlesMartin.nomPrenom,
          telephone: '456',
          status: 'importé',
          region: 'NAQ',
          charte: 'OK',
          qui: '',
          todo: 'message à envoyer',
          commentaires: `importé le ${FournisseurHorloge.maintenant().toISOString()}`,
          compteCree: 'oui',
          messageAvecMDP: `"Bonjour,\nVotre mot de passe MonAideCyber : un-mot-de-passe\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`,
        },
      ],
      aidantsExistants: [
        {
          nomPrenom: jeanDupont.nomPrenom,
          email: jeanDupont.identifiantConnexion,
          telephone: '123',
          status: 'existant',
          region: 'BFC',
          charte: 'NOK',
          qui: 'FC',
          todo: 'en attente de réponse',
          commentaires: `importé le 2024-01-05`,
          compteCree: 'oui',
          messageAvecMDP: 'Message',
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
      genereFichierCsv([
        {
          numeroTelephone: '123',
          identifiantConnexion: 'jean.DUPONT@mail.com',
          nomPrenom: 'Jean Dupont',
          region: 'BFC',
          charte: 'NOK',
          qui: 'FC',
          todo: 'en attente de réponse',
          commentaires: 'importé le 2024-01-05',
          messageAvecMDP: 'Message',
          compteCree: 'oui',
        },
        {
          numeroTelephone: '456',
          identifiantConnexion: 'charles.martin@mail.com',
          nomPrenom: 'Charles Martin',
          region: 'NAQ',
          charte: 'OK',
          qui: 'DEV',
          todo: 'compte à créer',
          commentaires: '',
          messageAvecMDP: '',
          compteCree: 'non',
        },
      ]),
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
          nomPrenom: charlesMartin.nomPrenom,
          telephone: '456',
          status: 'importé',
          region: 'NAQ',
          charte: 'OK',
          qui: '',
          todo: 'message à envoyer',
          commentaires: `importé le ${FournisseurHorloge.maintenant().toISOString()}`,
          compteCree: 'oui',
          messageAvecMDP: `"Bonjour,\nVotre mot de passe MonAideCyber : un-mot-de-passe\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`,
        },
      ],
      aidantsExistants: [
        {
          nomPrenom: jeanDupont.nomPrenom,
          email: jeanDupont.identifiantConnexion,
          telephone: '123',
          status: 'existant',
          region: 'BFC',
          charte: 'NOK',
          qui: 'FC',
          todo: 'en attente de réponse',
          commentaires: `importé le 2024-01-05`,
          compteCree: 'oui',
          messageAvecMDP: 'Message',
        },
      ],
    });
  });

  it('importe un aidant avec un email contenant des majuscules', async () => {
    const entrepotAidant = new EntrepotAidantMemoire();

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      genereFichierCsv([
        {
          numeroTelephone: '123',
          identifiantConnexion: 'jean.dUPonT@mail.com',
          nomPrenom: 'Jean Dupont',
          region: 'BFC',
          charte: 'NOK',
          qui: '',
          todo: 'compte à créer',
          commentaires: '',
          messageAvecMDP: '',
          compteCree: 'non',
        },
      ]),
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
          nomPrenom: aidant.nomPrenom,
          telephone: '123',
          status: 'importé',
          region: 'BFC',
          charte: 'NOK',
          qui: '',
          todo: 'message à envoyer',
          commentaires: `importé le ${FournisseurHorloge.maintenant().toISOString()}`,
          compteCree: 'oui',
          messageAvecMDP: `"Bonjour,\nVotre mot de passe MonAideCyber : un-mot-de-passe\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`,
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

  it("n'importe pas si la ligne est vide", async () => {
    const entrepotAidant = new EntrepotAidantMemoire();

    const resultat = await importeAidants(
      entrepotAidant,
      busEvenement,
      enTeteCsv + ';;;;;;;;;;;',
      () => 'un-mot-de-passe',
    );

    expect(resultat.aidantsImportes).toHaveLength(0);
  });

  it("importe les aidants à partir d'un fichier", async () => {
    const entrepot = new EntrepotAidantMemoire();
    const aidantsAImporter = fs.readFileSync(
      './test/administration/aidants/importe/beta_testeur.csv',
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
