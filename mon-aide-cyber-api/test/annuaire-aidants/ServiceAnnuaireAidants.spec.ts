import { describe, expect, it } from 'vitest';
import { Aidant } from '../../src/annuaire-aidants/annuaireAidants';
import { unAidant } from './constructeurAidant';
import { EntrepotAnnuaireAidantsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotMemoire';
import { ServiceAnnuaireAidants } from '../../src/annuaire-aidants/ServiceAnnuaireAidants';

describe('Service d’annuaire des Aidants', () => {
  it("Ne retourne pas d'Aidants si le département n'est pas fourni", async () => {
    const entrepot = new EntrepotAnnuaireAidantsMemoire();
    await entrepot.persiste(unAidant().construis());
    await entrepot.persiste(unAidant().construis());

    const aidants = await new ServiceAnnuaireAidants(entrepot).recherche(
      undefined
    );

    expect(aidants).toBeUndefined();
  });

  it('Formate le nom des Aidants', async () => {
    const jean = unAidant().avecNomPrenom('Jean').enGironde().construis();
    const martin = unAidant().avecNomPrenom('Martin N').enGironde().construis();
    const entrepot = new EntrepotAnnuaireAidantsMemoire();
    await entrepot.persiste(jean);
    await entrepot.persiste(martin);

    const aidants = await new ServiceAnnuaireAidants(entrepot).recherche({
      departement: 'Gironde',
    });

    expect(aidants).toStrictEqual<Aidant[]>([
      {
        identifiant: expect.any(String),
        nomPrenom: 'Jean',
        departements: [
          {
            code: '33',
            codeRegion: '75',
            nom: 'Gironde',
          },
        ],
      },
      {
        identifiant: expect.any(String),
        nomPrenom: 'Martin N.',
        departements: [
          {
            code: '33',
            codeRegion: '75',
            nom: 'Gironde',
          },
        ],
      },
    ]);
  });
});
