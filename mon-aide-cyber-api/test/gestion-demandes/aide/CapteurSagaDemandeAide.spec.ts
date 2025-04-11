import { beforeEach, describe, expect, it } from 'vitest';
import { EntrepotsMemoire } from '../../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurEnvoiMailMemoire } from '../../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import {
  CapteurSagaDemandeAide,
  DemandeAideCree,
} from '../../../src/gestion-demandes/aide/CapteurSagaDemandeAide';
import { BusCommandeMAC } from '../../../src/infrastructure/bus/BusCommandeMAC';
import { FournisseurHorlogeDeTest } from '../../infrastructure/horloge/FournisseurHorlogeDeTest';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import { BusCommandeTest } from '../../infrastructure/bus/BusCommandeTest';
import { BusCommande, CapteurCommande } from '../../../src/domaine/commande';
import { unConstructeurDeServices } from '../../constructeurs/constructeurServices';
import { adaptateursEnvironnementDeTest } from '../../adaptateurs/adaptateursEnvironnementDeTest';
import { adaptateursCorpsMessage } from '../../../src/gestion-demandes/aide/adaptateursCorpsMessage';
import { unAdaptateurDeCorpsDeMessage } from './ConstructeurAdaptateurDeCorpsDeMessage';
import {
  allier,
  Departement,
  gironde,
} from '../../../src/gestion-demandes/departements';
import {
  DemandeAide,
  RechercheDemandeAide,
} from '../../../src/gestion-demandes/aide/DemandeAide';
import { CapteurCommandeRechercheDemandeAideParEmail } from '../../../src/gestion-demandes/aide/CapteurCommandeRechercheDemandeAideParEmail';
import { CommandeCreerDemandeAide } from '../../../src/gestion-demandes/aide/CapteurCommandeCreerDemandeAide';
import { uneDemandeAide } from './ConstructeurDemandeAide';
import { FournisseurHorloge } from '../../../src/infrastructure/horloge/FournisseurHorloge';
import {
  EntrepotAideMemoire,
  EntrepotUtilisateurMACMemoire,
} from '../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import {
  unAidant,
  unUtilisateurInscrit,
} from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { Entrepots } from '../../../src/domaine/Entrepots';
import { BusEvenement } from '../../../src/domaine/BusEvenement';
import { AdaptateurEnvoiMail } from '../../../src/adaptateurs/AdaptateurEnvoiMail';

const cotParDefaut = {
  rechercheEmailParDepartement: (__departement: Departement) => 'cot@email.com',
};

const fabriqueCapteur = ({
  entrepots,
  busEvenement,
  adaptateurEnvoiMail,
  annuaireCOT,
  busCommande,
}: {
  entrepots?: Entrepots;
  busEvenement?: BusEvenement;
  adaptateurEnvoiMail?: AdaptateurEnvoiMail;
  annuaireCOT?: {
    rechercheEmailParDepartement: (departement: Departement) => string;
  };
  busCommande?: BusCommande;
}): CapteurSagaDemandeAide => {
  const lesEntrepots = entrepots ?? new EntrepotsMemoire();
  const leBusEvenement = busEvenement ?? new BusEvenementDeTest();
  const envoiMail = adaptateurEnvoiMail ?? new AdaptateurEnvoiMailMemoire();
  return new CapteurSagaDemandeAide(
    busCommande ??
      new BusCommandeMAC(
        lesEntrepots,
        leBusEvenement,
        envoiMail,
        unConstructeurDeServices(lesEntrepots.aidants())
      ),
    leBusEvenement,
    envoiMail,
    new EntrepotUtilisateurMACMemoire({
      aidant: lesEntrepots.aidants(),
      utilisateurInscrit: lesEntrepots.utilisateursInscrits(),
    }),
    () => annuaireCOT ?? cotParDefaut
  );
};

