import { describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonneesAidants } from '../../../utilitaires/nettoyeurBDD';
import { EntrepotAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';
import { Aidant } from '../../../../src/authentification/Aidant';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../horloge/FournisseurHorlogeDeTest';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';

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
      ])
    );

    await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

    const aidantRecu = await new EntrepotAidantPostgres(
      serviceDeChiffrement
    ).lis(aidant.identifiant);
    expect(aidantRecu).toStrictEqual<Aidant>(aidant);
  });

  describe('mets à jour un aidant', () => {
    it('mets à jour les dates de signature des CGU et de la charte', async () => {
      const dateSignature = new Date(Date.parse('2024-02-04T13:25:17+01:00'));
      FournisseurHorlogeDeTest.initialise(dateSignature);
      const aidant = unAidant().sansEspace().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(new Map([]));
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
      aidant.dateSignatureCharte = FournisseurHorloge.maintenant();
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).lis(aidant.identifiant);
      expect(aidantRecu.dateSignatureCharte).toStrictEqual(dateSignature);
      expect(aidantRecu.dateSignatureCGU).toStrictEqual(dateSignature);
    });
  });

  describe('recherche par identifiant et mot de passe', () => {
    it("l'aidant est trouvé", async () => {
      const aidant = unAidant().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new Map([
          [aidant.identifiantConnexion, 'aaa'],
          [aidant.motDePasse, 'bbb'],
          [aidant.nomPrenom, 'ccc'],
        ])
      );

      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantRecu = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).rechercheParIdentifiantConnexionEtMotDePasse(
        aidant.identifiantConnexion,
        aidant.motDePasse
      );
      expect(aidantRecu).toStrictEqual<Aidant>(aidant);
    });

    it("l'aidant n'est pas trouvé", () => {
      expect(
        new EntrepotAidantPostgres(
          new FauxServiceDeChiffrement(new Map())
        ).rechercheParIdentifiantConnexionEtMotDePasse(
          'identifiant-inconnu',
          'mdp'
        )
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
        ])
      );
      await new EntrepotAidantPostgres(serviceDeChiffrement).persiste(aidant);

      const aidantTrouve = await new EntrepotAidantPostgres(
        serviceDeChiffrement
      ).rechercheParIdentifiantDeConnexion(aidant.identifiantConnexion);

      expect(aidantTrouve).toStrictEqual<Aidant>(aidant);
    });

    it("l'aidant n'est pas trouvé", () => {
      expect(
        new EntrepotAidantPostgres(
          new FauxServiceDeChiffrement(new Map())
        ).rechercheParIdentifiantDeConnexion('identifiant-inconnu')
      ).rejects.toThrow(new Error("Le aidant demandé n'existe pas."));
    });
  });
});
