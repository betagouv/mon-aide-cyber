import { afterEach, describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonnees } from '../../../utilitaires/nettoyeurBDD';
import { EntrepotAidantPostgres } from '../../../../src/infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { unAidant } from '../../../authentification/constructeurs/constructeurAidant';

import { Chiffrement } from '../../../../src/securite/Chiffrement';

class FauxServiceDeChiffrement implements Chiffrement {
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
    await nettoieLaBaseDeDonnees();
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
    ).rechercheParIdentifiantConnexionEtMotDePasse(
      aidant.identifiantConnexion,
      aidant.motDePasse,
    );
    expect(aidantRecu).toStrictEqual(aidant);
  });

  it("L'aidant n'est pas trouvé", () => {
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
