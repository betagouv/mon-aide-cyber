import { beforeEach, describe, expect, it } from 'vitest';
import { nettoieLaBaseDeDonneesDemandeDevenirAidant } from '../../../utilitaires/nettoyeurBDD';
import { unConstructeurDeDemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/constructeurDeDemandeDevenirAidant';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';
import {
  DemandeDevenirAidant,
  StatutDemande,
} from '../../../../src/gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  DemandeDevenirAidantDTO,
  EntrepotDemandeDevenirAidantPostgres,
} from '../../../../src/infrastructure/entrepots/postgres/EntrepotDemandeDevenirAidantPostgres';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import knexfile from '../../../../src/infrastructure/entrepots/postgres/knexfile';
import knex from 'knex';
import { FournisseurHorlogeDeTest } from '../../horloge/FournisseurHorlogeDeTest';

describe('Entrepot Demande Devenir Aidant', () => {
  beforeEach(async () => {
    await nettoieLaBaseDeDonneesDemandeDevenirAidant();
  });

  it('Persiste une demande devenir aidant', async () => {
    const demandeDevenirAidant =
      unConstructeurDeDemandeDevenirAidant().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [demandeDevenirAidant.nom, 'aaa'],
        [demandeDevenirAidant.prenom, 'bbb'],
        [demandeDevenirAidant.mail, 'ccc'],
        [demandeDevenirAidant.departement.nom, 'ddd'],
        [demandeDevenirAidant.entite.nom, 'eee'],
        [demandeDevenirAidant.entite.siret, 'fff'],
        [demandeDevenirAidant.entite.type, 'ggg'],
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
      statut: StatutDemande.EN_COURS,
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

  it("Vérifie qu'une demande existe", async () => {
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

  it('Recherche une demande en cours par mail', async () => {
    const demandeDevenirAidant =
      unConstructeurDeDemandeDevenirAidant().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [demandeDevenirAidant.nom, 'aaa'],
        [demandeDevenirAidant.prenom, 'bbb'],
        [demandeDevenirAidant.mail, 'ccc'],
        [demandeDevenirAidant.departement.nom, 'ddd'],
        [demandeDevenirAidant.entite.nom, 'eee'],
        [demandeDevenirAidant.entite.siret, 'fff'],
        [demandeDevenirAidant.entite.type, 'ggg'],
      ])
    );
    await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).persiste(demandeDevenirAidant);

    const demandeRecherchee = await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).rechercheDemandeEnCoursParMail(demandeDevenirAidant.mail);

    expect(demandeRecherchee).toStrictEqual<DemandeDevenirAidant>({
      identifiant: demandeDevenirAidant.identifiant,
      date: demandeDevenirAidant.date,
      nom: demandeDevenirAidant.nom,
      prenom: demandeDevenirAidant.prenom,
      mail: demandeDevenirAidant.mail,
      departement: demandeDevenirAidant.departement,
      statut: StatutDemande.EN_COURS,
      entite: demandeDevenirAidant.entite,
    });
  });

  it('Ne retourne pas la demande si elle a été traitée', async () => {
    const demandeDevenirAidant = unConstructeurDeDemandeDevenirAidant()
      .traitee()
      .construis();
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
    ).rechercheDemandeEnCoursParMail(demandeDevenirAidant.mail);

    expect(demandeRecherchee).toBeUndefined();
  });

  it('Met à jour le statut de la demande', async () => {
    const demandeDevenirAidant =
      unConstructeurDeDemandeDevenirAidant().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [demandeDevenirAidant.nom, 'aaa'],
        [demandeDevenirAidant.prenom, 'bbb'],
        [demandeDevenirAidant.mail, 'ccc'],
        [demandeDevenirAidant.departement.nom, 'ddd'],
        [demandeDevenirAidant.entite.nom, 'eee'],
        [demandeDevenirAidant.entite.siret, 'fff'],
        [demandeDevenirAidant.entite.type, 'ggg'],
      ])
    );
    await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).persiste(demandeDevenirAidant);

    await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).persiste({ ...demandeDevenirAidant, statut: StatutDemande.TRAITEE });
    const demandeRecue = await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).lis(demandeDevenirAidant.identifiant);

    expect(demandeRecue).toStrictEqual<DemandeDevenirAidant>({
      identifiant: demandeDevenirAidant.identifiant,
      date: demandeDevenirAidant.date,
      nom: demandeDevenirAidant.nom,
      prenom: demandeDevenirAidant.prenom,
      mail: demandeDevenirAidant.mail,
      departement: demandeDevenirAidant.departement,
      statut: StatutDemande.TRAITEE,
      entite: demandeDevenirAidant.entite,
    });
  });

  it('Retourne les anciennes demandes sans entité, demandes concernant des attentes d’adhésion à des associations', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const identifiantDemande = crypto.randomUUID();
    const connexionKnex = knex(knexfile);
    await connexionKnex
      .insert({
        id: identifiantDemande,
        donnees: {
          nom: 'aaa',
          prenom: 'bbb',
          nomDepartement: 'ddd',
          mail: 'ccc',
          date: FournisseurHorloge.maintenant().toISOString(),
        },
        statut: StatutDemande.EN_COURS,
      })
      .into('demandes-devenir-aidant');
    const demandeDevenirAidant = unConstructeurDeDemandeDevenirAidant()
      .enDate(FournisseurHorloge.maintenant())
      .avecPourIdentifiant(identifiantDemande)
      .construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [demandeDevenirAidant.nom, 'aaa'],
        [demandeDevenirAidant.prenom, 'bbb'],
        [demandeDevenirAidant.mail, 'ccc'],
        [demandeDevenirAidant.departement.nom, 'ddd'],
      ])
    );

    const demandeRecue = await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).lis(demandeDevenirAidant.identifiant);

    expect(demandeRecue).toStrictEqual<DemandeDevenirAidant>({
      identifiant: demandeDevenirAidant.identifiant,
      date: demandeDevenirAidant.date,
      nom: demandeDevenirAidant.nom,
      prenom: demandeDevenirAidant.prenom,
      mail: demandeDevenirAidant.mail,
      departement: demandeDevenirAidant.departement,
      statut: StatutDemande.EN_COURS,
      entite: {
        type: 'Association',
        nom: '',
        siret: '',
      },
    });
  });

  it('Retourne les anciennes demandes dont seules le type d’entité était fourni, demandes concernant des attentes d’adhésion à des associations', async () => {
    FournisseurHorlogeDeTest.initialise(new Date());
    const identifiantDemande = crypto.randomUUID();
    const connexionKnex = knex(knexfile);
    await connexionKnex
      .insert({
        id: identifiantDemande,
        donnees: {
          nom: 'aaa',
          prenom: 'bbb',
          nomDepartement: 'ddd',
          mail: 'ccc',
          entite: { type: 'eee' },
          date: FournisseurHorloge.maintenant().toISOString(),
        },
        statut: StatutDemande.EN_COURS,
      })
      .into('demandes-devenir-aidant');
    const demandeDevenirAidant = unConstructeurDeDemandeDevenirAidant()
      .enDate(FournisseurHorloge.maintenant())
      .avecPourIdentifiant(identifiantDemande)
      .construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [demandeDevenirAidant.nom, 'aaa'],
        [demandeDevenirAidant.prenom, 'bbb'],
        [demandeDevenirAidant.mail, 'ccc'],
        [demandeDevenirAidant.departement.nom, 'ddd'],
        [demandeDevenirAidant.entite.type, 'eee'],
      ])
    );

    const demandeRecue = await new EntrepotDemandeDevenirAidantPostgres(
      serviceDeChiffrement
    ).lis(demandeDevenirAidant.identifiant);

    expect(demandeRecue).toStrictEqual<DemandeDevenirAidant>({
      identifiant: demandeDevenirAidant.identifiant,
      date: demandeDevenirAidant.date,
      nom: demandeDevenirAidant.nom,
      prenom: demandeDevenirAidant.prenom,
      mail: demandeDevenirAidant.mail,
      departement: demandeDevenirAidant.departement,
      statut: StatutDemande.EN_COURS,
      entite: {
        type: 'Association',
        nom: '',
        siret: '',
      },
    });
  });
});
