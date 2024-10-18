import { describe, it } from 'vitest';
import { Aidant } from '../../src/annuaire-aidants/annuaireAidants';
import { unAidant } from './constructeurAidant';
import { EntrepotAnnuaireAidantsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { ServiceAnnuaireAidants } from '../../src/annuaire-aidants/ServiceAnnuaireAidants';

describe('Service d’annuaire des Aidants', () => {
  it('Formate le nom des Aidants', async () => {
    const jean = unAidant().avecNomPrenom('Jean').construis();
    const martin = unAidant().avecNomPrenom('Martin N').construis();
    const entrepot = new EntrepotAnnuaireAidantsMemoire();
    await entrepot.persiste(jean);
    await entrepot.persiste(martin);

    const aidants = await new ServiceAnnuaireAidants(entrepot).recherche(
      undefined
    );

    expect(aidants).toStrictEqual<Aidant[]>([
      { identifiant: expect.any(String), nomPrenom: 'Jean', departements: [] },
      {
        identifiant: expect.any(String),
        nomPrenom: 'Martin N.',
        departements: [],
      },
    ]);
  });
});
