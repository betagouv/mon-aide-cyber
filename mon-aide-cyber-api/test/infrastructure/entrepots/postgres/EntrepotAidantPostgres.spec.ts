import { describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonneesAidants } from '../../../utilitaires/nettoyeurBDD';
import { EntrepotAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';

import { ServiceDeChiffrement } from '../../../../src/securite/ServiceDeChiffrement';
import { Aidant } from '../../../../src/authentification/Aidant';

class FauxServiceDeChiffrement implements ServiceDeChiffrement {
  constructor(private readonly tableDeChiffrement: Map<string, string>) {}

  chiffre(chaine: string): string {
    return this.tableDeChiffrement.get(chaine) || '';
  }

  dechiffre(chaine: string): string {
    let resultat = '';
    this.tableDeChiffrement.forEach((clef, valeur) => {
      if (clef === chaine) {
        resultat = valeur;
      }
    });
    return resultat;
  }
}

describe('Entrepot Aidant', () => {
  afterEach(async () => {
    await nettoieLaBaseDeDonneesAidants();
  });

  it('persiste un aidant', async () => {
    const aidant = unAidant().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [aidant.identifiantConnexion, 'aaa'],
        [aidant.motDePasse, 'bbb'],
        [aidant.nomPrenom, 'ccc'],
      ]),
    );

    await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

    const aidantRecu = await new EntrepotAidantPostgres(
      serviceDeChiffrement,
    ).lis(aidant.identifiant);
    expect(aidantRecu).toStrictEqual<Aidant>(aidant);
  });

  describe('recherche par identifiant et mot de passe', () => {
    it("l'aidant est trouvé", async () => {
      const aidant = unAidant().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [aidant.identifiantConnexion, 'aaa'],
          [aidant.motDePasse, 'bbb'],
          [aidant.nomPrenom, 'ccc'],
        ]),
      );

      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement,
      ).rechercheParIdentifiantConnexionEtMotDePasse(
        aidant.identifiantConnexion,
        aidant.motDePasse,
      );
      expect(aidantRecu).toStrictEqual<Aidant>(aidant);
    });

    it("l'aidant n'est pas trouvé", () => {
      expect(
        new EntrepotAidantPostgres(
          new FauxServiceDeChiffrement(new Map()),
        ).rechercheParIdentifiantConnexionEtMotDePasse(
          'identifiant-inconnu',
          'mdp',
        ),
      ).rejects.toThrow(new Error("Le aidant demandé n'existe pas."));
    });
  });

  describe('recherche par identifiant', () => {
    it("l'aidant est trouvé", async () => {
      const aidant = unAidant().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [aidant.identifiantConnexion, 'aaa'],
          [aidant.motDePasse, 'bbb'],
          [aidant.nomPrenom, 'ccc'],
        ]),
      );
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantTrouve = await new EntrepotAidantPostgres(
        serviceDeChiffrement,
      ).rechercheParIdentifiantDeConnexion(aidant.identifiantConnexion);

      expect(aidantTrouve).toStrictEqual<Aidant>(aidant);
    });

    it("l'aidant n'est pas trouvé", () => {
      expect(
        new EntrepotAidantPostgres(
          new FauxServiceDeChiffrement(new Map()),
        ).rechercheParIdentifiantDeConnexion('identifiant-inconnu'),
      ).rejects.toThrow(new Error("Le aidant demandé n'existe pas."));
    });
  });
});
