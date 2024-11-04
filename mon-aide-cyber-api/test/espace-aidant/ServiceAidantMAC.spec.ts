import { describe, expect, it } from 'vitest';
import { EntrepotAidantMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import crypto from 'crypto';
import { Aidant } from '../../src/espace-aidant/Aidant';
import { unServiceAidant } from '../../src/espace-aidant/ServiceAidantMAC';
import { unAidant } from '../espace-aidant/constructeurs/constructeurAidant';
import { AidantDTO } from '../../src/espace-aidant/ServiceAidant';

describe('Service Aidant', () => {
  describe('Recherche par mail', () => {
    it("Retourne l'aidant correspondant au mail donné", async () => {
      const mailAidant = 'aidant@mail.tld';
      const aidant: Aidant = unAidant()
        .avecUnNomPrenom('Jean Dujardin')
        .avecUnIdentifiantDeConnexion(mailAidant)
        .construis();
      const entrepotAidant = new EntrepotAidantMemoire();
      await entrepotAidant.persiste(aidant);

      const aidantCherche: AidantDTO | undefined =
        await unServiceAidant(entrepotAidant).rechercheParMail(mailAidant);

      expect(aidantCherche).toStrictEqual<AidantDTO>({
        identifiant: aidant.identifiant,
        email: aidant.identifiantConnexion,
        nomUsage: 'Jean D.',
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
        email: martin.identifiantConnexion,
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
});