describe('Capteur saga demande de validation de CGU Aidé', () => {
  beforeEach(() => {
    adaptateursCorpsMessage.demande =
      unAdaptateurDeCorpsDeMessage().construis().demande;
    adaptateurEnvironnement.messagerie = () =>
      adaptateursEnvironnementDeTest.messagerie({
        emailMac: 'mac@email.com',
        copieMac: 'copie-mac@email.com',
      });
  });
  describe("Si l'Aidé est connu de MAC", () => {
    it('Mets à jour la demande d’aide', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const aide = uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          new Date(Date.parse('2025-01-31T14:42:00'))
        )
        .construis();
      const entrepots = new EntrepotsMemoire();
      await entrepots.demandesAides().persiste(aide);
      const capteur = fabriqueCapteur({ entrepots });

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: aide.email,
        departement: aide.departement,
        raisonSociale: 'beta-gouv',
      });

      const entrepotDemandeAide =
        entrepots.demandesAides() as EntrepotAideMemoire;
      expect(await entrepotDemandeAide.tous()).toHaveLength(1);
      expect(
        await entrepotDemandeAide.lis(aide.identifiant)
      ).toStrictEqual<DemandeAide>({
        email: aide.email,
        departement: aide.departement,
        identifiant: aide.identifiant,
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        raisonSociale: 'beta-gouv',
      });
    });

    it('Si l’utilisateur MAC en relation avec l‘Aidé n’est pas connu, on remonte une erreur', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const aide = uneDemandeAide()
        .avecUneDateDeSignatureDesCGU(
          new Date(Date.parse('2025-01-31T14:42:00'))
        )
        .construis();
      const entrepots = new EntrepotsMemoire();
      await entrepots.demandesAides().persiste(aide);
      const capteur = fabriqueCapteur({ entrepots });

      const promesse = capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: aide.email,
        departement: aide.departement,
        raisonSociale: 'beta-gouv',
        relationUtilisateur: 'aidanticonnu@yopmail.com',
      });

      await expect(() => promesse).rejects.toThrowError(
        'L’adresse email de l’Aidant ou du prestataire n’est pas référencée. Veuillez entrer une adresse valide et réessayer.'
      );
    });
  });

  describe("Si l'Aidé n'est pas connu de MAC", () => {
    it("Crée l'Aidé", async () => {
      const entrepots = new EntrepotsMemoire();
      const capteur = fabriqueCapteur({ entrepots });

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'un email',
        departement: allier,
      });

      expect(
        await entrepots.demandesAides().rechercheParEmail('un email')
      ).not.toBeUndefined();
    });

    it('Envoie un email de confirmation à l’Aidé', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00'))
      );
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const capteur = fabriqueCapteur({
        adaptateurEnvoiMail,
      });

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
      });

      expect(
        adaptateurEnvoiMail.confirmationDemandeAideAEteEnvoyeeA(
          'jean-dupont@email.com'
        )
      ).toBe(true);
    });

    it('Envoie un email de demande d’aide en copie à MAC', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00'))
      );
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const capteur = fabriqueCapteur({ adaptateurEnvoiMail });

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeEnCopieA(
          'copie-mac@email.com',
          'Bonjour une entité a fait une demande d’aide'
        )
      ).toBe(true);
    });

    it('Envoie un email de demande d’aide au COT de la région', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00'))
      );
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const annuaireCOT = {
        rechercheEmailParDepartement: (__departement: Departement) =>
          'gironde@ssi.gouv.fr',
      };
      const capteur = fabriqueCapteur({ annuaireCOT, adaptateurEnvoiMail });

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          'gironde@ssi.gouv.fr',
          'Bonjour une entité a fait une demande d’aide'
        )
      ).toBe(true);
    });

    it('Envoie un email de demande d’aide au COT en prenant en compte la relation existante avec un Aidant', async () => {
      adaptateursCorpsMessage.demande = unAdaptateurDeCorpsDeMessage()
        .recapitulatifDemandeAide(
          (_aide: DemandeAide, relationUtilisateur: string | undefined) =>
            `Bonjour une entité a fait une demande d’aide, relation Aidant : ${relationUtilisateur}`
        )
        .construis().demande;
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00'))
      );
      const entrepots = new EntrepotsMemoire();
      await entrepots
        .aidants()
        .persiste(
          unAidant().avecUnEmail('jean.dujardin@email.com').construis()
        );
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const capteur = fabriqueCapteur({ adaptateurEnvoiMail, entrepots });

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
        relationUtilisateur: 'jean.dujardin@email.com',
      });

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          'cot@email.com',
          `Bonjour une entité a fait une demande d’aide, relation Aidant : jean.dujardin@email.com`
        )
      ).toBe(true);
      expect(
        adaptateurEnvoiMail.aEteEnvoyeEnCopieA(
          'copie-mac@email.com',
          'Bonjour une entité a fait une demande d’aide, relation Aidant : jean.dujardin@email.com'
        )
      ).toBe(true);
    });

    it("Envoie un email de confirmation à l'Aidé en prenant en compte la relation existante avec un Aidant", async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-03-19T14:45:17+01:00'))
      );
      const entrepots = new EntrepotsMemoire();
      await entrepots
        .aidants()
        .persiste(
          unAidant().avecUnEmail('jean.dujardin@email.com').construis()
        );
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const capteur = fabriqueCapteur({ adaptateurEnvoiMail, entrepots });

      await capteur.execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
        raisonSociale: 'BetaGouv',
        relationUtilisateur: 'jean.dujardin@email.com',
      });

      expect(
        adaptateurEnvoiMail.confirmationDemandeAideAEteEnvoyeeA(
          'jean-dupont@email.com',
          'jean.dujardin@email.com'
        )
      ).toBe(true);
    });

    it("Publie l'évènement 'AIDE_CREE'", async () => {
      const maintenant = new Date();
      FournisseurHorlogeDeTest.initialise(maintenant);
      const entrepots = new EntrepotsMemoire();
      const busEvenement = new BusEvenementDeTest();

      await fabriqueCapteur({ entrepots, busEvenement }).execute({
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: true,
        email: 'jean-dupont@email.com',
        departement: gironde,
      });

      const aideRecu = (
        await (entrepots.demandesAides() as EntrepotAideMemoire).tous()
      )[0];
      expect(busEvenement.evenementRecu).toStrictEqual<DemandeAideCree>({
        identifiant: expect.any(String),
        type: 'AIDE_CREE',
        date: maintenant,
        corps: {
          identifiantAide: aideRecu.identifiant,
          departement: '33',
        },
      });
    });

    describe('Lorsque la validation des CGU a échoué', () => {
      it("N'envoie pas d'Email de confirmation à l'Aidé", async () => {
        const adaptateurEnvoieMail = new AdaptateurEnvoiMailMemoire();
        const entrepotsMemoire = new EntrepotsMemoire();
        const busEvenement = new BusEvenementDeTest();
        const busCommande = new BusCommandeTest({
          CommandeRechercheAideParEmail:
            new CapteurCommandeRechercheDemandeAideParEmail(entrepotsMemoire),
          CommandeCreerAide: new CapteurCommandeCreerAideQuiEchoue(),
        });
        const capteur = fabriqueCapteur({
          adaptateurEnvoiMail: adaptateurEnvoieMail,
          busEvenement,
          busCommande,
        });

        await expect(() =>
          capteur.execute({
            type: 'SagaDemandeValidationCGUAide',
            cguValidees: true,
            email: 'jean-dupont@email.com',
            departement: gironde,
          })
        ).rejects.toThrowError("Votre demande d'aide n'a pu aboutir");
        expect(adaptateurEnvoieMail.mailEnvoye()).toBe(false);
        expect(busEvenement.evenementRecu).toBeUndefined();
      });
    });
  });

  describe('Lorsque la demande d’Aide est incomplète', () => {
    it('Crée une nouvelle demande qui sera complète et met à jour l’Aidé', async () => {
      FournisseurHorlogeDeTest.initialise(new Date());
      const entrepots = new EntrepotsMemoire();
      const demandeIncomplete = uneDemandeAide().incomplete().construis();
      await entrepots.demandesAides().persiste(demandeIncomplete);
      const capteur = fabriqueCapteur({ entrepots });

      await capteur.execute({
        type: 'PeuImporte',
        cguValidees: true,
        email: demandeIncomplete.email,
        departement: gironde,
        raisonSociale: 'beta-gouv',
      });

      const demandeAideRecue = await entrepots
        .demandesAides()
        .rechercheParEmail(demandeIncomplete.email);
      expect(demandeAideRecue).toStrictEqual<RechercheDemandeAide>({
        demandeAide: {
          identifiant: expect.any(String),
          email: demandeIncomplete.email,
          dateSignatureCGU: FournisseurHorloge.maintenant(),
          raisonSociale: 'beta-gouv',
          departement: gironde,
        },
        etat: 'COMPLET',
      });
    });
  });

  describe('Lorsque un email utilisateur est fourni', () => {
    describe('Dans le cas d’un Utilisateur inscrit', () => {
      it("N’envoie pas de email au COT lorsqu'un Utilisateur Inscrit est donné en paramètre", async () => {
        const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
        const entrepots = new EntrepotsMemoire();
        await entrepots
          .utilisateursInscrits()
          .persiste(
            unUtilisateurInscrit()
              .avecUnEmail('jean.dupont@email.com')
              .construis()
          );
        const capteur = fabriqueCapteur({
          adaptateurEnvoiMail,
          entrepots,
        });

        await capteur.execute({
          type: 'SagaDemandeAide',
          cguValidees: true,
          email: 'user@example.com',
          departement: gironde,
          relationUtilisateur: 'jean.dupont@email.com',
        });

        expect(
          adaptateurEnvoiMail.aEteEnvoyeA(
            'cot@email.com',
            'Bonjour une entité a fait une demande d’aide'
          )
        ).toBe(false);
      });
    });

    it('Si l’utilisateur n’est pas connu, on remonte une erreur', async () => {
      const entrepots = new EntrepotsMemoire();
      const capteur = fabriqueCapteur({ entrepots });

      const promesse = capteur.execute({
        type: 'SagaDemandeAide',
        cguValidees: true,
        email: 'user@example.com',
        departement: gironde,
        relationUtilisateur: 'jean.dupont@email.com',
      });

      expect(
        (entrepots.demandesAides() as EntrepotAideMemoire).rechercheParMailFaite
      ).toBe(false);
      await expect(() => promesse).rejects.toThrowError(
        'L’adresse email de l’Aidant ou du prestataire n’est pas référencée. Veuillez entrer une adresse valide et réessayer.'
      );
    });
  });
});

class CapteurCommandeCreerAideQuiEchoue
  implements CapteurCommande<CommandeCreerDemandeAide, any>
{
  execute(_commande: CommandeCreerDemandeAide): Promise<any> {
    throw new Error('une erreur est survenue');
  }
}
