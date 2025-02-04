import { beforeEach, describe, expect, it } from 'vitest';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { adaptateurUUID } from '../../../src/infrastructure/adaptateurs/adaptateurUUID';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { BusCommandeTest } from '../../infrastructure/bus/BusCommandeTest';
import { BusCommande } from '../../../src/domaine/commande';
import {
  DemandeDevenirAidant,
  StatutDemande,
} from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  CapteurSagaDemandeAidantCreeEspaceAidant,
  DemandeDevenirAidantEspaceAidantCree,
} from '../../../src/gestion-demandes/devenir-aidant/CapteurSagaDemandeAidantCreeEspaceAidant';
import { unConstructeurDeServices } from '../../constructeurs/constructeurServices';
import { Utilisateur } from '../../../src/authentification/Utilisateur';
import { EntiteAidant } from '../../../src/espace-aidant/Aidant';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';

describe('Capteur de saga pour créer un espace Aidant correspondant à une demande', () => {
  let busEvenementDeTest = new BusEvenementDeTest();
  let entrepots = new EntrepotsMemoire();
  let busCommande: BusCommande = new BusCommandeTest();

  beforeEach(() => {
    busEvenementDeTest = new BusEvenementDeTest();
    entrepots = new EntrepotsMemoire();
    busCommande = new BusCommandeMAC(
      entrepots,
      busEvenementDeTest,
      new AdaptateurEnvoiMailMemoire(),
      unConstructeurDeServices(entrepots.aidants())
    );
  });

  it('Crée un compte utilisateur', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-11-01T22:34:26'))
    );
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail('jean.dupont@email.com')
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const identifiantUtilisateur = crypto.randomUUID();
    adaptateurUUID.genereUUID = () => identifiantUtilisateur;

    await new CapteurSagaDemandeAidantCreeEspaceAidant(
      entrepots,
      busCommande,
      busEvenementDeTest
    ).execute({
      idDemande: demande.identifiant,
      motDePasse: 'toto12345',
      type: 'SagaDemandeAidantEspaceAidant',
    });

    const utilisateur: Utilisateur = await entrepots
      .utilisateurs()
      .lis(identifiantUtilisateur);
    expect(utilisateur).toStrictEqual<Utilisateur>({
      dateSignatureCGU: FournisseurHorloge.maintenant(),
      identifiant: identifiantUtilisateur,
      identifiantConnexion: 'jean.dupont@email.com',
      nomPrenom: `${demande.prenom} ${demande.nom}`,
      motDePasse: 'toto12345',
    });
  });

  it('Prend en compte la date de signature de la charte depuis la demande', async () => {
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail('jean.dupont@email.com')
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);

    FournisseurHorlogeDeTest.initialise(new Date());
    await new CapteurSagaDemandeAidantCreeEspaceAidant(
      entrepots,
      busCommande,
      busEvenementDeTest
    ).execute({
      idDemande: demande.identifiant,
      motDePasse: 'toto12345',
      type: 'SagaDemandeAidantEspaceAidant',
    });

    const aidant = (await entrepots.aidants().tous())[0];
    expect(aidant.dateSignatureCharte).toStrictEqual(demande.date);
  });

  it('La demande a été traitée', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const demande = unConstructeurDeDemandeDevenirAidant().construis();
    await entrepots.demandesDevenirAidant().persiste(demande);

    await new CapteurSagaDemandeAidantCreeEspaceAidant(
      entrepots,
      busCommande,
      busEvenementDeTest
    ).execute({
      idDemande: demande.identifiant,
      motDePasse: 'un-mot-de-passe',
      type: 'SagaDemandeAidantEspaceAidant',
    });

    expect(
      await entrepots.demandesDevenirAidant().lis(demande.identifiant)
    ).toStrictEqual<DemandeDevenirAidant>({
      identifiant: demande.identifiant,
      date: demande.date,
      nom: demande.nom,
      prenom: demande.prenom,
      mail: demande.mail,
      departement: demande.departement,
      statut: StatutDemande.TRAITEE,
    });
  });

  it("Publie l'événement DEMANDE_DEVENIR_AIDANT_FINALISEE", async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const demande = unConstructeurDeDemandeDevenirAidant().construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    adaptateurUUID.genereUUID = () => 'c00ba882-579e-4cea-9a83-3dfefe1081f4';

    await new CapteurSagaDemandeAidantCreeEspaceAidant(
      entrepots,
      busCommande,
      busEvenementDeTest
    ).execute({
      idDemande: demande.identifiant,
      motDePasse: 'un-mot-de-passe',
      type: 'SagaDemandeAidantEspaceAidant',
    });

    expect(
      busEvenementDeTest.consommateursTestes.get(
        'DEMANDE_DEVENIR_AIDANT_ESPACE_AIDANT_CREE'
      )?.[0].evenementConsomme
    ).toStrictEqual<DemandeDevenirAidantEspaceAidantCree>({
      type: 'DEMANDE_DEVENIR_AIDANT_ESPACE_AIDANT_CREE',
      identifiant: expect.any(String),
      date: FournisseurHorloge.maintenant(),
      corps: {
        idDemande: demande.identifiant,
        idAidant: 'c00ba882-579e-4cea-9a83-3dfefe1081f4',
      },
    });
  });

  it('Prend en compte la date de signature des CGU à la date effective de la finalisation', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-01-31T10:00:00'))
    );
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail('jean.dupont@email.com')
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);

    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-03-29T10:00:00'))
    );
    await new CapteurSagaDemandeAidantCreeEspaceAidant(
      entrepots,
      busCommande,
      busEvenementDeTest
    ).execute({
      idDemande: demande.identifiant,
      motDePasse: 'Toto123',
      type: 'SagaDemandeAidantEspaceAidant',
    });

    const aidant = (await entrepots.aidants().tous())[0];
    expect(aidant.dateSignatureCGU).toStrictEqual(
      FournisseurHorloge.maintenant()
    );
  });

  describe('Dans le cadre de la mise en place des profils Aidants / Utilisateurs inscrits à partir du 31/01/2025', () => {
    it("Prends en compte les informations de l'entité", async () => {
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail('jean.dupont@email.com')
        .avecUneEntite('Association')
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);

      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-01-31T11:15'))
      );
      await new CapteurSagaDemandeAidantCreeEspaceAidant(
        entrepots,
        busCommande,
        busEvenementDeTest
      ).execute({
        idDemande: demande.identifiant,
        motDePasse: 'toto12345',
        type: 'SagaDemandeAidantEspaceAidant',
      });

      expect(
        (await entrepots.demandesDevenirAidant().lis(demande.identifiant))
          .statut
      ).toStrictEqual(StatutDemande.TRAITEE);
      const aidant = (await entrepots.aidants().tous())[0];
      expect(aidant.entite).toStrictEqual<EntiteAidant>({
        nom: demande.entite!.nom!,
        siret: demande.entite!.siret!,
        type: demande.entite!.type,
      });
    });

    it("Remonte une erreur si toutes les informations de l'entité de l'Aidant ne sont pas fournies", async () => {
      const demande = unConstructeurDeDemandeDevenirAidant()
        .pourUneDemandeEnAttenteAdhesion()
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);

      const execution = new CapteurSagaDemandeAidantCreeEspaceAidant(
        entrepots,
        busCommande,
        busEvenementDeTest
      ).execute({
        idDemande: demande.identifiant,
        motDePasse: 'toto12345',
        type: 'SagaDemandeAidantEspaceAidant',
      });

      expect(execution).rejects.toThrowError(
        "Les informations de l'entité de l'Aidant doivent être fournies"
      );
    });

    it("Ne crée pas d'utilisateur à partir du 31/01/2025", async () => {
      adaptateurEnvironnement.nouveauParcoursDevenirAidant = () =>
        '2025-01-31T00:00';
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail('jean.dupont@email.com')
        .avecUneEntite('Association')
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);

      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-01-31T11:15'))
      );
      await new CapteurSagaDemandeAidantCreeEspaceAidant(
        entrepots,
        busCommande,
        busEvenementDeTest
      ).execute({
        idDemande: demande.identifiant,
        motDePasse: 'toto12345',
        type: 'SagaDemandeAidantEspaceAidant',
      });

      expect(await entrepots.utilisateurs().tous()).toHaveLength(0);
    });

    it('Prend en compte la date de signature des CGU à la date de la demande', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-01-31T10:00:00'))
      );
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail('jean.dupont@email.com')
        .avecUneEntite('ServiceEtat')
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);

      await new CapteurSagaDemandeAidantCreeEspaceAidant(
        entrepots,
        busCommande,
        busEvenementDeTest
      ).execute({
        idDemande: demande.identifiant,
        type: 'SagaDemandeAidantEspaceAidant',
      });

      const aidant = (await entrepots.aidants().tous())[0];
      expect(aidant.dateSignatureCGU).toStrictEqual(demande.date);
    });
  });
});
