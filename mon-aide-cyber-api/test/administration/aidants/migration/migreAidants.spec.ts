import { describe, expect } from 'vitest';
import { Aidant } from '../../../../src/authentification/Aidant';
import { EntrepotAidantMemoire } from '../../../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import {
  MigrationAidant,
  migreAidants,
} from '../../../../src/administration/aidants/migration/migreAidants';
import { fakerFR } from '@faker-js/faker';
import {
  ServiceDeChiffrementClair,
  ServiceDeChiffrementEnErreurSur,
} from '../../../../src/administration/aidants/migration/ServiceDeChiffrementClair';
import fs from 'fs';

class ConstructeurMigration {
  construis(): MigrationAidant {
    return {
      identifiant: crypto.randomUUID(),
      aidant: {
        identifiantConnexion: fakerFR.internet.email(),
        nomPrenom: fakerFR.person.fullName(),
        motDePasse: fakerFR.string.alpha(10),
        dateSignatureCGU: fakerFR.date.anytime().toISOString(),
      },
    };
  }
}

const uneMigration = (): ConstructeurMigration => new ConstructeurMigration();

class EntrepotAidantMemoireEnErreur extends EntrepotAidantMemoire {
  constructor(private readonly aidant: MigrationAidant) {
    super();
  }

  async persiste(entite: Aidant): Promise<void> {
    if (entite.identifiant === this.aidant.identifiant) {
      throw new Error('Ne peut persister l’Aidant');
    }
    super.persiste(entite);
  }
}

describe('Migration des Aidants', () => {
  it('Migre les aidants', async () => {
    const entrepot = new EntrepotAidantMemoire();
    const premiereMigration = uneMigration().construis();
    const deuxiemeMigration = uneMigration().construis();

    const aidantsMigres = await migreAidants(
      entrepot,
      new ServiceDeChiffrementClair(),
      [premiereMigration, deuxiemeMigration],
    );

    expect(await entrepot.tous()).toStrictEqual<Aidant[]>([
      {
        identifiant: premiereMigration.identifiant,
        nomPrenom: premiereMigration.aidant.nomPrenom,
        motDePasse: premiereMigration.aidant.motDePasse,
        identifiantConnexion: premiereMigration.aidant.identifiantConnexion,
        dateSignatureCGU: new Date(
          Date.parse(premiereMigration.aidant.dateSignatureCGU!),
        ),
      },
      {
        identifiant: deuxiemeMigration.identifiant,
        nomPrenom: deuxiemeMigration.aidant.nomPrenom,
        motDePasse: deuxiemeMigration.aidant.motDePasse,
        identifiantConnexion: deuxiemeMigration.aidant.identifiantConnexion,
        dateSignatureCGU: new Date(
          Date.parse(deuxiemeMigration.aidant.dateSignatureCGU!),
        ),
      },
    ]);
    expect(aidantsMigres).toStrictEqual({ succes: 2, total: 2 });
  });

  it('Migre les aidants à partir d’un fichier', async () => {
    const entrepot = new EntrepotAidantMemoire();
    const aidantsAMigrer = fs.readFileSync(
      './test/administration/aidants/migration/aidants.json',
      {
        encoding: 'utf-8',
      },
    );

    const aidantsMigres = await migreAidants(
      entrepot,
      new ServiceDeChiffrementClair(),
      JSON.parse(aidantsAMigrer),
    );

    expect(await entrepot.tous()).toStrictEqual<Aidant[]>([
      {
        identifiant: 'e5af4e97-e987-45b5-a710-c14e594d438a',
        identifiantConnexion: 'jean.dujardin@mail.com',
        motDePasse: 'mdp',
        nomPrenom: 'Jean Dujardin',
      },
      {
        identifiant: '7fef39ab-84f6-4d0c-aaa8-c9a41f9dbd43',
        dateSignatureCGU: new Date(Date.parse('2024-02-27T09:02:37.080Z')),
        identifiantConnexion: 'jean.dupont@mail.com',
        motDePasse: 'mdp',
        nomPrenom: 'Jean Dupont',
      },
    ]);
    expect(aidantsMigres).toStrictEqual({ succes: 2, total: 2 });
  });

  it('Migre les aidants et collecte les erreurs lors du déchiffrement', async () => {
    const entrepot = new EntrepotAidantMemoire();
    const premiereMigration = uneMigration().construis();
    const deuxiemeMigration = uneMigration().construis();
    const troisiemeMigration = uneMigration().construis();

    const aidantsMigres = await migreAidants(
      entrepot,
      new ServiceDeChiffrementEnErreurSur(deuxiemeMigration),
      [premiereMigration, deuxiemeMigration, troisiemeMigration],
    );

    expect(aidantsMigres).toStrictEqual({
      succes: 2,
      total: 3,
      erreurs: [deuxiemeMigration.identifiant],
    });
  });

  it('Migre les aidants et collecte les erreurs lors de la persistance', async () => {
    const premiereMigration = uneMigration().construis();
    const deuxiemeMigration = uneMigration().construis();
    const troisiemeMigration = uneMigration().construis();
    const entrepot = new EntrepotAidantMemoireEnErreur(deuxiemeMigration);

    const aidantsMigres = await migreAidants(
      entrepot,
      new ServiceDeChiffrementClair(),
      [premiereMigration, deuxiemeMigration, troisiemeMigration],
    );

    expect(aidantsMigres).toStrictEqual({
      succes: 2,
      total: 3,
      erreurs: [deuxiemeMigration.identifiant],
    });
  });
});
