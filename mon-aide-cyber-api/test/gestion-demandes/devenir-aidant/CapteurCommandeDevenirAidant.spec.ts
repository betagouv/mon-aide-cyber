import { beforeEach, describe, expect, it } from 'vitest';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import {
  DemandeDevenirAidant,
  StatutDemande,
} from '../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  CapteurCommandeDevenirAidant,
  CommandeDevenirAidant,
  DemandeDevenirAidantCreee,
  DemandeDevenirAidantModifiee,
} from '../../../src/gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';
import { unConstructeurDeDemandeDevenirAidant } from './constructeurDeDemandeDevenirAidant';
import {
  ardennes,
  Departement,
  departements,
} from '../../../src/gestion-demandes/departements';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateurCorpsMessage } from '../../../src/gestion-demandes/devenir-aidant/adaptateurCorpsMessage';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { unServiceAidant } from '../../../src/espace-aidant/ServiceAidantMAC';
import { unAidant } from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';

const uneCommandeDevenirAidant = (commande?: {
  departement?: Departement;
  mail?: string;
  nom?: string;
  prenom?: string;
  entite?: {
    nom?: string;
    siret?: string;
    type?: 'ServicePublic' | 'Association';
  };
}): CommandeDevenirAidant => ({
  departement: commande?.departement ?? ardennes,
  mail: commande?.mail ?? 'email',
  nom: commande?.nom ?? 'nom',
  prenom: commande?.prenom ?? 'prenom',
  entite: {
    nom: commande?.entite?.nom ?? 'Beta-Gouv',
    siret: commande?.entite?.siret ?? '1234567890',
    type: commande?.entite?.type ?? 'ServicePublic',
  },
  type: 'CommandeDevenirAidant',
});

