import { describe, expect, it } from 'vitest';
import { EntrepotAidantMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { unAidant } from './constructeurs/constructeurAidant';
import { ServiceChercheAidant } from '../../src/authentification/ServiceChercheAidant';

describe('Service de recherche aidant', () => {
  describe('Cherche par mail', () => {
    it("Retourne l'aidant si le mail est trouvé", async () => {
      const mailAidant = 'aidant@mail.tld';
      const aidantPersiste = unAidant()
        .avecUnIdentifiantDeConnexion(mailAidant)
        .construis();
      const entrepotAidant = new EntrepotAidantMemoire();
      await entrepotAidant.persiste(aidantPersiste);

      const aidantCherche = await new ServiceChercheAidant(
        entrepotAidant
      ).chercheParMail(mailAidant);

      expect(aidantCherche).toStrictEqual(aidantPersiste);
    });

    it("Retourne undefined si l'aidant n'est pas trouvé", async () => {
      const entrepotAidant = new EntrepotAidantMemoire();

      const aidantCherche = await new ServiceChercheAidant(
        entrepotAidant
      ).chercheParMail('aidant@mail.tld');

      expect(aidantCherche).toStrictEqual(undefined);
    });
  });
});
