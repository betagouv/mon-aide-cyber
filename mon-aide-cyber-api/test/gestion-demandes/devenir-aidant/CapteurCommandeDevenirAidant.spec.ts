import { beforeEach, describe, expect, it } from 'vitest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { DemandeDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import { CapteurCommandeDevenirAidant } from '../../../src/gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import {
  Departement,
  departements,
} from '../../../src/gestion-demandes/departements';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateurCorpsMessage } from '../../../src/gestion-demandes/devenir-aidant/adaptateurCorpsMessage';

describe('Capteur de commande devenir aidant', () => {
  const annuaireCot = () => ({
    rechercheEmailParDepartement: (__departement: Departement) =>
      'cot@email.com',
  });

  it('Créé la demande', async () => {
    FournisseurHorlogeDeTest.initialise(
      new Date(Date.parse('2024-08-01T14:45:17+01:00'))
    );

    const demandeDevenirAidant = await new CapteurCommandeDevenirAidant(
      new EntrepotsMemoire(),
      new AdaptateurEnvoiMailMemoire(),
      annuaireCot
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
        new AdaptateurEnvoiMailMemoire(),
        annuaireCot
      ).execute({
        departement: departements[0],
        mail: 'email',
        nom: 'nom',
        prenom: 'prenom',
        type: 'CommandeDevenirAidant',
      })
    ).rejects.toThrowError('Une demande pour ce compte existe déjà');
  });

  describe('Effectue la mise en relation', () => {
    beforeEach(
      () =>
        (adaptateurCorpsMessage.demandeDevenirAidant = () => ({
          genereCorpsMessage: () => 'Bonjour le monde!',
        }))
    );
    it("En envoyant le mail récapitulatif à l'Aidant", async () => {
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();

      await new CapteurCommandeDevenirAidant(
        new EntrepotsMemoire(),
        adaptateurEnvoiMail,
        annuaireCot
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

    it('En envoyant le mail récapitulatif en copie au COT', async () => {
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();

      await new CapteurCommandeDevenirAidant(
        new EntrepotsMemoire(),
        adaptateurEnvoiMail,
        () => ({
          rechercheEmailParDepartement: (__departement) =>
            'hauts-de-france@ssi.gouv.fr',
        })
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

    it('En envoyant le mail récapitulatif en copie invisible à MonAideCyber', async () => {
      adaptateurEnvironnement.messagerie = () => ({
        emailMAC: () => 'mac@email.com',
        expediteurMAC: () => 'expéditeur',
        clefAPI: () => 'clef',
      });

      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();

      await new CapteurCommandeDevenirAidant(
        new EntrepotsMemoire(),
        adaptateurEnvoiMail,
        annuaireCot
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
  });
});
