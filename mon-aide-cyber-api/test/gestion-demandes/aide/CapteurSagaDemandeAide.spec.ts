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
import { Entrepots } from '../../../src/domaine/Entrepots';
import { BusEvenement } from '../../../src/domaine/BusEvenement';
import {
  FabriqueMiseEnRelation,
  FabriqueMiseEnRelationConcrete,
  MiseEnRelation,
} from '../../../src/gestion-demandes/aide/miseEnRelation';
import { UtilisateurMACDTO } from '../../../src/recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  unAidant,
  unUtilisateurInscrit,
} from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { MiseEnRelationDirecteAidant } from '../../../src/gestion-demandes/aide/MiseEnRelationDirecteAidant';
import { MiseEnRelationDirecteUtilisateurInscrit } from '../../../src/gestion-demandes/aide/MiseEnRelationDirecteUtilisateurInscrit';
import { MiseEnRelationParCritere } from '../../../src/gestion-demandes/aide/MiseEnRelationParCritere';

class FabriqueDeMiseEnRelationDeTest implements FabriqueMiseEnRelation {
  fabrique(_utilisateurMac: UtilisateurMACDTO | undefined): MiseEnRelation {
    return new MiseEnRelationDeTest();
  }
}

class MiseEnRelationDeTest implements MiseEnRelation {
  async execute(_demandeAide: DemandeAide): Promise<void> {
    return;
  }
}

