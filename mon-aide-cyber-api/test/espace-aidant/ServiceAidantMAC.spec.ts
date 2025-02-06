import { describe, expect, it } from 'vitest';
import { EntrepotAidantMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import crypto from 'crypto';
import { Aidant } from '../../src/espace-aidant/Aidant';
import { unServiceAidant } from '../../src/espace-aidant/ServiceAidantMAC';
import { AidantDTO } from '../../src/espace-aidant/ServiceAidant';
import { unAidant } from '../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';
import { AdaptateurEnvoiMailMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';
import { adaptateurCorpsMessage } from '../../src/espace-aidant/adaptateurCorpsMessage';
import { gironde } from '../../src/gestion-demandes/departements';
import { adaptateurEnvironnement } from '../../src/adaptateurs/adaptateurEnvironnement';
import { adaptateursEnvironnementDeTest } from '../adaptateurs/adaptateursEnvironnementDeTest';

describe('Service Aidant', () => {
  describe('Recherche par mail', () => {
    it("Retourne l'aidant correspondant au mail donné", async () => {
      const mailAidant = 'aidant@mail.tld';
      const aidant: Aidant = unAidant()
        .avecUnNomPrenom('Jean Dujardin')
        .avecUnEmail(mailAidant)
        .construis();
      const entrepotAidant = new EntrepotAidantMemoire();
      await entrepotAidant.persiste(aidant);

      const aidantCherche: AidantDTO | undefined =
        await unServiceAidant(entrepotAidant).rechercheParMail(mailAidant);

      expect(aidantCherche).toStrictEqual<AidantDTO>({
        identifiant: aidant.identifiant,
        email: aidant.email,
        nomUsage: 'Jean D.',
        dateSignatureCGU: aidant.dateSignatureCGU!,
        nomComplet: 'Jean Dujardin',
      });
    });

    it("Retourne undefined si l'aidant n'est pas trouvé", async () => {
      const entrepotAidant = new EntrepotAidantMemoire();

      const aidantCherche =
        await unServiceAidant(entrepotAidant).rechercheParMail(
          'aidant@mail.tld'
        );

      expect(aidantCherche).toStrictEqual(undefined);
    });
  });

  describe('Recherche par identifiant', () => {
    it("Retourne l'Aidant par son identifiant", async () => {
      const jean = unAidant().avecUnNomPrenom('Jean').construis();
      const martin = unAidant().avecUnNomPrenom('Martin Dupont').construis();
      const entrepot = new EntrepotAidantMemoire();
      await entrepot.persiste(jean);
      await entrepot.persiste(martin);

      const aidantRetourne = await unServiceAidant(entrepot).parIdentifiant(
        martin.identifiant
      );

      expect(aidantRetourne).toStrictEqual<AidantDTO>({
        nomUsage: 'Martin D.',
        identifiant: martin.identifiant,
        email: martin.email,
        dateSignatureCGU: martin.dateSignatureCGU!,
        nomComplet: 'Martin Dupont',
      });
    });

    it("Retourne undefined si l'aidant n'est pas trouvé", async () => {
      const entrepotAidant = new EntrepotAidantMemoire();

      const aidantCherche = await unServiceAidant(
        entrepotAidant
      ).parIdentifiant(crypto.randomUUID());

      expect(aidantCherche).toStrictEqual(undefined);
    });
  });

  describe("Valide le profil de l'Aidant", () => {
    it('Envoie le mail de confirmation à un Aidant sans association pour le moment', async () => {
      adaptateurCorpsMessage.confirmationProfilAidantSansAssociation = () => ({
        genereCorpsMessage: () => 'Bonjour le monde!',
      });
      const entrepotAidant = new EntrepotAidantMemoire();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const jean = unAidant()
        .avecUnNomPrenom('Jean')
        .avecUnEmail('jean.dupont@mail.com')
        .construis();
      await entrepotAidant.persiste(jean);

      await unServiceAidant(entrepotAidant).valideProfilAidant(
        jean.identifiant,
        {
          entite: {
            type: 'Association',
          },
        },
        adaptateurEnvoiMail
      );

      expect(
        adaptateurEnvoiMail.aEteEnvoyeA(
          'jean.dupont@mail.com',
          'Bonjour le monde!'
        )
      ).toBe(true);
    });

    it('Envoie le mail de confirmation en copie au COT', async () => {
      adaptateurCorpsMessage.confirmationProfilAidantSansAssociation = () => ({
        genereCorpsMessage: () => 'Bonjour le monde!',
      });
      const entrepotAidant = new EntrepotAidantMemoire();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const jean = unAidant()
        .avecUnNomPrenom('Jean')
        .avecUnEmail('jean.dupont@mail.com')
        .ayantPourDepartements([gironde])
        .construis();

      await entrepotAidant.persiste(jean);

      await unServiceAidant(entrepotAidant).valideProfilAidant(
        jean.identifiant,
        {
          entite: {
            type: 'Association',
          },
        },
        adaptateurEnvoiMail
      );

      expect(
        adaptateurEnvoiMail.aEteEnvoyeEnCopieA(
          'cot@email.com',
          'Bonjour le monde!'
        )
      ).toBe(true);
    });

    it('Envoie le mail de confirmation en copie à MAC si l‘Aidant n‘a pas de départements', async () => {
      adaptateurEnvironnement.messagerie = () =>
        adaptateursEnvironnementDeTest.messagerie();

      adaptateurCorpsMessage.confirmationProfilAidantSansAssociation = () => ({
        genereCorpsMessage: () => 'Bonjour le monde!',
      });
      const entrepotAidant = new EntrepotAidantMemoire();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const jean = unAidant()
        .avecUnNomPrenom('Jean')
        .avecUnEmail('jean.dupont@mail.com')
        .construis();

      await entrepotAidant.persiste(jean);

      await unServiceAidant(entrepotAidant).valideProfilAidant(
        jean.identifiant,
        {
          entite: {
            type: 'Association',
          },
        },
        adaptateurEnvoiMail
      );

      expect(
        adaptateurEnvoiMail.aEteEnvoyeEnCopieA(
          'mac@email.com',
          'Bonjour le monde!'
        )
      ).toBe(true);
    });

    it("N'envoie pas le mail de confirmation si l'Aidant a une association", async () => {
      adaptateurCorpsMessage.confirmationProfilAidantSansAssociation = () => ({
        genereCorpsMessage: () => 'Bonjour le monde!',
      });
      const entrepotAidant = new EntrepotAidantMemoire();
      const adaptateurEnvoiMail = new AdaptateurEnvoiMailMemoire();
      const jean = unAidant()
        .avecUnNomPrenom('Jean')
        .avecUnEmail('jean.dupont@mail.com')
        .construis();
      await entrepotAidant.persiste(jean);

      await unServiceAidant(entrepotAidant).valideProfilAidant(
        jean.identifiant,
        {
          entite: {
            nom: 'UNE_ASSO',
            siret: '12345',
            type: 'Association',
          },
        },
        adaptateurEnvoiMail
      );

      expect(adaptateurEnvoiMail.mailNonEnvoye()).toBe(true);
    });
  });
});
