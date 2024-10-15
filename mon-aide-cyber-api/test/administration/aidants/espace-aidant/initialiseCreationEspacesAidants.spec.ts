import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import { BusEvenementDeTest } from '../../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  AidantCSV,
  initialiseCreationEspacesAidants,
  ResultatCreationEspacesAidants,
  TraitementCreationEspaceAidant,
} from '../../../../src/administration/aidants/espace-aidant/initialiseCreationEspacesAidants';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { unConstructeurAidantCSV } from './ConstructeurAidantCSV';
import { unConstructeurDeDemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/constructeurDeDemandeDevenirAidant';
import { EntrepotsMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { Entrepots } from '../../../../src/domaine/Entrepots';
import {
  DemandeDevenirAidant,
  StatutDemande,
} from '../../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';

const enTeteCsv =
  'Région;nom;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;lieu de formation\n';
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
        `${aidantCsv.region};${aidantCsv.nomPrenom};${aidantCsv.formation};${aidantCsv.charte};${aidantCsv.identifiantConnexion};${aidantCsv.numeroTelephone};${aidantCsv.todo};${aidantCsv.qui};${aidantCsv.compteCree};${aidantCsv.commentaires};${aidantCsv.lieuDeFormation}`
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
          genereFichierCsvAvecUnNombreDeColonnesInsuffisantes()
        )
      ).rejects.toThrowError(
        new Error(
          "Le fichier doit contenir les colones suivantes 'Région;nom;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;lieu de formation'."
        )
      );
    });

    it.each([
      'region;nom;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;lieu de formation\n',
      'Région;name;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;lieu de formation\n',
      'Région;nom;furmation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;lieu de formation\n',
      'Région;nom;furmation;chorte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;lieu de formation\n',
      'Région;nom;furmation;chorte;mule;telephone;TO DO;qui;Compte Créé ?;commentaires;lieu de formation\n',
      'Région;nom;furmation;chorte;mule;talephone;TO DO;qui;Compte Créé ?;commentaires;lieu de formation\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;qui;Compte Créé ?;commentaires;lieu de formation\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;quoi;Compte Créé ?;commentaires;lieu de formation\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;quoi;Compte;commentaires;lieu de formation\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;quoi;Compte;comment;lieu de formation\n',
      'Région;nom;furmation;chorte;mule;talephone;TO ;quoi;Compte;comment;lie\n',
    ])('Avec les bons noms de colonnes dans l’entête', async (enteteCSV) => {
      await expect(() =>
        initialiseCreationEspacesAidants(entrepots, busEvenement, enteteCSV)
      ).rejects.toThrowError(
        new Error(
          "Le fichier doit contenir les colones suivantes 'Région;nom;formation;charte;mail;telephone;TO DO;qui;Compte Créé ?;commentaires;lieu de formation'."
        )
      );
    });
  });

  describe('En vue de la création d’un futur espace Aidant', () => {
    describe('Dans le cas où charte ou formation ne sont pas OK', () => {
      const importAidantMailDemandeDevenirAidantEnvoyeAttendu = (
        aidantCSV: AidantCSV
      ): TraitementCreationEspaceAidant => {
        return {
          email: aidantCSV.identifiantConnexion,
          nomPrenom: aidantCSV.nomPrenom,
          telephone: aidantCSV.numeroTelephone,
          status: 'demande-devenir-aidant-envoyee',
          region: aidantCSV.region,
          charte: aidantCSV.charte,
          formation: aidantCSV.formation,
          qui: 'MAC',
          todo: 'Passer la formation et /ou la charte à OK pour finaliser la création de l’espace Aidant',
          commentaires:
            'En attente de la formation et / ou de la charte pour finaliser la création l’espace Aidant',
          compteCree: 'non',
          lieuDeFormation: '',
        };
      };
      it('Crée une demande devenir aidant', async () => {
        const entrepotAidant = entrepots.demandesDevenirAidant();
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
          genereFichierCsv([aidantCSV])
        );

        expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
          demandesDevenirAidant: [
            importAidantMailDemandeDevenirAidantEnvoyeAttendu(aidantCSV),
          ],
          mailsCreationEspaceAidantEnvoyes: [],
          mailsCreationEspaceAidantEnAttente: [],
        });
        const aidant = await entrepotAidant.rechercheDemandeEnCoursParMail(
          'jean.dupont@mail.com'
        );
        expect(aidant).toStrictEqual<DemandeDevenirAidant>({
          nom: 'Dupont',
          identifiant: expect.any(String),
          date: FournisseurHorloge.maintenant(),
          prenom: 'Jean',
          mail: 'jean.dupont@mail.com',
          departement: { nom: "Côte-d'Or", code: '21', codeRegion: '27' },
          statut: StatutDemande.EN_COURS,
        });
      });

      describe('Pour le cas des DROM-COM', () => {
        it('Prend en compte le lieu de formation pour la création de la demande devenir Aidant', async () => {
          const aidantCSV = unConstructeurAidantCSV()
            .charteOK()
            .enRegion('DROM COM')
            .auLieuDeFormation('Nouméa')
            .construis();

          await initialiseCreationEspacesAidants(
            entrepots,
            busEvenement,
            genereFichierCsv([aidantCSV])
          );

          expect(busEvenement.evenementRecu).toStrictEqual({
            corps: {
              date: FournisseurHorloge.maintenant(),
              departement: 'Collectivité de Nouvelle-Calédonie',
              identifiantDemande: expect.any(String),
            },
            date: FournisseurHorloge.maintenant(),
            identifiant: expect.any(String),
            type: 'DEMANDE_DEVENIR_AIDANT_CREEE',
          });
        });
      });
    });

    describe('Dans le cas où la charte et la formation sont OK', () => {
      const importAidantMailDemandeDevenirAidantEnvoyeAttendu = (
        aidantCSV: AidantCSV
      ): TraitementCreationEspaceAidant => {
        return {
          email: aidantCSV.identifiantConnexion,
          nomPrenom: aidantCSV.nomPrenom,
          telephone: aidantCSV.numeroTelephone,
          status: 'email-creation-espace-aidant-envoyé',
          region: aidantCSV.region,
          charte: aidantCSV.charte,
          formation: aidantCSV.formation,
          qui: 'MAC',
          todo: 'RAS',
          commentaires:
            'La demande devenir Aidant ainsi que le mail de création de l’espace Aidant ont été pris en compte.',
          compteCree: 'non',
          lieuDeFormation: '',
        };
      };
      it('Crée une demande devenir Aidant', async () => {
        const entrepotAidant = entrepots.demandesDevenirAidant();
        const aidantCSV = unConstructeurAidantCSV()
          .charteOK()
          .formationOK()
          .avecUnTelephone('123')
          .avecUnEmail('jean.dupont@mail.com')
          .avecLeNom('Jean Dupont')
          .enRegion('ARA')
          .construis();

        const resultat = await initialiseCreationEspacesAidants(
          entrepots,
          busEvenement,
          genereFichierCsv([aidantCSV])
        );

        expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
          demandesDevenirAidant: [],
          mailsCreationEspaceAidantEnvoyes: [
            importAidantMailDemandeDevenirAidantEnvoyeAttendu(aidantCSV),
          ],
          mailsCreationEspaceAidantEnAttente: [],
        });
        const aidant = await entrepotAidant.rechercheDemandeEnCoursParMail(
          'jean.dupont@mail.com'
        );
        expect(aidant).toStrictEqual<DemandeDevenirAidant>({
          nom: 'Dupont',
          identifiant: expect.any(String),
          date: FournisseurHorloge.maintenant(),
          prenom: 'Jean',
          mail: 'jean.dupont@mail.com',
          departement: { nom: 'Rhône', code: '69', codeRegion: '84' },
          statut: StatutDemande.EN_COURS,
        });
      });
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
        status: demandeEnAttente
          ? 'demande-en-attente'
          : 'email-creation-espace-aidant-envoyé',
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
        lieuDeFormation: '',
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
        genereFichierCsv([aidantCSV])
      );

      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        demandesDevenirAidant: [],
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
        genereFichierCsv([aidantCSV])
      );

      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        demandesDevenirAidant: [],
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
        genereFichierCsv([aidantCSV])
      );

      expect(resultat).toStrictEqual<ResultatCreationEspacesAidants>({
        demandesDevenirAidant: [],
        mailsCreationEspaceAidantEnvoyes: [],
        mailsCreationEspaceAidantEnAttente: [
          importAidantMailEnvoyeAttendu(aidantCSV, true),
        ],
      });
      expect(busEvenement.evenementRecu).toBeUndefined();
    });
  });

  it("Gère les demandes devenir Aidant à partir d'un fichier", async () => {
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

    expect(aidantsImportes.mailsCreationEspaceAidantEnvoyes).toHaveLength(5);
    expect(aidantsImportes.demandesDevenirAidant).toHaveLength(4);
    expect(aidantsImportes.mailsCreationEspaceAidantEnAttente).toHaveLength(0);
  });

  it('Mets en attente les Aidants pour lesquels la formation ou la charte sont KO', async () => {
    const aidantsAImporter = fs.readFileSync(
      './test/administration/aidants/espace-aidant/beta_testeur.csv',
      {
        encoding: 'utf-8',
      }
    );
    const aidantsAImporter2 = fs.readFileSync(
      './test/administration/aidants/espace-aidant/beta_testeur_2.csv',
      {
        encoding: 'utf-8',
      }
    );
    await initialiseCreationEspacesAidants(
      entrepots,
      new BusEvenementDeTest(),
      aidantsAImporter
    );
    const aidantsImportes = await initialiseCreationEspacesAidants(
      entrepots,
      new BusEvenementDeTest(),
      aidantsAImporter2
    );

    expect(aidantsImportes.mailsCreationEspaceAidantEnvoyes).toHaveLength(2);
    expect(aidantsImportes.demandesDevenirAidant).toHaveLength(0);
    expect(aidantsImportes.mailsCreationEspaceAidantEnAttente).toHaveLength(2);
  });
});
