import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import { BusEvenementDeTest } from '../../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  AidantCSV,
  TraitementCreationEspaceAidant,
  initialiseCreationEspacesAidants,
  ResultatCreationEspacesAidants,
} from '../../../../src/administration/aidants/espace-aidant/initialiseCreationEspacesAidants';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { Aidant } from '../../../../src/authentification/Aidant';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';
import { unConstructeurAidantCSV } from './ConstructeurAidantCSV';
import { unConstructeurDeDemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/constructeurDeDemandeDevenirAidant';
import { EntrepotsMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { Entrepots } from '../../../../src/domaine/Entrepots';

const enTeteCsv =
  'Région;nom;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n';
describe('Initialise la création de l’espace des aidants', () => {
  let busEvenement: BusEvenementDeTest;
  let entrepots: Entrepots;
  FournisseurHorlogeDeTest.initialise(
    new Date(Date.parse('2024-01-12T13:24:31+01:00'))
  );

  beforeEach(() => {
    busEvenement = new BusEvenementDeTest();
    entrepots = new EntrepotsMemoire();
  });

  const genereFichierCsv = (aidantsCsv: AidantCSV[]) => {
    const ligne = aidantsCsv.map(
      (aidantCsv) =>
        `${aidantCsv.region};${aidantCsv.nomPrenom};${aidantCsv.formation};${aidantCsv.charte};${aidantCsv.identifiantConnexion};${aidantCsv.numeroTelephone};${aidantCsv.todo};${aidantCsv.qui};${aidantCsv.compteCree};${aidantCsv.commentaires};${aidantCsv.messageAvecMDP}`
    );
    return enTeteCsv + `${ligne.join('\n')}`;
  };

  describe('Vérifie la cohérence du fichier CSV', () => {
    const genereFichierCsvAvecUnNombreDeColonnesInsuffisantes = () => {
      return 'Région;nom;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n';
    };
    it('Avec le bon nombre de colonnes dans l’entête', async () => {
      await expect(() =>
        initialiseCreationEspacesAidants(
          entrepots,
          busEvenement,
          genereFichierCsvAvecUnNombreDeColonnesInsuffisantes(),
          () => 'un-mot-de-passe'
        )
      ).rejects.toThrowError(
        new Error(
          "Le fichier doit contenir les colones suivantes 'Région;nom;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe'."
        )
      );
    });

    it.each([
      'region;nom;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n',
      'Région;name;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n',
      'Région;nom;furmation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n',
      'Région;nom;furmation;chorte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n',
      'Région;nom;furmation;chorte;mule;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n',
      'Région;nom;furmation;chorte;mule;talephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;qui;Compte Créé ?;commentaires;message avec mot de passe\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;quoi;Compte Créé ?;commentaires;message avec mot de passe\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;quoi;Compte;commentaires;message avec mot de passe\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;quoi;Compte;comment;message avec mot de passe\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;quoi;Compte;comment;message\n',
    ])('Avec les bons noms de colonnes dans l’entête', async (enteteCSV) => {
      await expect(() =>
        initialiseCreationEspacesAidants(
          entrepots,
          busEvenement,
          enteteCSV,
          () => 'un-mot-de-passe'
        )
      ).rejects.toThrowError(
        new Error(
          "Le fichier doit contenir les colones suivantes 'Région;nom;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;message avec mot de passe'."
        )
      );
    });
  });

  describe('En vue de la création d’un compte Aidant', () => {
    const importAidantAttendu = (
      email: string,
      nomPrenom: string,
      aidantCSV: AidantCSV,
      dateImport: string = FournisseurHorloge.maintenant().toISOString(),
      dejaImporte = false
    ): TraitementCreationEspaceAidant => ({
      email: email,
      nomPrenom: nomPrenom,
      telephone: aidantCSV.numeroTelephone,
      status: dejaImporte ? 'existant' : 'importé',
      region: aidantCSV.region,
      charte: aidantCSV.charte,
      formation: aidantCSV.formation,
      qui: dejaImporte ? 'FC' : '',
      todo: dejaImporte ? 'en attente de réponse' : 'message à envoyer',
      commentaires: dejaImporte
        ? `Aidant déjà existant - importé le ${dateImport}`
        : `importé le ${dateImport}`,
      compteCree: 'oui',
      messageAvecMDP: dejaImporte
        ? 'Message'
        : `"Bonjour,\nVotre mot de passe MonAideCyber : un-mot-de-passe\nVotre login est votre mail et l'URL de connexion est ${process.env.VITE_URL_MAC}\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée"`,
    });

    it('importe un aidant', async () => {
      const entrepotAidant = entrepots.aidants();
      const aidantCSV = unConstructeurAidantCSV()
        .charteOK()
        .avecUnTelephone('123')
        .avecUnEmail('jean.dupont@mail.com')
        .avecLeNom('Jean Dupont')
        .enRegion('BFC')
        .construis();

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([aidantCSV]),
        () => 'un-mot-de-passe'
      );

      const aidant =
        await entrepotAidant.rechercheParIdentifiantConnexionEtMotDePasse(
          'jean.dupont@mail.com',
          'un-mot-de-passe'
        );

      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        aidantsImportes: [
          importAidantAttendu(
            aidant.identifiantConnexion,
            aidant.nomPrenom,
            aidantCSV
          ),
        ],
        aidantsExistants: [],
        mailsCreationEspaceAidantEnvoyes: [],
        mailsCreationEspaceAidantEnAttente: [],
      });
      expect(aidant).toStrictEqual<Aidant>({
        nomPrenom: 'Jean Dupont',
        motDePasse: 'un-mot-de-passe',
        identifiantConnexion: 'jean.dupont@mail.com',
        identifiant: aidant.identifiant,
        preferences: {
          departements: [],
          secteursActivite: [],
        },
      });
    });

    it('importe un aidant en supprimant les espaces inutiles', async () => {
      const aidantCSV = unConstructeurAidantCSV()
        .avecUnEmail('  jean.dupont@mail.com ')
        .avecLeNom('Jean Dupont')
        .construis();

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([aidantCSV]),
        () => 'un-mot-de-passe'
      );

      const aidant = await entrepots
        .aidants()
        .rechercheParIdentifiantConnexionEtMotDePasse(
          'jean.dupont@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        aidantsImportes: [
          importAidantAttendu(
            aidant.identifiantConnexion,
            aidant.nomPrenom,
            aidantCSV
          ),
        ],
        aidantsExistants: [],
        mailsCreationEspaceAidantEnvoyes: [],
        mailsCreationEspaceAidantEnAttente: [],
      });
      expect(aidant).toStrictEqual<Aidant>({
        nomPrenom: 'Jean Dupont',
        motDePasse: 'un-mot-de-passe',
        identifiantConnexion: 'jean.dupont@mail.com',
        identifiant: aidant.identifiant,
        preferences: {
          departements: [],
          secteursActivite: [],
        },
      });
    });

    it('importe plusieurs aidants', async () => {
      const jeanDupontTranscris = unConstructeurAidantCSV()
        .avecUnEmail('jean.dupont@mail.com')
        .avecLeNom('Jean Dupont')
        .construis();
      const charlesMartinTranscris = unConstructeurAidantCSV()
        .avecUnEmail('charles.martin@mail.com')
        .avecLeNom('Charles Martin')
        .charteOK()
        .enRegion('NAQ')
        .construis();

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([jeanDupontTranscris, charlesMartinTranscris]),
        () => 'un-mot-de-passe'
      );

      const jeanDupont = await entrepots
        .aidants()
        .rechercheParIdentifiantConnexionEtMotDePasse(
          'jean.dupont@mail.com',
          'un-mot-de-passe'
        );
      const charlesMartin = await entrepots
        .aidants()
        .rechercheParIdentifiantConnexionEtMotDePasse(
          'charles.martin@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        aidantsImportes: [
          importAidantAttendu(
            jeanDupont.identifiantConnexion,
            jeanDupont.nomPrenom,
            jeanDupontTranscris
          ),
          importAidantAttendu(
            charlesMartin.identifiantConnexion,
            charlesMartin.nomPrenom,
            charlesMartinTranscris
          ),
        ],
        aidantsExistants: [],
        mailsCreationEspaceAidantEnvoyes: [],
        mailsCreationEspaceAidantEnAttente: [],
      });
      expect(charlesMartin).toStrictEqual<Aidant>({
        nomPrenom: 'Charles Martin',
        motDePasse: 'un-mot-de-passe',
        identifiantConnexion: 'charles.martin@mail.com',
        identifiant: charlesMartin.identifiant,
        preferences: {
          departements: [],
          secteursActivite: [],
        },
      });
    });

    it('importe uniquement les aidants non déjà présents', async () => {
      const jeanDupont = unAidant()
        .avecUnIdentifiantDeConnexion('jean.dupont@mail.com')
        .avecUnNomPrenom('Jean Dupont')
        .construis();
      entrepots.aidants().persiste(jeanDupont);
      const jeanDupontTranscris = unConstructeurAidantCSV()
        .avecUnEmail('jean.dupont@mail.com')
        .avecLeNom('Jean Dupont')
        .dejaImporte()
        .construis();
      const charlesMartinTranscris = unConstructeurAidantCSV()
        .avecUnEmail('charles.martin@mail.com')
        .avecLeNom('Charles Martin')
        .charteOK()
        .enRegion('NAQ')
        .construis();

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([jeanDupontTranscris, charlesMartinTranscris]),
        () => 'un-mot-de-passe'
      );

      expect(await entrepots.aidants().tous()).toHaveLength(2);
      const charlesMartin = await entrepots
        .aidants()
        .rechercheParIdentifiantConnexionEtMotDePasse(
          'charles.martin@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        aidantsImportes: [
          importAidantAttendu(
            charlesMartin.identifiantConnexion,
            charlesMartin.nomPrenom,
            charlesMartinTranscris
          ),
        ],
        aidantsExistants: [
          importAidantAttendu(
            jeanDupont.identifiantConnexion,
            jeanDupont.nomPrenom,
            jeanDupontTranscris,
            '2024-01-05',
            true
          ),
        ],
        mailsCreationEspaceAidantEnvoyes: [],
        mailsCreationEspaceAidantEnAttente: [],
      });
    });

    it('Lorsqu’un Aidant a déjà été importé, on l’ajoute en commentaire', async () => {
      const jeanDupont = unAidant()
        .avecUnIdentifiantDeConnexion('jean.dupont@mail.com')
        .avecUnNomPrenom('Jean Dupont')
        .construis();
      entrepots.aidants().persiste(jeanDupont);
      const jeanDupontTranscris = unConstructeurAidantCSV()
        .avecUnEmail('jean.dupont@mail.com')
        .avecLeNom('Jean Dupont')
        .dejaImporte()
        .construis();

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([jeanDupontTranscris]),
        () => 'un-mot-de-passe'
      );

      expect(await entrepots.aidants().tous()).toHaveLength(1);
      expect(resultat.aidantsExistants[0].commentaires).toStrictEqual(
        'Aidant déjà existant - importé le 2024-01-05'
      );
    });

    it('importe uniquement les aidants non déjà présents contenant des majuscules dans leur email de connexion', async () => {
      const jeanDupont = unAidant()
        .avecUnIdentifiantDeConnexion('jean.dupont@mail.com')
        .avecUnNomPrenom('Jean Dupont')
        .construis();
      entrepots.aidants().persiste(jeanDupont);
      const jeanDupontTranscris = unConstructeurAidantCSV()
        .avecUnEmail('jean.DUPONT@mail.com')
        .avecLeNom('Jean Dupont')
        .dejaImporte()
        .construis();
      const charlesMartinTranscris = unConstructeurAidantCSV()
        .avecUnEmail('charles.martin@mail.com')
        .avecLeNom('Charles Martin')
        .charteOK()
        .enRegion('NAQ')
        .construis();

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([jeanDupontTranscris, charlesMartinTranscris]),
        () => 'un-mot-de-passe'
      );

      expect(await entrepots.aidants().tous()).toHaveLength(2);
      const charlesMartin = await entrepots
        .aidants()
        .rechercheParIdentifiantConnexionEtMotDePasse(
          'charles.martin@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        aidantsImportes: [
          importAidantAttendu(
            charlesMartin.identifiantConnexion,
            charlesMartin.nomPrenom,
            charlesMartinTranscris
          ),
        ],
        aidantsExistants: [
          importAidantAttendu(
            jeanDupont.identifiantConnexion,
            jeanDupont.nomPrenom,
            jeanDupontTranscris,
            '2024-01-05',
            true
          ),
        ],
        mailsCreationEspaceAidantEnvoyes: [],
        mailsCreationEspaceAidantEnAttente: [],
      });
    });

    it('importe un aidant avec un email contenant des majuscules', async () => {
      const jeanDupontTranscris = unConstructeurAidantCSV()
        .avecUnEmail('jean.dUPonT@mail.com')
        .avecLeNom('Jean Dupont')
        .construis();

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([jeanDupontTranscris]),
        () => 'un-mot-de-passe'
      );

      const aidant = await entrepots
        .aidants()
        .rechercheParIdentifiantConnexionEtMotDePasse(
          'jean.dupont@mail.com',
          'un-mot-de-passe'
        );
      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        aidantsImportes: [
          importAidantAttendu(
            aidant.identifiantConnexion,
            aidant.nomPrenom,
            jeanDupontTranscris
          ),
        ],
        aidantsExistants: [],
        mailsCreationEspaceAidantEnvoyes: [],
        mailsCreationEspaceAidantEnAttente: [],
      });
      expect(aidant).toStrictEqual<Aidant>({
        nomPrenom: 'Jean Dupont',
        motDePasse: 'un-mot-de-passe',
        identifiantConnexion: 'jean.dupont@mail.com',
        identifiant: aidant.identifiant,
        preferences: {
          departements: [],
          secteursActivite: [],
        },
      });
    });

    it("n'importe pas si la ligne est vide", async () => {
      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        enTeteCsv + ';;;;;;;;;;;',
        () => 'un-mot-de-passe'
      );

      expect(resultat.aidantsImportes).toHaveLength(0);
    });

    it("importe les aidants à partir d'un fichier", async () => {
      const aidantsAImporter = fs.readFileSync(
        './test/administration/aidants/espace-aidant/beta_testeur.csv',
        {
          encoding: 'utf-8',
        }
      );

      const aidantsImportes = await initialiseCreationEspacesAidants(
        entrepots,
        new BusEvenementDeTest(),
        aidantsAImporter
      );

      expect(aidantsImportes.aidantsImportes).toHaveLength(1);
    });
  });

  describe('En relation avec le parours devenir Aidant', () => {
    const importAidantMailEnvoyeAttendu = (
      aidantCSV: AidantCSV,
      demandeEnAttente = false
    ): TraitementCreationEspaceAidant => {
      return {
        email: aidantCSV.identifiantConnexion,
        nomPrenom: aidantCSV.nomPrenom,
        telephone: aidantCSV.numeroTelephone,
        status: demandeEnAttente ? 'demande-en-attente' : 'email-envoyé',
        region: aidantCSV.region,
        charte: aidantCSV.charte,
        formation: aidantCSV.formation,
        qui: demandeEnAttente ? '' : 'MAC',
        todo: demandeEnAttente
          ? 'Vérifier que l’Aidant a bien signé la charte et participé à la formation'
          : 'RAF',
        commentaires: demandeEnAttente
          ? 'Demande devenir Aidant en attente de formation ou charte OK'
          : `mail de création de l’espace aidant envoyé le ${FournisseurHorloge.maintenant().toISOString()}`,
        compteCree: 'non',
        messageAvecMDP: 'AUCUN MESSAGE',
      };
    };

    it('Envoie le mail de création de l’espace Aidant', async () => {
      const aidantCSV = unConstructeurAidantCSV()
        .charteOK()
        .formationOK()
        .construis();
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail(aidantCSV.identifiantConnexion)
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([aidantCSV]),
        () => 'un-mot-de-passe'
      );

      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        aidantsImportes: [],
        aidantsExistants: [],
        mailsCreationEspaceAidantEnvoyes: [
          importAidantMailEnvoyeAttendu(aidantCSV),
        ],
        mailsCreationEspaceAidantEnAttente: [],
      });
    });

    it('N’envoie pas le mail si la formation est marquée à NOK', async () => {
      const aidantCSV = unConstructeurAidantCSV().charteOK().construis();
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail(aidantCSV.identifiantConnexion)
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([aidantCSV]),
        () => 'un-mot-de-passe'
      );

      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        aidantsImportes: [],
        aidantsExistants: [],
        mailsCreationEspaceAidantEnvoyes: [],
        mailsCreationEspaceAidantEnAttente: [
          importAidantMailEnvoyeAttendu(aidantCSV, true),
        ],
      });
      expect(busEvenement.evenementRecu).toBeUndefined();
    });

    it('N’envoie pas le mail si la charte est marquée à NOK', async () => {
      const aidantCSV = unConstructeurAidantCSV().formationOK().construis();
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail(aidantCSV.identifiantConnexion)
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);

      const resultat = await initialiseCreationEspacesAidants(
        entrepots,
        busEvenement,
        genereFichierCsv([aidantCSV]),
        () => 'un-mot-de-passe'
      );

      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        aidantsImportes: [],
        aidantsExistants: [],
        mailsCreationEspaceAidantEnvoyes: [],
        mailsCreationEspaceAidantEnAttente: [
          importAidantMailEnvoyeAttendu(aidantCSV, true),
        ],
      });
      expect(busEvenement.evenementRecu).toBeUndefined();
    });
  });
});
