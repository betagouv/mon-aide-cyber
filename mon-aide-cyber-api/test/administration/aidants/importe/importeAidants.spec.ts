import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import { BusEvenementDeTest } from '../../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  AidantTranscris,
  ImportAidant,
  importeAidants,
  ResultatImportationAidants,
} from '../../../../src/administration/aidants/importe/importeAidants';
import { EntrepotAidantMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { Aidant } from '../../../../src/authentification/Aidant';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';
import { unConstructeurAidantTranscris } from './ConstructeurAidantTranscris';

const enTeteCsv =
  'Région;nom;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n';
describe('Importe des aidants', () => {
  let busEvenement: BusEvenementDeTest;
  FournisseurHorlogeDeTest.initialise(
    new Date(Date.parse('2024-01-12T13:24:31+01:00'))
  );

  beforeEach(() => {
    busEvenement = new BusEvenementDeTest();
  });

  const genereFichierCsv = (aidantsCsv: AidantTranscris[]) => {
    const ligne = aidantsCsv.map(
      (aidantCsv) =>
        `${aidantCsv.region};${aidantCsv.nomPrenom};${aidantCsv.charte};${aidantCsv.identifiantConnexion};${aidantCsv.numeroTelephone};${aidantCsv.todo};${aidantCsv.qui};${aidantCsv.compteCree};${aidantCsv.commentaires};${aidantCsv.messageAvecMDP}`
    );
    return enTeteCsv + `${ligne.join('\n')}`;
  };

  const importAidantAttendu = (
    aidant: Aidant,
    aidantTranscris: AidantTranscris,
    dateImport: string = FournisseurHorloge.maintenant().toISOString(),
    dejaImporte = false
  ): ImportAidant => ({
    email: aidant.identifiantConnexion,
    nomPrenom: aidant.nomPrenom,
    telephone: aidantTranscris.numeroTelephone,
    status: dejaImporte ? 'existant' : 'importé',
    region: aidantTranscris.region,
    charte: aidantTranscris.charte,
    qui: dejaImporte ? 'FC' : '',
    todo: dejaImporte ? 'en attente de réponse' : 'message à envoyer',
    commentaires: `importé le ${dateImport}`,
    compteCree: 'oui',
    messageAvecMDP: dejaImporte
      ? 'Message'
      : `"Bonjour,\nVotre mot de passe MonAideCyber : un-mot-de-passe\nVotre login est votre mail et l'URL de connexion est ${process.env.VITE_URL_MAC}\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée"`,
  });

  describe('En vue de la création d’un compte Aidant', () => {
    it('importe un aidant', async () => {
      const entrepotAidant = new EntrepotAidantMemoire();
      const aidantTranscris = unConstructeurAidantTranscris()
        .charteOK()
        .avecUnTelephone('123')
        .avecUnEmail('jean.dupont@mail.com')
        .avecLeNom('Jean Dupont')
        .enRegion('BFC')
        .construis();

      const resultat = await importeAidants(
        entrepotAidant,
        busEvenement,
        genereFichierCsv([aidantTranscris]),
        () => 'un-mot-de-passe'
      );

      const aidant =
        await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
          'jean.dupont@mail.com',
          'un-mot-de-passe'
        );

      expect(resultat).toStrictEqual<ResultatImportationAidants>({
        aidantsImportes: [importAidantAttendu(aidant, aidantTranscris)],
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
      const aidantTranscris = unConstructeurAidantTranscris()
        .avecUnEmail('  jean.dupont@mail.com ')
        .avecLeNom('Jean Dupont')
        .construis();

      const resultat = await importeAidants(
        entrepotAidant,
        busEvenement,
        genereFichierCsv([aidantTranscris]),
        () => 'un-mot-de-passe'
      );

      const aidant =
        await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
          'jean.dupont@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatImportationAidants>({
        aidantsImportes: [importAidantAttendu(aidant, aidantTranscris)],
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
      const jeanDupontTranscris = unConstructeurAidantTranscris()
        .avecUnEmail('jean.dupont@mail.com')
        .avecLeNom('Jean Dupont')
        .construis();
      const charlesMartinTranscris = unConstructeurAidantTranscris()
        .avecUnEmail('charles.martin@mail.com')
        .avecLeNom('Charles Martin')
        .charteOK()
        .enRegion('NAQ')
        .construis();

      const resultat = await importeAidants(
        entrepotAidant,
        busEvenement,
        genereFichierCsv([jeanDupontTranscris, charlesMartinTranscris]),
        () => 'un-mot-de-passe'
      );

      const jeanDupont =
        await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
          'jean.dupont@mail.com',
          'un-mot-de-passe'
        );
      const charlesMartin =
        await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
          'charles.martin@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatImportationAidants>({
        aidantsImportes: [
          importAidantAttendu(jeanDupont, jeanDupontTranscris),
          importAidantAttendu(charlesMartin, charlesMartinTranscris),
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
      const jeanDupontTranscris = unConstructeurAidantTranscris()
        .avecUnEmail('jean.dupont@mail.com')
        .avecLeNom('Jean Dupont')
        .dejaImporte()
        .construis();
      const charlesMartinTranscris = unConstructeurAidantTranscris()
        .avecUnEmail('charles.martin@mail.com')
        .avecLeNom('Charles Martin')
        .charteOK()
        .enRegion('NAQ')
        .construis();

      const resultat = await importeAidants(
        entrepotAidant,
        busEvenement,
        genereFichierCsv([jeanDupontTranscris, charlesMartinTranscris]),
        () => 'un-mot-de-passe'
      );

      expect(await entrepotAidant.tous()).toHaveLength(2);
      const charlesMartin =
        await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
          'charles.martin@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatImportationAidants>({
        aidantsImportes: [
          importAidantAttendu(charlesMartin, charlesMartinTranscris),
        ],
        aidantsExistants: [
          importAidantAttendu(
            jeanDupont,
            jeanDupontTranscris,
            '2024-01-05',
            true
          ),
        ],
      });
    });

    it('importe uniquement les aidants non déjà présents contenant des majuscules dans leur email de connexion', async () => {
      const entrepotAidant = new EntrepotAidantMemoire();
      const jeanDupont = unAidant()
        .avecUnIdentifiantDeConnexion('jean.dupont@mail.com')
        .construis();
      entrepotAidant.persiste(jeanDupont);
      const jeanDupontTranscris = unConstructeurAidantTranscris()
        .avecUnEmail('jean.DUPONT@mail.com')
        .avecLeNom('Jean Dupont')
        .dejaImporte()
        .construis();
      const charlesMartinTranscris = unConstructeurAidantTranscris()
        .avecUnEmail('charles.martin@mail.com')
        .avecLeNom('Charles Martin')
        .charteOK()
        .enRegion('NAQ')
        .construis();

      const resultat = await importeAidants(
        entrepotAidant,
        busEvenement,
        genereFichierCsv([jeanDupontTranscris, charlesMartinTranscris]),
        () => 'un-mot-de-passe'
      );

      expect(await entrepotAidant.tous()).toHaveLength(2);
      const charlesMartin =
        await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
          'charles.martin@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatImportationAidants>({
        aidantsImportes: [
          importAidantAttendu(charlesMartin, charlesMartinTranscris),
        ],
        aidantsExistants: [
          importAidantAttendu(
            jeanDupont,
            jeanDupontTranscris,
            '2024-01-05',
            true
          ),
        ],
      });
    });

    it('importe un aidant avec un email contenant des majuscules', async () => {
      const entrepotAidant = new EntrepotAidantMemoire();
      const jeanDupontTranscris = unConstructeurAidantTranscris()
        .avecUnEmail('jean.dUPonT@mail.com')
        .avecLeNom('Jean Dupont')
        .construis();

      const resultat = await importeAidants(
        entrepotAidant,
        busEvenement,
        genereFichierCsv([jeanDupontTranscris]),
        () => 'un-mot-de-passe'
      );

      const aidant =
        await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
          'jean.dupont@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatImportationAidants>({
        aidantsImportes: [importAidantAttendu(aidant, jeanDupontTranscris)],
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
        () => 'un-mot-de-passe'
      );

      expect(resultat.aidantsImportes).toHaveLength(0);
    });

    it("importe les aidants à partir d'un fichier", async () => {
      const entrepot = new EntrepotAidantMemoire();
      const aidantsAImporter = fs.readFileSync(
        './test/administration/aidants/importe/beta_testeur.csv',
        {
          encoding: 'utf-8',
        }
      );

      const aidantsImportes = await importeAidants(
        entrepot,
        new BusEvenementDeTest(),
        aidantsAImporter
      );

      expect(aidantsImportes.aidantsImportes).toHaveLength(1);
    });
  });
});
