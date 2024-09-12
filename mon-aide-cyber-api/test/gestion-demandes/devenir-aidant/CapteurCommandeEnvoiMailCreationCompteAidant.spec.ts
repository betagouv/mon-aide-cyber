import { assert, beforeEach, describe, expect, it } from 'vitest';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  CapteurCommandeEnvoiMailCreationCompteAidant,
  ErreurEnvoiMailCreationCompteAidant,
  MailFinalisationCreationCompteAidantEnvoye,
  MailFinalisationCreationCompteAidantNonEnvoye,
} from '../../../src/gestion-demandes/devenir-aidant/CapteurCommandeEnvoiMailCreationCompteAidant';
import { FauxServiceDeChiffrement } from '../../infrastructure/securite/FauxServiceDeChiffrement';
import { adaptateurCorpsMessage } from '../../../src/gestion-demandes/devenir-aidant/adaptateurCorpsMessage';
import { adaptateurServiceChiffrement } from '../../../src/infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';

describe('Capteur de commande pour envoyer le mail de création de compte suite à la demande devenir Aidant', () => {
  let adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
  let entrepots = new EntrepotsMemoire();
  let busEvenement = new BusEvenementDeTest();

  beforeEach(() => {
    adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    entrepots = new EntrepotsMemoire();
    busEvenement = new BusEvenementDeTest();
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

    await new CapteurCommandeEnvoiMailCreationCompteAidant(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      new FauxServiceDeChiffrement(
        new Map([
          [
            Buffer.from(
              JSON.stringify({
                demande: demande.identifiant,
                mail: mailDeLAidant,
              }),
              'binary'
            ).toString('base64'),
            'aaa',
          ],
        ])
      )
    ).execute({
      type: 'CommandeEnvoiMailCreationCompteAidant',
      mail: mailDeLAidant,
    });

    expect(
      adaptateurEnvoiMail.aEteEnvoyeA(
        mailDeLAidant,
        `Bonjour ${demande.prenom} ${demande.nom}, http://localhost:8081/demandes/devenir-aidant/finalise?token=aaa`
      )
    ).toBe(true);
  });

  it('Ne peut envoyer le mail pour une demande inexistante', async () => {
    const demandeFinalisee =
      await new CapteurCommandeEnvoiMailCreationCompteAidant(
        entrepots,
        busEvenement,
        adaptateurEnvoiMail,
        adaptateurServiceChiffrement()
      ).execute({
        mail: 'mail@noix.fr',
        type: 'CommandeEnvoiMailCreationCompteAidant',
      });

    expect(demandeFinalisee).toBeUndefined();
    expect(
      busEvenement.consommateursTestes.get(
        'MAIL_CREATION_COMPTE_AIDANT_ENVOYE'
      )?.[0].evenementConsomme
    ).toBeUndefined();
    expect(adaptateurEnvoiMail.mailNonEnvoye()).toBe(true);
  });

  it('Ne peut envoyer le mail pour une demande déjà traitée', async () => {
    const demande = unConstructeurDeDemandeDevenirAidant()
      .traitee()
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const demandeFinalisee =
      await new CapteurCommandeEnvoiMailCreationCompteAidant(
        entrepots,
        busEvenement,
        adaptateurEnvoiMail,
        adaptateurServiceChiffrement()
      ).execute({
        mail: demande.mail,
        type: 'CommandeEnvoiMailCreationCompteAidant',
      });

    expect(demandeFinalisee).toBeUndefined();
    expect(
      busEvenement.consommateursTestes.get(
        'MAIL_CREATION_COMPTE_AIDANT_ENVOYE'
      )?.[0].evenementConsomme
    ).toBeUndefined();
    expect(adaptateurEnvoiMail.mailNonEnvoye()).toBe(true);
  });

  it('Publie l’événement MAIL_CREATION_COMPTE_AIDANT_ENVOYE', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-07-07T13:44:38'))
    );
    const demande = unConstructeurDeDemandeDevenirAidant().construis();
    await entrepots.demandesDevenirAidant().persiste(demande);

    await new CapteurCommandeEnvoiMailCreationCompteAidant(
      entrepots,
      busEvenement,
      adaptateurEnvoiMail,
      adaptateurServiceChiffrement()
    ).execute({
      mail: demande.mail,
      type: 'CommandeEnvoiMailCreationCompteAidant',
    });

    expect(
      busEvenement.consommateursTestes.get(
        'MAIL_CREATION_COMPTE_AIDANT_ENVOYE'
      )?.[0].evenementConsomme
    ).toStrictEqual<MailFinalisationCreationCompteAidantEnvoye>({
      identifiant: expect.any(String),
      type: 'MAIL_CREATION_COMPTE_AIDANT_ENVOYE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantDemande: demande.identifiant,
      },
    });
  });

  it('Publie l’événement MAIL_CREATION_COMPTE_AIDANT_NON_ENVOYE en cas d’erreur d’envoi de mail', async () => {
    const mailDeLAidant = 'jean.dupont@mail.com';
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail(mailDeLAidant)
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    adaptateurEnvoiMail.genereErreur();
    try {
      await new CapteurCommandeEnvoiMailCreationCompteAidant(
        entrepots,
        busEvenement,
        adaptateurEnvoiMail,
        adaptateurServiceChiffrement()
      ).execute({
        type: 'CommandeEnvoiMailCreationCompteAidant',
        mail: mailDeLAidant,
      });
      assert.fail('Le test aurait dû échouer');
    } catch (_erreur) {
      expect(
        busEvenement.consommateursTestes.get(
          'MAIL_CREATION_COMPTE_AIDANT_NON_ENVOYE'
        )?.[0].evenementConsomme
      ).toStrictEqual<MailFinalisationCreationCompteAidantNonEnvoye>({
        identifiant: expect.any(String),
        type: 'MAIL_CREATION_COMPTE_AIDANT_NON_ENVOYE',
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
      new CapteurCommandeEnvoiMailCreationCompteAidant(
        entrepots,
        busEvenement,
        adaptateurEnvoiMail,
        adaptateurServiceChiffrement()
      ).execute({
        type: 'CommandeEnvoiMailCreationCompteAidant',
        mail: mailDeLAidant,
      })
    ).rejects.toStrictEqual(
      new ErreurEnvoiMailCreationCompteAidant(
        `Une erreur est survenue lors de l’envoi du mail pour la demande de "${demande.mail}"`
      )
    );
  });

  it('Ne publie pas l’événement MAIL_CREATION_COMPTE_AIDANT_ENVOYE si l’envoi de mail a échoué', async () => {
    const mailDeLAidant = 'jean.dupont@mail.com';
    const demande = unConstructeurDeDemandeDevenirAidant()
      .avecUnMail(mailDeLAidant)
      .construis();
    await entrepots.demandesDevenirAidant().persiste(demande);
    const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
    adaptateurEnvoiMail.genereErreur();

    try {
      await new CapteurCommandeEnvoiMailCreationCompteAidant(
        entrepots,
        busEvenement,
        adaptateurEnvoiMail,
        adaptateurServiceChiffrement()
      ).execute({
        type: 'CommandeEnvoiMailCreationCompteAidant',
        mail: mailDeLAidant,
      });
      assert.fail('Le test aurait dû échouer');
    } catch (_erreur) {
      expect(
        busEvenement.consommateursTestes.get(
          'MAIL_CREATION_COMPTE_AIDANT_ENVOYE'
        )?.[0].evenementConsomme
      ).toBeUndefined();
    }
  });
});
