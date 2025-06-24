import { assert, beforeEach, describe, expect, it } from 'vitest';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  CapteurSagaActivationCompteAidant,
  ErreurEnvoiMailCreationCompteAidant,
  MailCompteAidantActiveEnvoye,
  MailCompteAidantActiveNonEnvoye,
} from '../../../src/gestion-demandes/devenir-aidant/CapteurSagaActivationCompteAidant';
import { adaptateurCorpsMessage } from '../../../src/gestion-demandes/devenir-aidant/adaptateurCorpsMessage';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { BusCommandeTest } from '../../infrastructure/bus/BusCommandeTest';
import { StatutDemande } from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { unConstructeurDeServices } from '../../constructeurs/constructeurServices';
import { unAdaptateurRechercheEntreprise } from '../../constructeurs/constructeurAdaptateurRechercheEntrepriseEnDur';
import { BusCommande } from '../../../src/domaine/commande';

describe('Capteur de saga pour activer le compte Aidant', () => {
  let adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
  let entrepots = new EntrepotsMemoire();
  let busEvenement = new BusEvenementDeTest();
  let busCommande: BusCommande = new BusCommandeTest();

  beforeEach(() => {
    adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    entrepots = new EntrepotsMemoire();
    busEvenement = new BusEvenementDeTest();
    busCommande = new BusCommandeMAC(
      entrepots,
      busEvenement,
      new AdaptateurEnvoiMailMemoire(),
      unConstructeurDeServices(entrepots.aidants()),
      unAdaptateurRechercheEntreprise().construis()
    );
    process.env.URL_MAC = 'http://localhost:8081';
    adaptateurCorpsMessage.compteAidantActive = () => ({
      genereCorpsMessage: (nomPrenom: string) => `Bonjour ${nomPrenom} !`,
    });
  });

  it('Active le compte Aidant', async () => {
    const mailDeLAidant = 'jean.dupont@mail.com';
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail(mailDeLAidant)
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);

    await new CapteurSagaActivationCompteAidant(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      busCommande
    ).execute({ type: 'SagaActivationCompteAidant', mail: mailDeLAidant });

    const demandeTraitee = await entrepots
      .demandesDevenirAidant()
      .lis(demande.identifiant);
    expect(demandeTraitee.statut).toBe(StatutDemande.TRAITEE);
  });

  it('Envoie le mail à l’Aidant pour lui signifier l’activation de son compte', async () => {
    const mailDeLAidant = 'jean.dupont@mail.com';
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail(mailDeLAidant)
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);

    await new CapteurSagaActivationCompteAidant(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      busCommande
    ).execute({
      type: 'SagaActivationCompteAidant',
      mail: mailDeLAidant,
    });

    expect(
      adaptateurEnvoiMail.aEteEnvoyeA(
        mailDeLAidant,
        `Bonjour ${demande.prenom} ${demande.nom} !`
      )
    ).toBe(true);
  });

  it('Ne peut envoyer le mail pour une demande inexistante', async () => {
    const demandeFinalisee = await new CapteurSagaActivationCompteAidant(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      new BusCommandeTest()
    ).execute({
      mail: 'mail@noix.fr',
      type: 'SagaActivationCompteAidant',
    });

    expect(demandeFinalisee).toBeUndefined();
    expect(
      busEvenement.consommateursTestes.get(
        'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE'
      )?.[0].evenementConsomme
    ).toBeUndefined();
    expect(adaptateurEnvoiMail.mailNonEnvoye()).toBe(true);
  });

  it('Ne peut envoyer le mail pour une demande déjà traitée', async () => {
    const demande = unConstructeurDeDemandeDevenirAidant()
      .traitee()
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const demandeFinalisee = await new CapteurSagaActivationCompteAidant(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      busCommande
    ).execute({
      mail: demande.mail,
      type: 'SagaActivationCompteAidant',
    });

    expect(demandeFinalisee).toBeUndefined();
    expect(
      busEvenement.consommateursTestes.get(
        'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE'
      )?.[0].evenementConsomme
    ).toBeUndefined();
    expect(adaptateurEnvoiMail.mailNonEnvoye()).toBe(true);
  });

  it('Publie l’événement MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-07-07T13:44:38'))
    );
    const demande = unConstructeurDeDemandeDevenirAidant().construis();
    await entrepots.demandesDevenirAidant().persiste(demande);

    await new CapteurSagaActivationCompteAidant(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      busCommande
    ).execute({
      mail: demande.mail,
      type: 'SagaActivationCompteAidant',
    });

    expect(
      busEvenement.consommateursTestes.get(
        'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE'
      )?.[0].evenementConsomme
    ).toStrictEqual<MailCompteAidantActiveEnvoye>({
      identifiant: expect.any(String),
      type: 'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantDemande: demande.identifiant,
      },
    });
  });

  it('Publie l’événement MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE en cas d’erreur d’envoi de mail', async () => {
    const mailDeLAidant = 'jean.dupont@mail.com';
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail(mailDeLAidant)
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    adaptateurEnvoiMail.genereErreur();
    try {
      await new CapteurSagaActivationCompteAidant(
        entrepots,
        busEvenement,
        adaptateurEnvoiMail,
        busCommande
      ).execute({
        type: 'SagaActivationCompteAidant',
        mail: mailDeLAidant,
      });
      assert.fail('Le test aurait dû échouer');
    } catch (_erreur) {
      expect(
        busEvenement.consommateursTestes.get(
          'MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE'
        )?.[0].evenementConsomme
      ).toStrictEqual<MailCompteAidantActiveNonEnvoye>({
        identifiant: expect.any(String),
        type: 'MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiantDemande: demande.identifiant,
        },
      });
    }
  });

  it('Retourne une erreur en cas d’erreur d’envoi de mail', async () => {
    const mailDeLAidant = 'jean.dupont@mail.com';
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail(mailDeLAidant)
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    adaptateurEnvoiMail.genereErreur();

    expect(
      new CapteurSagaActivationCompteAidant(
        entrepots,
        busEvenement,
        adaptateurEnvoiMail,
        busCommande
      ).execute({
        type: 'SagaActivationCompteAidant',
        mail: mailDeLAidant,
      })
    ).rejects.toStrictEqual(
      new ErreurEnvoiMailCreationCompteAidant(
        `Une erreur est survenue lors de l’envoi du mail pour la demande de "${demande.mail}"`
      )
    );
  });

  it('Ne publie pas l’événement MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE si l’envoi de mail a échoué', async () => {
    const mailDeLAidant = 'jean.dupont@mail.com';
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail(mailDeLAidant)
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    adaptateurEnvoiMail.genereErreur();

    try {
      await new CapteurSagaActivationCompteAidant(
        entrepots,
        busEvenement,
        adaptateurEnvoiMail,
        busCommande
      ).execute({
        type: 'SagaActivationCompteAidant',
        mail: mailDeLAidant,
      });
      assert.fail('Le test aurait dû échouer');
    } catch (_erreur) {
      expect(
        busEvenement.consommateursTestes.get(
          'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE'
        )?.[0].evenementConsomme
      ).toBeUndefined();
    }
  });
});
