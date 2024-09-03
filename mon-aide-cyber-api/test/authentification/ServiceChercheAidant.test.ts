import { describe, expect, it } from 'vitest';
import { EntrepotAidantMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unAidant } from './constructeurs/constructeurAidant';
import { unServiceAidant } from '../../src/authentification/ServiceAidantMAC';
import { Aidant } from '../../src/authentification/Aidant';
import { AidantDTO } from '../../src/authentification/ServiceAidant';

describe('Service Aidant', () => {
  describe('Recherche par mail', () => {
    it("Retourne l'aidant correspondant au mail donné", async () => {
      const mailAidant = 'aidant@mail.tld';
      const aidant: Aidant = unAidant()
        .avecUnIdentifiantDeConnexion(mailAidant)
        .construis();
      const entrepotAidant = new EntrepotAidantMemoire();
      await entrepotAidant.persiste(aidant);

      const aidantCherche: AidantDTO | undefined =
        await unServiceAidant(entrepotAidant).rechercheParMail(mailAidant);

      expect(aidantCherche).toStrictEqual<AidantDTO>({
        identifiant: aidant.identifiant,
        identifiantConnexion: aidant.identifiantConnexion,
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
});
