import { describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonneesDemandeDevenirAidant } from '../../../utilitaires/nettoyeurBDD';
import { unConstructeurDeDemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/constructeurDeDemandeDevenirAidant';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';
import { DemandeDevenirAidant } from '../../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  DemandeDevenirAidantDTO,
  EntrepotDemandeDevenirAidantPostgres,
} from '../../../../src/infrastructure/entrepots/postgres/EntrepotDemandeDevenirAidantPostgres';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import knexfile from '../../../../src/infrastructure/entrepots/postgres/knexfile';
import knex from 'knex';

describe('Entrepot Demande Devenir Aidant', () => {
  afterEach(async () => {
    await nettoieLaBaseDeDonneesDemandeDevenirAidant();
  });

  it('persiste une demande devenir aidant', async () => {
    const demandeDevenirAidant =
      unConstructeurDeDemandeDevenirAidant().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [demandeDevenirAidant.nom, 'aaa'],
        [demandeDevenirAidant.prenom, 'bbb'],
        [demandeDevenirAidant.mail, 'ccc'],
        [demandeDevenirAidant.departement.nom, 'ddd'],
      ])
    );

    await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).persiste(demandeDevenirAidant);

    const demandeDevenirAidantRecu =
      await new EntrepotDemandeDevenirAidantPostgres(serviceDeChiffrement).lis(
        demandeDevenirAidant.identifiant
      );
    expect(demandeDevenirAidantRecu).toStrictEqual<DemandeDevenirAidant>(
      demandeDevenirAidant
    );
  });

  it("Lève une erreur lorsque le département persisté n'est pas trouvé", async () => {
    const demandeDevenirAidantDTO: DemandeDevenirAidantDTO = {
      id: crypto.randomUUID(),
      donnees: {
        nom: 'aaa',
        prenom: 'bbb',
        nomDepartement: 'ddd',
        mail: 'ccc',
        date: FournisseurHorloge.maintenant().toISOString(),
      },
    };
    await knex(knexfile)
      .insert(demandeDevenirAidantDTO)
      .into('demandes-devenir-aidant');

    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        ['unNom', 'aaa'],
        ['unPrenom', 'bbb'],
        ['mail@fournisseur.fr', 'ccc'],
        ['inconnu', 'ddd'],
      ])
    );

    expect(() =>
      new EntrepotDemandeDevenirAidantPostgres(serviceDeChiffrement).lis(
        demandeDevenirAidantDTO.id
      )
    ).rejects.toThrow(
      `Le département ${demandeDevenirAidantDTO.donnees.nomDepartement} n'a pu être trouvé.`
    );
  });

  it("vérifie qu'une demande existe", async () => {
    const demandeDevenirAidant =
      unConstructeurDeDemandeDevenirAidant().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [demandeDevenirAidant.nom, 'aaa'],
        [demandeDevenirAidant.prenom, 'bbb'],
        [demandeDevenirAidant.mail, 'ccc'],
        [demandeDevenirAidant.departement.nom, 'ddd'],
      ])
    );
    await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).persiste(demandeDevenirAidant);

    expect(
      await new EntrepotDemandeDevenirAidantPostgres(
        serviceDeChiffrement
      ).demandeExiste(demandeDevenirAidant.mail)
    ).toBe(true);
  });

  it('recherche une demande par mail', async () => {
    const demandeDevenirAidant =
      unConstructeurDeDemandeDevenirAidant().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [demandeDevenirAidant.nom, 'aaa'],
        [demandeDevenirAidant.prenom, 'bbb'],
        [demandeDevenirAidant.mail, 'ccc'],
        [demandeDevenirAidant.departement.nom, 'ddd'],
      ])
    );
    await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).persiste(demandeDevenirAidant);

    const demandeRecherchee = await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).rechercheParMail(demandeDevenirAidant.mail);

    expect(demandeRecherchee).toStrictEqual<DemandeDevenirAidant>({
      identifiant: demandeDevenirAidant.identifiant,
      date: demandeDevenirAidant.date,
      nom: demandeDevenirAidant.nom,
      prenom: demandeDevenirAidant.prenom,
      mail: demandeDevenirAidant.mail,
      departement: demandeDevenirAidant.departement,
    });
  });
});
