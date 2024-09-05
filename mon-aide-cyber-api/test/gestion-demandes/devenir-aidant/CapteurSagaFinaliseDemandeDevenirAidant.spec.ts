import { beforeEach, describe, expect, it } from 'vitest';
import { Aidant } from '../../../src/authentification/Aidant';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  CapteurSagaFinaliseDemandeDevenirAidant,
  DemandeDevenirAidantFinalisee,
  EvenementDemandeDevenirAidantFinalisee,
} from '../../../src/gestion-demandes/devenir-aidant/CapteurSagaFinaliseDemandeDevenirAidant';
import { unServiceAidant } from '../../../src/authentification/ServiceAidantMAC';
import { FauxServiceDeChiffrement } from '../../infrastructure/securite/FauxServiceDeChiffrement';
import { adaptateurCorpsMessage } from '../../../src/gestion-demandes/devenir-aidant/adaptateurCorpsMessage';
import { adaptateurUUID } from '../../../src/infrastructure/adaptateurs/adaptateurUUID';
import { adaptateurServiceChiffrement } from '../../../src/infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { BusCommande } from '../../../src/domaine/commande';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';

describe('Capteur de commande pour finaliser la demande devenir Aidant', () => {
  const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
  let entrepots = new EntrepotsMemoire();
  let busCommande: BusCommande;
  let busEvenement = new BusEvenementDeTest();

  beforeEach(() => {
    entrepots = new EntrepotsMemoire();
    busEvenement = new BusEvenementDeTest();
    busCommande = new BusCommandeMAC(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      { aidant: unServiceAidant(entrepots.aidants()) }
    );
  });

  it('Finalise la demande en créant le compte Aidant', async () => {
    const demande = unConstructeurDeDemandeDevenirAidant().construis();
    await entrepots.demandesDevenirAidant().persiste(demande);

    const demandeFinalisee = await new CapteurSagaFinaliseDemandeDevenirAidant(
      entrepots,
      busCommande,
      busEvenement,
      adaptateurEnvoiMail,
      adaptateurServiceChiffrement()
    ).execute({
      mail: demande.mail,
      type: 'CommandeFinaliseDemandeDevenirAidant',
    });

    const aidantCree = await entrepots
      .aidants()
      .rechercheParIdentifiantDeConnexion(demande.mail);
    expect(aidantCree).toStrictEqual<Aidant>({
      identifiant: expect.any(String),
      identifiantConnexion: demande.mail,
      nomPrenom: `${demande.prenom} ${demande.nom}`,
      motDePasse: expect.any(String),
      dateSignatureCGU: demande.date,
    });
    expect(demandeFinalisee).toStrictEqual<DemandeDevenirAidantFinalisee>({
      identifiantAidant: aidantCree.identifiant,
    });
  });

  it('Ne peut finaliser une demande inexistante', async () => {
    const demandeFinalisee = await new CapteurSagaFinaliseDemandeDevenirAidant(
      entrepots,
      busCommande,
      busEvenement,
      adaptateurEnvoiMail,
      adaptateurServiceChiffrement()
    ).execute({
      mail: 'mail@noix.fr',
      type: 'CommandeFinaliseDemandeDevenirAidant',
    });

    expect(await entrepots.aidants().tous()).toHaveLength(0);
    expect(demandeFinalisee).toBeUndefined();
  });

  it('Publie l’événement DEMANDE_DEVENIR_AIDANT_FINALISEE', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-07-07T13:44:38'))
    );
    const demande = unConstructeurDeDemandeDevenirAidant().construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const identifiantAidant = '41e26c1c-3c42-414d-a656-604324a333e1';
    adaptateurUUID.genereUUID = () => identifiantAidant;

    await new CapteurSagaFinaliseDemandeDevenirAidant(
      entrepots,
      busCommande,
      busEvenement,
      adaptateurEnvoiMail,
      adaptateurServiceChiffrement()
    ).execute({
      mail: demande.mail,
      type: 'CommandeFinaliseDemandeDevenirAidant',
    });

    expect(
      busEvenement.consommateursTestes.get(
        'DEMANDE_DEVENIR_AIDANT_FINALISEE'
      )?.[0].evenementConsomme
    ).toStrictEqual<EvenementDemandeDevenirAidantFinalisee>({
      identifiant: expect.any(String),
      type: 'DEMANDE_DEVENIR_AIDANT_FINALISEE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantDemande: demande.identifiant,
        identifiantAidant,
      },
    });
  });

  it('Finalise la demande même si la publication de l’événement DEMANDE_DEVENIR_AIDANT_FINALISEE a échoué', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-07-07T13:44:38'))
    );
    const demande = unConstructeurDeDemandeDevenirAidant().construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const busEvenement = new BusEvenementDeTest();
    busEvenement.genereUneErreur();

    const demandeFinalisee = await new CapteurSagaFinaliseDemandeDevenirAidant(
      entrepots,
      busCommande,
      busEvenement,
      adaptateurEnvoiMail,
      adaptateurServiceChiffrement()
    ).execute({
      mail: demande.mail,
      type: 'CommandeFinaliseDemandeDevenirAidant',
    });

    expect(demandeFinalisee).toStrictEqual<DemandeDevenirAidantFinalisee>({
      identifiantAidant: (await entrepots.aidants().tous())[0].identifiant,
    });
  });

  describe('En ce qui concerne l’envoi du mail', async () => {
    beforeEach(() => {
      process.env.URL_MAC = 'http://localhost:8081';
      adaptateurCorpsMessage.finaliseDemandeDevenirAidant = () => ({
        genereCorpsMessage: (nomPrenom: string, url: string) =>
          `Bonjour ${nomPrenom}, ${url}`,
      });
    });

    it('Envoie le mail', async () => {
      const mailDeLAidant = 'jean.dupont@mail.com';
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail(mailDeLAidant)
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);
      const idAidant = '41e26c1c-3c42-414d-a656-604324a333e0';
      adaptateurUUID.genereUUID = () => idAidant;

      await new CapteurSagaFinaliseDemandeDevenirAidant(
        entrepots,
        busCommande,
        busEvenement,
        adaptateurEnvoiMail,
        new FauxServiceDeChiffrement(new Map([[idAidant, 'aaa']]))
      ).execute({
        type: 'CommandeFinaliseDemandeDevenirAidant',
        mail: mailDeLAidant,
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          mailDeLAidant,
          `Bonjour ${demande.prenom} ${demande.nom}, http://localhost:8081/demandes/devenir-aidant/finalise?token=aaa`
        )
      ).toBe(true);
    });

    it('Finalise la demande en cas d’erreur d’envoi de mail', async () => {
      const mailDeLAidant = 'jean.dupont@mail.com';
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail(mailDeLAidant)
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      adaptateurEnvoiMail.genereErreur();

      const demandeFinalisee =
        await new CapteurSagaFinaliseDemandeDevenirAidant(
          entrepots,
          busCommande,
          busEvenement,
          adaptateurEnvoiMail,
          adaptateurServiceChiffrement()
        ).execute({
          type: 'CommandeFinaliseDemandeDevenirAidant',
          mail: mailDeLAidant,
        });

      expect(demandeFinalisee).toStrictEqual<DemandeDevenirAidantFinalisee>({
        identifiantAidant: (await entrepots.aidants().tous())[0].identifiant,
      });
    });

    it('Ne publie pas l’événement DEMANDE_DEVENIR_AIDANT_FINALISEE si l’envoi de mail a échoué', async () => {
      const mailDeLAidant = 'jean.dupont@mail.com';
      const demande = unConstructeurDeDemandeDevenirAidant()
        .avecUnMail(mailDeLAidant)
        .construis();
      await entrepots.demandesDevenirAidant().persiste(demande);
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      adaptateurEnvoiMail.genereErreur();

      await new CapteurSagaFinaliseDemandeDevenirAidant(
        entrepots,
        busCommande,
        busEvenement,
        adaptateurEnvoiMail,
        adaptateurServiceChiffrement()
      ).execute({
        type: 'CommandeFinaliseDemandeDevenirAidant',
        mail: mailDeLAidant,
      });

      expect(
        busEvenement.consommateursTestes.get(
          'DEMANDE_DEVENIR_AIDANT_FINALISEE'
        )?.[0].evenementConsomme
      ).toBeUndefined();
    });
  });
});
