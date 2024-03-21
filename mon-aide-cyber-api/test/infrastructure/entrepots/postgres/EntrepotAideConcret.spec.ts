import { unAide } from '../../../aide/ConstructeurAide';
import {
  AideDistant,
  AideDistantDTO,
  EntrepotAideConcret,
  EntrepotAideDistant,
} from '../../../../src/infrastructure/entrepots/postgres/EntrepotAideConcret';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';
import { afterEach, describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonneesAides } from '../../../utilitaires/nettoyeurBDD';
import crypto from 'crypto';
import { Aide } from '../../../../src/aide/Aide';
import { fakerFR } from '@faker-js/faker';
import {
  Dictionnaire,
  DictionnaireDeChiffrement,
} from '../../../constructeurs/DictionnaireDeChiffrement';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';

describe('Entrepot Aidé Concret', () => {
  afterEach(async () => {
    await nettoieLaBaseDeDonneesAides();
  });

  describe('Lorsque l’on persiste', () => {
    it('MAC génère un identifiant et conserve la date de signature', async () => {
      const aide = unAide().construis();
      const fauxServiceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide().avec(aide).construis(),
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();

      await new EntrepotAideConcret(
        fauxServiceDeChiffrement,
        entrepotAideBrevoMemoire,
      ).persiste(aide);

      const aideRecu = await new EntrepotAideConcret(
        fauxServiceDeChiffrement,
        entrepotAideBrevoMemoire,
      ).rechercheParEmail(aide.email);
      expect(aideRecu).not.toBeUndefined();
      expect(aideRecu!.identifiant).toStrictEqual(aide.identifiant);
      expect(aideRecu!.dateSignatureCGU).toStrictEqual(aide.dateSignatureCGU);
    });

    it('MAC contacte Brevo pour créer le contact correspondant en chiffrant les parties sensibles', async () => {
      const aide = unAide().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide().avec(aide).construis(),
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();

      await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire,
      ).persiste(aide);

      const aideRecu = await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire,
      ).rechercheParEmail(aide.email);
      expect(aideRecu).toStrictEqual(aide);
    });
  });

  describe('Lorsque l’on recherche par email', () => {
    it('Récupère l’Aidé ciblé', async () => {
      const premierAide = unAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-02-01T13:26:34+01:00'),
        )
        .construis();
      const secondAide = unAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-03-09T04:04:34+01:00'),
        )
        .construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide()
          .avec(premierAide)
          .avec(secondAide)
          .construis(),
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();
      await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire,
      ).persiste(premierAide);
      await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire,
      ).persiste(secondAide);

      const aideRecherche = await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire,
      ).rechercheParEmail(secondAide.email);

      expect(aideRecherche).toStrictEqual(secondAide);
    });

    it('L’Aidé n’est pas trouvé', async () => {
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();
      const aideRecherche = await new EntrepotAideConcret(
        new FauxServiceDeChiffrement(new Map()),
        entrepotAideBrevoMemoire,
      ).rechercheParEmail('email@inconnu.com');

      expect(aideRecherche).toBeUndefined();
    });
  });
});

class EntrepotAideBrevoMemoire implements EntrepotAideDistant {
  protected entites: Map<string, AideDistantDTO> = new Map();
  async persiste(
    aide: AideDistant,
    chiffrement: (
      identifiantMAC: crypto.UUID,
      departement: string,
      raisonSociale?: string,
    ) => string,
  ) {
    this.entites.set(aide.email, {
      email: aide.email,
      attributes: {
        metadata: chiffrement(
          aide.identifiantMAC,
          aide.departement,
          aide.raisonSociale,
        ),
      },
    });
  }

  rechercheParEmail(
    email: string,
    mappeur: (dto: AideDistantDTO) => AideDistant,
  ): Promise<AideDistant | undefined> {
    const aideDistantDTO = this.entites.get(email);
    if (aideDistantDTO === undefined) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(mappeur(aideDistantDTO));
  }
}
class DictionnaireDeChiffrementAide implements DictionnaireDeChiffrement<Aide> {
  private _dictionnaire: Dictionnaire = new Map();
  avec(aide: Aide): DictionnaireDeChiffrement<Aide> {
    const valeurEnClair = JSON.stringify({
      identifiantMAC: aide.identifiant,
      departement: aide.departement,
      raisonSociale: aide.raisonSociale,
    });
    this._dictionnaire.set(valeurEnClair, fakerFR.string.alpha(10));
    return this;
  }
  construis(): Dictionnaire {
    return this._dictionnaire;
  }
}
