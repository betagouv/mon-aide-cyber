import { unAide } from '../../../aide/ConstructeurAide';
import {
  AideDistant,
  AideDistantBrevoDTO,
  AideDistantDTO,
  EntrepotAideConcret,
  EntrepotAideDistant,
} from '../../../../src/infrastructure/entrepots/postgres/EntrepotAideConcret';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';
import { beforeEach, describe, expect, it } from 'vitest';
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
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesAides();
  });

  describe('Lorsque l’on persiste', () => {
    it('MAC génère un identifiant et conserve la date de signature', async () => {
      const aide = unAide().construis();
      const fauxServiceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide().avec(aide).construis()
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();

      await new EntrepotAideConcret(
        fauxServiceDeChiffrement,
        entrepotAideBrevoMemoire
      ).persiste(aide);

      const aideRecu = await new EntrepotAideConcret(
        fauxServiceDeChiffrement,
        entrepotAideBrevoMemoire
      ).rechercheParEmail(aide.email);
      expect(aideRecu).not.toBeUndefined();
      expect(aideRecu!.identifiant).toStrictEqual(aide.identifiant);
      expect(aideRecu!.dateSignatureCGU).toStrictEqual(aide.dateSignatureCGU);
    });

    it('MAC contacte Brevo pour créer le contact correspondant en chiffrant les parties sensibles', async () => {
      const aide = unAide().construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide().avec(aide).construis()
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();

      await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire
      ).persiste(aide);

      const aideRecu = await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire
      ).rechercheParEmail(aide.email);
      expect(aideRecu).toStrictEqual(aide);
    });
  });

  describe('Lorsque l’on recherche par email', () => {
    it('Récupère l’Aidé ciblé', async () => {
      const premierAide = unAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-02-01T13:26:34+01:00')
        )
        .construis();
      const secondAide = unAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-03-09T04:04:34+01:00')
        )
        .construis();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide()
          .avec(premierAide)
          .avec(secondAide)
          .construis()
      );
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();
      await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire
      ).persiste(premierAide);
      await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire
      ).persiste(secondAide);

      const aideRecherche = await new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire
      ).rechercheParEmail(secondAide.email);

      expect(aideRecherche).toStrictEqual(secondAide);
    });

    it('L’Aidé n’est pas trouvé', async () => {
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();
      const aideRecherche = await new EntrepotAideConcret(
        new FauxServiceDeChiffrement(new Map()),
        entrepotAideBrevoMemoire
      ).rechercheParEmail('email@inconnu.com');

      expect(aideRecherche).toBeUndefined();
    });

    it('Une erreur est remontée si le contact Brevo existe mais que l’on arrive pas à récupérer les informations de l’Aidé', async () => {
      const aide = unAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-02-01T13:26:34+01:00')
        )
        .construis();
      const entrepotAideBrevoMemoire =
        new EntrepotAideBrevoMemoire().sansMetadonnees();
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        new DictionnaireDeChiffrementAide().avec(aide).construis()
      );
      const entrepotAideConcret = new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire
      );
      await entrepotAideConcret.persiste(aide);

      await expect(() =>
        entrepotAideConcret.rechercheParEmail(aide.email)
      ).rejects.toThrowError(
        "Impossible de récupérer les informations de l'Aidé."
      );
    });

    it('Une erreur est remontée si le contact Brevo retourné ne correspond pas à un Aidé', async () => {
      const aide = unAide()
        .avecUneDateDeSignatureDesCGU(
          FournisseurHorloge.enDate('2024-02-01T13:26:34+01:00')
        )
        .construis();
      const entrepotAideBrevoMemoire = new EntrepotAideBrevoMemoire();
      const tableDeChiffrement = new DictionnaireDeChiffrementAide()
        .avec(aide)
        .construis();
      entrepotAideBrevoMemoire.persiste(
        {
          email: aide.email,
          departement: aide.departement,
          identifiantMAC: aide.identifiant,
          ...(aide.raisonSociale && { raisonSociale: aide.raisonSociale }),
        },
        (identifiantMAC, departement, raisonSociale) =>
          tableDeChiffrement.get(
            JSON.stringify({ identifiantMAC, departement, raisonSociale })
          )!
      );
      const serviceDeChiffrement = new FauxServiceDeChiffrement(
        tableDeChiffrement
      );
      const entrepotAideConcret = new EntrepotAideConcret(
        serviceDeChiffrement,
        entrepotAideBrevoMemoire
      );

      await expect(() =>
        entrepotAideConcret.rechercheParEmail(aide.email)
      ).rejects.toThrowError("L'Aidé demandé n'existe pas.");
    });
  });
});

class EntrepotAideBrevoMemoire implements EntrepotAideDistant {
  protected entites: Map<string, AideDistantBrevoDTO> = new Map();
  private avecMetaDonnees = true;
  async persiste(
    aide: AideDistant,
    chiffrement: (
      identifiantMAC: crypto.UUID,
      departement: string,
      raisonSociale?: string
    ) => string
  ) {
    const contactBrevo: Omit<AideDistantBrevoDTO, 'attributes'> & {
      attributes: { METADONNEES?: string };
    } = {
      email: aide.email,
      attributes: {
        ...(this.avecMetaDonnees && {
          METADONNEES: chiffrement(
            aide.identifiantMAC,
            aide.departement.nom,
            aide.raisonSociale
          ),
        }),
      },
    };
    this.entites.set(aide.email, contactBrevo as AideDistantBrevoDTO);
  }

  rechercheParEmail(
    email: string,
    mappeur: (dto: AideDistantDTO) => AideDistant
  ): Promise<AideDistant | undefined> {
    const aideDistantDTO = this.entites.get(email);
    if (aideDistantDTO === undefined) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(
      mappeur({
        email: aideDistantDTO.email,
        metaDonnees: aideDistantDTO.attributes.METADONNEES,
      })
    );
  }

  sansMetadonnees(): EntrepotAideBrevoMemoire {
    this.avecMetaDonnees = false;
    return this;
  }
}
class DictionnaireDeChiffrementAide implements DictionnaireDeChiffrement<Aide> {
  private _dictionnaire: Dictionnaire = new Map();
  avec(aide: Aide): DictionnaireDeChiffrement<Aide> {
    const valeurEnClair = JSON.stringify({
      identifiantMAC: aide.identifiant,
      departement: aide.departement.nom,
      raisonSociale: aide.raisonSociale,
    });
    this._dictionnaire.set(valeurEnClair, fakerFR.string.alpha(10));
    return this;
  }
  construis(): Dictionnaire {
    return this._dictionnaire;
  }
}