describe('Capteur de commande demande devenir aidant', () => {
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
    ).execute(
      uneCommandeDevenirAidant({
        departement: departements[1],
        entite: { type: 'ServicePublic', nom: 'DINUM', siret: '1234567890' },
      })
    );

    expect(demandeDevenirAidant).toStrictEqual<DemandeDevenirAidant>({
      departement: { nom: 'Aisne', code: '02', codeRegion: '32' },
      mail: 'email',
      nom: 'nom',
      prenom: 'prenom',
      identifiant: expect.any(String),
      date: new Date(Date.parse('2024-08-01T14:45:17+01:00')),
      statut: StatutDemande.EN_COURS,
      entite: {
        type: 'ServicePublic',
        nom: 'DINUM',
        siret: '1234567890',
      },
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
    ).execute(
      uneCommandeDevenirAidant({
        departement: departements[1],
        entite: { type: 'ServicePublic', nom: 'DINUM', siret: '1234567890' },
      })
    );

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
        type: 'ServicePublic',
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
      ).execute(
        uneCommandeDevenirAidant({
          departement: departements[0],
          entite: { type: 'ServicePublic', nom: 'DINUM', siret: '1234567890' },
        })
      )
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
      ).execute(
        uneCommandeDevenirAidant({
          departement: departements[0],
          mail: aidant.email,
          entite: { type: 'ServicePublic', nom: 'DINUM', siret: '1234567890' },
        })
      )
    ).rejects.toThrowError('Cette adresse électronique est déja utilisée');
  });

  describe('Lors de la mise en relation', () => {
    it("Envoie le mail récapitulatif à l'Aidant", async () => {
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const entrepots = new EntrepotsMemoire();

      await new CapteurCommandeDevenirAidant(
        entrepots,
        new BusEvenementDeTest(),
        adaptateurEnvoiMail,
        annuaireCot,
        unServiceAidant(entrepots.aidants())
      ).execute(uneCommandeDevenirAidant());

      expect(
        adaptateurEnvoiMail.mailDeParticipationAUnAtelierEnvoye('email')
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
      ).execute(uneCommandeDevenirAidant());

      expect(
        adaptateurEnvoiMail.mailDeParticipationAUnAtelierEnvoye(
          'hauts-de-france@ssi.gouv.fr'
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
      ).execute(uneCommandeDevenirAidant());

      expect(
        adaptateurEnvoiMail.mailDeParticipationAUnAtelierEnvoye('mac@email.com')
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
        ).execute(uneCommandeDevenirAidant())
      ).rejects.toThrowError('Le mail de mise en relation n’a pu être remis.');
    });
  });

  describe('Dans le cadre de la mise en place des profils Aidants / Utilisateurs inscrits à partir du 31/01/2025', () => {
    beforeEach(() => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2025-01-31T14:00'))
      );
    });

    it('Crée la demande', async () => {
      const entrepots = new EntrepotsMemoire();

      const demandeDevenirAidant = await new CapteurCommandeDevenirAidant(
        entrepots,
        new BusEvenementDeTest(),
        new AdaptateurEnvoiMailMemoire(),
        annuaireCot,
        unServiceAidant(entrepots.aidants())
      ).execute(uneCommandeDevenirAidant());

      expect(demandeDevenirAidant).toStrictEqual<DemandeDevenirAidant>({
        departement: ardennes,
        mail: 'email',
        nom: 'nom',
        prenom: 'prenom',
        identifiant: expect.any(String),
        date: FournisseurHorloge.maintenant(),
        statut: StatutDemande.EN_COURS,
        entite: {
          nom: 'Beta-Gouv',
          siret: '1234567890',
          type: 'ServicePublic',
        },
      });
    });

    it('Publie l’événement DemandeDevenirAidantCréée', async () => {
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
        entite: {
          nom: 'Beta-Gouv',
          siret: '1234567890',
          type: 'ServicePublic',
        },
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
          type: 'ServicePublic',
        },
      });
    });

    describe("Dans le cas de mise à jour d'une demande existante", () => {
      adaptateurCorpsMessage.miseAJourDemandeDevenirAidant = () => ({
        genereCorpsMessage: () =>
          'Bonjour le monde! Ta demande a été mise à jour',
      });

      it('Met à jour la demande', async () => {
        const entrepots = new EntrepotsMemoire();
        await entrepots
          .demandesDevenirAidant()
          .persiste(
            unConstructeurDeDemandeDevenirAidant()
              .avecUnMail('email-existant@mail.com')
              .construis()
          );

        await new CapteurCommandeDevenirAidant(
          entrepots,
          new BusEvenementDeTest(),
          new AdaptateurEnvoiMailMemoire(),
          annuaireCot,
          unServiceAidant(entrepots.aidants())
        ).execute(
          uneCommandeDevenirAidant({
            departement: ardennes,
            mail: 'email-existant@mail.com',
          })
        );

        const demandes = await entrepots.demandesDevenirAidant().tous();
        expect(demandes).toHaveLength(1);
        expect(demandes[0]).toStrictEqual<DemandeDevenirAidant>({
          departement: ardennes,
          mail: 'email-existant@mail.com',
          nom: 'nom',
          prenom: 'prenom',
          identifiant: expect.any(String),
          date: FournisseurHorloge.maintenant(),
          statut: StatutDemande.EN_COURS,
          entite: {
            nom: 'Beta-Gouv',
            siret: '1234567890',
            type: 'ServicePublic',
          },
        });
      });

      it("Envoie le mail récapitulatif à l'Aidant", async () => {
        const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
        const entrepots = new EntrepotsMemoire();
        await entrepots
          .demandesDevenirAidant()
          .persiste(
            unConstructeurDeDemandeDevenirAidant()
              .avecUnMail('email-existant@mail.com')
              .construis()
          );

        await new CapteurCommandeDevenirAidant(
          entrepots,
          new BusEvenementDeTest(),
          adaptateurEnvoiMail,
          annuaireCot,
          unServiceAidant(entrepots.aidants())
        ).execute(
          uneCommandeDevenirAidant({
            departement: departements[1],
            mail: 'email-existant@mail.com',
          })
        );

        expect(
          adaptateurEnvoiMail.aEteEnvoyeA(
            'email-existant@mail.com',
            'Bonjour le monde! Ta demande a été mise à jour'
          )
        ).toBe(true);
        expect(
          adaptateurEnvoiMail.mailDeParticipationAUnAtelierEnvoye(
            'email-existant@mail.com'
          )
        ).toBe(false);
      });

      it('Publie l’événement DemandeDevenirAidantModifiée', async () => {
        const busEvenementDeTest = new BusEvenementDeTest();
        const entrepots = new EntrepotsMemoire();
        await entrepots
          .demandesDevenirAidant()
          .persiste(
            unConstructeurDeDemandeDevenirAidant()
              .avecUnMail('email-existant@mail.com')
              .construis()
          );

        const demandeDevenirAidant = await new CapteurCommandeDevenirAidant(
          entrepots,
          busEvenementDeTest,
          new AdaptateurEnvoiMailMemoire(),
          annuaireCot,
          unServiceAidant(entrepots.aidants())
        ).execute(
          uneCommandeDevenirAidant({
            departement: departements[1],
            mail: 'email-existant@mail.com',
          })
        );

        expect(
          busEvenementDeTest.evenementRecu
        ).toStrictEqual<DemandeDevenirAidantModifiee>({
          identifiant: demandeDevenirAidant.identifiant,
          type: 'DEMANDE_DEVENIR_AIDANT_MODIFIEE',
          date: FournisseurHorloge.maintenant(),
          corps: {
            date: FournisseurHorloge.maintenant(),
            identifiantDemande: demandeDevenirAidant.identifiant,
            departement: demandeDevenirAidant.departement.nom,
            type: 'ServicePublic',
          },
        });
      });
    });

    it('L’événement DemandeDevenirAidantModifiée est consommé', async () => {
      const busEvenementDeTest = new BusEvenementDeTest();
      const entrepots = new EntrepotsMemoire();
      await entrepots
        .demandesDevenirAidant()
        .persiste(
          unConstructeurDeDemandeDevenirAidant()
            .avecUnMail('email-existant@mail.com')
            .construis()
        );

      const demandeDevenirAidant = await new CapteurCommandeDevenirAidant(
        entrepots,
        busEvenementDeTest,
        new AdaptateurEnvoiMailMemoire(),
        annuaireCot,
        unServiceAidant(entrepots.aidants())
      ).execute(
        uneCommandeDevenirAidant({
          departement: departements[1],
          mail: 'email-existant@mail.com',
        })
      );

      expect(
        busEvenementDeTest.consommateursTestes.get(
          'DEMANDE_DEVENIR_AIDANT_MODIFIEE'
        )?.[0].evenementConsomme
      ).toStrictEqual<DemandeDevenirAidantModifiee>({
        identifiant: demandeDevenirAidant.identifiant,
        type: 'DEMANDE_DEVENIR_AIDANT_MODIFIEE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          date: FournisseurHorloge.maintenant(),
          identifiantDemande: demandeDevenirAidant.identifiant,
          departement: demandeDevenirAidant.departement.nom,
          type: 'ServicePublic',
        },
      });
    });
  });
});
