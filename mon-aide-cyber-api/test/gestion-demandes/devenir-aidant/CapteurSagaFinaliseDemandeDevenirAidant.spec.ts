import { beforeEach, describe, expect, it } from 'vitest';
import { Aidant } from '../../../src/authentification/Aidant';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { ServiceDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/ServiceDevenirAidant';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  CapteurSagaFinaliseDemandeDevenirAidant,
  DemandeDevenirAidantFinalisee,
} from '../../../src/gestion-demandes/devenir-aidant/CapteurSagaFinaliseDemandeDevenirAidant';
import { unServiceAidant } from '../../../src/authentification/ServiceAidantMAC';
import { FauxServiceDeChiffrement } from '../../infrastructure/securite/FauxServiceDeChiffrement';
import { adaptateurCorpsMessage } from '../../../src/gestion-demandes/devenir-aidant/adaptateurCorpsMessage';
import { adaptateurUUID } from '../../../src/infrastructure/adaptateurs/adaptateurUUID';
import { adaptateurServiceChiffrement } from '../../../src/infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { BusCommande } from '../../../src/domaine/commande';

describe('Capteur de commande pour finaliser la demande devenir Aidant', () => {
  const busEvenement = new BusEvenementDeTest();
  const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
  let entrepots = new EntrepotsMemoire();
  let busCommande: BusCommande;
  let serviceDevenirAidant: ServiceDevenirAidant;

  beforeEach(() => {
    entrepots = new EntrepotsMemoire();
    busCommande = new BusCommandeMAC(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      { aidant: unServiceAidant(entrepots.aidants()) }
    );
    serviceDevenirAidant = new ServiceDevenirAidant(
      entrepots.demandesDevenirAidant()
    );
  });

  it('Finalise la demande en créant le compte Aidant', async () => {
    const demande = unConstructeurDeDemandeDevenirAidant().construis();
    await entrepots.demandesDevenirAidant().persiste(demande);

    const demandeFinalisee = await new CapteurSagaFinaliseDemandeDevenirAidant(
      busCommande,
      serviceDevenirAidant,
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

  it('ne peut finaliser une demande inexistante', async () => {
    const demandeFinalisee = await new CapteurSagaFinaliseDemandeDevenirAidant(
      busCommande,
      serviceDevenirAidant,
      adaptateurEnvoiMail,
      adaptateurServiceChiffrement()
    ).execute({
      mail: 'mail@noix.fr',
      type: 'CommandeFinaliseDemandeDevenirAidant',
    });

    expect(await entrepots.aidants().tous()).toHaveLength(0);
    expect(demandeFinalisee).toBeUndefined();
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
        busCommande,
        serviceDevenirAidant,
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
  });
});