const fabriqueCapteur = ({
  entrepots,
  busEvenement,
  busCommande,
  fabriqueMiseEnRelation,
}: {
  entrepots?: Entrepots;
  busEvenement?: BusEvenement;
  busCommande?: BusCommande;
  fabriqueMiseEnRelation?: FabriqueMiseEnRelation;
}): CapteurSagaDemandeAide => {
  const lesEntrepots = entrepots ?? new EntrepotsMemoire();
  const leBusEvenement = busEvenement ?? new BusEvenementDeTest();
  const envoiMail = new AdaptateurEnvoiMailMemoire();
  const laFabriqueDeMiseEnRelation =
    fabriqueMiseEnRelation ?? new FabriqueDeMiseEnRelationDeTest();
  return new CapteurSagaDemandeAide(
    busCommande ??
      new BusCommandeMAC(
        lesEntrepots,
        leBusEvenement,
        envoiMail,
        unConstructeurDeServices(lesEntrepots.aidants())
      ),
    leBusEvenement,
    new EntrepotUtilisateurMACMemoire({
      aidant: lesEntrepots.aidants(),
      utilisateurInscrit: lesEntrepots.utilisateursInscrits(),
    }),
    laFabriqueDeMiseEnRelation
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
      it("La mise en relation n'est pas exécutée", async () => {
        const entrepotsMemoire = new EntrepotsMemoire();
        const busEvenement = new BusEvenementDeTest();
        const busCommande = new BusCommandeTest({
          CommandeRechercheAideParEmail:
            new CapteurCommandeRechercheDemandeAideParEmail(entrepotsMemoire),
          CommandeCreerAide: new CapteurCommandeCreerAideQuiEchoue(),
        });
        const fabriqueDeMiseEnRelationDeTest =
          new FabriqueDeMiseEnRelationDeTest();
        let miseEnRelationAEteExecutee = false;
        fabriqueDeMiseEnRelationDeTest.fabrique = () => ({
          execute: async () => {
            miseEnRelationAEteExecutee = true;
          },
        });

        const capteur = fabriqueCapteur({
          busEvenement,
          busCommande,
          fabriqueMiseEnRelation: fabriqueDeMiseEnRelationDeTest,
        });

        await expect(() =>
          capteur.execute({
            type: 'SagaDemandeValidationCGUAide',
            cguValidees: true,
            email: 'jean-dupont@email.com',
            departement: gironde,
          })
        ).rejects.toThrowError("Votre demande d'aide n'a pu aboutir");
        expect(miseEnRelationAEteExecutee).toBe(false);
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

  describe('Mise en relation directe', () => {
    describe('Lorsque un email utilisateur est fourni', () => {
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
          (entrepots.demandesAides() as EntrepotAideMemoire)
            .rechercheParMailFaite
        ).toBe(false);
        await expect(() => promesse).rejects.toThrowError(
          'L’adresse email de l’Aidant ou du prestataire n’est pas référencée. Veuillez entrer une adresse valide et réessayer.'
        );
      });
    });

    describe('Avec un Aidant', () => {
      it('Exécute la mise en relation', async () => {
        const entrepots = new EntrepotsMemoire();
        const fabriqueDeMiseEnRelationEcoutee =
          new FabriqueDeMiseEnRelationEcoutee();
        const capteur = fabriqueCapteur({
          entrepots,
          fabriqueMiseEnRelation: fabriqueDeMiseEnRelationEcoutee,
        });
        const aidant = unAidant().construis();
        await entrepots.aidants().persiste(aidant);

        await capteur.execute({
          type: 'SagaDemandeAide',
          cguValidees: true,
          email: 'user@example.com',
          departement: gironde,
          relationUtilisateur: aidant.email,
        });

        expect(
          fabriqueDeMiseEnRelationEcoutee.miseEnRelationPromise
        ).not.toBeUndefined();
        expect(
          fabriqueDeMiseEnRelationEcoutee.miseEnRelationPromise
        ).toBeInstanceOf(MiseEnRelationDirecteAidant);
      });
    });

    describe('Avec un Utilisateur Inscrit', () => {
      it('Exécute la mise en relation', async () => {
        const entrepots = new EntrepotsMemoire();
        const fabriqueDeMiseEnRelationEcoutee =
          new FabriqueDeMiseEnRelationEcoutee();
        const capteur = fabriqueCapteur({
          entrepots,
          fabriqueMiseEnRelation: fabriqueDeMiseEnRelationEcoutee,
        });
        const utilisateurInscrit = unUtilisateurInscrit().construis();
        await entrepots.utilisateursInscrits().persiste(utilisateurInscrit);

        await capteur.execute({
          type: 'SagaDemandeAide',
          cguValidees: true,
          email: 'user@example.com',
          departement: gironde,
          relationUtilisateur: utilisateurInscrit.email,
        });

        expect(
          fabriqueDeMiseEnRelationEcoutee.miseEnRelationPromise
        ).not.toBeUndefined();
        expect(
          fabriqueDeMiseEnRelationEcoutee.miseEnRelationPromise
        ).toBeInstanceOf(MiseEnRelationDirecteUtilisateurInscrit);
      });
    });

    describe('Par critère', () => {
      it('Exécute la mise en relation', async () => {
        const entrepots = new EntrepotsMemoire();
        const fabriqueDeMiseEnRelationEcoutee =
          new FabriqueDeMiseEnRelationEcoutee();
        const capteur = fabriqueCapteur({
          entrepots,
          fabriqueMiseEnRelation: fabriqueDeMiseEnRelationEcoutee,
        });

        await capteur.execute({
          type: 'SagaDemandeAide',
          cguValidees: true,
          email: 'user@example.com',
          departement: gironde,
        });

        expect(
          fabriqueDeMiseEnRelationEcoutee.miseEnRelationPromise
        ).not.toBeUndefined();
        expect(
          fabriqueDeMiseEnRelationEcoutee.miseEnRelationPromise
        ).toBeInstanceOf(MiseEnRelationParCritere);
      });
    });
  });
});

class FabriqueDeMiseEnRelationEcoutee extends FabriqueMiseEnRelationConcrete {
  public miseEnRelationPromise: MiseEnRelation | undefined = undefined;

  constructor() {
    super(new AdaptateurEnvoiMailMemoire(), {
      rechercheEmailParDepartement: (__departement: Departement) =>
        'cot@email.com',
    });
  }

  fabrique(utilisateurMac: UtilisateurMACDTO | undefined): MiseEnRelation {
    this.miseEnRelationPromise = super.fabrique(utilisateurMac);
    return this.miseEnRelationPromise;
  }
}

class CapteurCommandeCreerAideQuiEchoue
  implements CapteurCommande<CommandeCreerDemandeAide, any>
{
  execute(_commande: CommandeCreerDemandeAide): Promise<any> {
    throw new Error('une erreur est survenue');
  }
}
