import { beforeEach, describe, expect, it } from 'vitest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  DemandeDevenirAidant,
  StatutDemande,
} from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  CapteurCommandeDevenirAidant,
  DemandeDevenirAidantCreee,
} from '../../../src/gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import {
  Departement,
  departements,
} from '../../../src/gestion-demandes/departements';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateurCorpsMessage } from '../../../src/gestion-demandes/devenir-aidant/adaptateurCorpsMessage';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { unAidant } from '../../espace-aidant/constructeurs/constructeurAidant';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { unServiceAidant } from '../../../src/espace-aidant/ServiceAidantMAC';

describe('Capteur de commande devenir aidant', () => {
  const annuaireCot = () => ({
    rechercheEmailParDepartement: (__departement: Departement) =>
      'cot@email.com',
  });

  it('Créé la demande', async () => {
    const entrepots = new EntrepotsMemoire();
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-08-01T14:45:17+01:00'))
    );

    const demandeDevenirAidant = await new CapteurCommandeDevenirAidant(
      entrepots,
      new BusEvenementDeTest(),
      new AdaptateurEnvoiMailMemoire(),
      annuaireCot,
      unServiceAidant(entrepots.aidants())
    ).execute({
      departement: departements[1],
      mail: 'email',
      nom: 'nom',
      prenom: 'prenom',
      type: 'CommandeDevenirAidant',
    });

    expect(demandeDevenirAidant).toStrictEqual<DemandeDevenirAidant>({
      departement: { nom: 'Aisne', code: '2', codeRegion: '32' },
      mail: 'email',
      nom: 'nom',
      prenom: 'prenom',
      identifiant: expect.any(String),
      date: new Date(Date.parse('2024-08-01T14:45:17+01:00')),
      statut: StatutDemande.EN_COURS,
    });
  });

  it('Publie l’événement DemandeDevenirAidantCréée', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-08-01T14:45:17+01:00'))
    );
    const busEvenementDeTest = new BusEvenementDeTest();
    const entrepots = new EntrepotsMemoire();

    const demandeDevenirAidant = await new CapteurCommandeDevenirAidant(
      entrepots,
      busEvenementDeTest,
      new AdaptateurEnvoiMailMemoire(),
      annuaireCot,
      unServiceAidant(entrepots.aidants())
    ).execute({
      departement: departements[1],
      mail: 'email',
      nom: 'nom',
      prenom: 'prenom',
      type: 'CommandeDevenirAidant',
    });

    expect(
      busEvenementDeTest.evenementRecu
    ).toStrictEqual<DemandeDevenirAidantCreee>({
      identifiant: demandeDevenirAidant.identifiant,
      type: 'DEMANDE_DEVENIR_AIDANT_CREEE',
      date: FournisseurHorloge.maintenant(),
      corps: {
        date: FournisseurHorloge.maintenant(),
        identifiantDemande: demandeDevenirAidant.identifiant,
        departement: demandeDevenirAidant.departement.nom,
      },
    });
  });

  it('Créé la demande avec un mail unique', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-08-01T14:45:17+01:00'))
    );
    const entrepots = new EntrepotsMemoire();
    await entrepots
      .demandesDevenirAidant()
      .persiste(
        unConstructeurDeDemandeDevenirAidant().avecUnMail('email').construis()
      );

    await expect(() =>
      new CapteurCommandeDevenirAidant(
        entrepots,
        new BusEvenementDeTest(),
        new AdaptateurEnvoiMailMemoire(),
        annuaireCot,
        unServiceAidant(entrepots.aidants())
      ).execute({
        departement: departements[0],
        mail: 'email',
        nom: 'nom',
        prenom: 'prenom',
        type: 'CommandeDevenirAidant',
      })
    ).rejects.toThrowError('Une demande existe déjà');
  });

  it('Empêche la création de la demande si le mail est associé à un aidant', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-08-01T14:45:17+01:00'))
    );

    const entrepots = new EntrepotsMemoire();

    const aidant = unAidant().construis();
    await entrepots.aidants().persiste(aidant);

    await expect(() =>
      new CapteurCommandeDevenirAidant(
        entrepots,
        new BusEvenementDeTest(),
        new AdaptateurEnvoiMailMemoire(),
        annuaireCot,
        unServiceAidant(entrepots.aidants())
      ).execute({
        departement: departements[0],
        mail: aidant.email,
        nom: 'nom',
        prenom: 'prenom',
        type: 'CommandeDevenirAidant',
      })
    ).rejects.toThrowError('Cette adresse électronique est déja utilisée');
  });

  describe('Lors de la mise en relation', () => {
    beforeEach(
      () =>
        (adaptateurCorpsMessage.demandeDevenirAidant = () => ({
          genereCorpsMessage: () => 'Bonjour le monde!',
        }))
    );
    it("Envoie le mail récapitulatif à l'Aidant", async () => {
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const entrepots = new EntrepotsMemoire();

      await new CapteurCommandeDevenirAidant(
        entrepots,
        new BusEvenementDeTest(),
        adaptateurEnvoiMail,
        annuaireCot,
        unServiceAidant(entrepots.aidants())
      ).execute({
        departement: departements[1],
        mail: 'email',
        nom: 'nom',
        prenom: 'prenom',
        type: 'CommandeDevenirAidant',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA('email', 'Bonjour le monde!')
      ).toBe(true);
    });

    it('Envoie le mail récapitulatif en copie au COT', async () => {
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const entrepots = new EntrepotsMemoire();

      await new CapteurCommandeDevenirAidant(
        entrepots,
        new BusEvenementDeTest(),
        adaptateurEnvoiMail,
        () => ({
          rechercheEmailParDepartement: (__departement) =>
            'hauts-de-france@ssi.gouv.fr',
        }),
        unServiceAidant(entrepots.aidants())
      ).execute({
        departement: departements[1],
        mail: 'email',
        nom: 'nom',
        prenom: 'prenom',
        type: 'CommandeDevenirAidant',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeEnCopieA(
          'hauts-de-france@ssi.gouv.fr',
          'Bonjour le monde!'
        )
      ).toBe(true);
    });

    it('Envoie le mail récapitulatif en copie invisible à MonAideCyber', async () => {
      adaptateurEnvironnement.messagerie = () =>
        adaptateursEnvironnementDeTest.messagerie();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const entrepots = new EntrepotsMemoire();

      await new CapteurCommandeDevenirAidant(
        entrepots,
        new BusEvenementDeTest(),
        adaptateurEnvoiMail,
        annuaireCot,
        unServiceAidant(entrepots.aidants())
      ).execute({
        departement: departements[1],
        mail: 'email',
        nom: 'nom',
        prenom: 'prenom',
        type: 'CommandeDevenirAidant',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeEnCopieInvisibleA(
          'mac@email.com',
          'Bonjour le monde!'
        )
      ).toBe(true);
    });

    it('Remonte une erreur en cas d’échec de l’envoi du mail de mise en relation', async () => {
      adaptateurEnvironnement.messagerie = () =>
        adaptateursEnvironnementDeTest.messagerie();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      adaptateurEnvoiMail.genereErreur();
      const entrepots = new EntrepotsMemoire();

      expect(
        new CapteurCommandeDevenirAidant(
          entrepots,
          new BusEvenementDeTest(),
          adaptateurEnvoiMail,
          annuaireCot,
          unServiceAidant(entrepots.aidants())
        ).execute({
          departement: departements[1],
          mail: 'email',
          nom: 'nom',
          prenom: 'prenom',
          type: 'CommandeDevenirAidant',
        })
      ).rejects.toThrowError('Le mail de mise en relation n’a pu être remis.');
    });
  });
});
