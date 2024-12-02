import { expect } from 'vitest';
import { Aidant } from '../../../../src/administration/aidants/aidants-sans-diagnostic/Types';
import { FournisseurHorloge } from '../../../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../../../infrastructure/horloge/FournisseurHorlogeDeTest';
import {
  EntrepotAidant,
  ExtractionAidantSansDiagnostic,
} from '../../../../src/administration/aidants/aidants-sans-diagnostic/extractionAidantSansDiagnostic';
import { AggregatNonTrouve } from '../../../../src/domaine/Aggregat';
import crypto from 'crypto';
import { cloneDeep } from 'lodash';

export class EntrepotAidantMemoire implements EntrepotAidant {
  protected entites: Map<crypto.UUID, Aidant> = new Map();

  async lis(identifiant: string): Promise<Aidant> {
    const entiteTrouvee = this.entites.get(identifiant as crypto.UUID);
    if (entiteTrouvee) {
      return Promise.resolve(cloneDeep(entiteTrouvee));
    }
    throw new AggregatNonTrouve('aidant');
  }

  async persiste(entite: Aidant) {
    const entiteClonee = cloneDeep(entite);
    this.entites.set(entite.identifiant, entiteClonee);
  }

  tous(): Promise<Aidant[]> {
    return Promise.resolve(Array.from(this.entites.values()));
  }

  rechercheAidantSansDiagnostic(): Promise<Aidant[]> {
    return this.tous();
  }
}

describe('Extraction des Aidants sans diagnostic', () => {
  it('Extraie un Aidant sans diagnostic', async () => {
    FournisseurHorlogeDeTest.initialise(FournisseurHorloge.maintenant());
    const entrepot = new EntrepotAidantMemoire();
    entrepot.persiste({
      identifiant: crypto.randomUUID(),
      nomPrenom: 'Jean DUPONT',
      email: 'jean.dupont@yomail.com',
      compteCree: FournisseurHorloge.maintenant(),
    });
    const resultat = await new ExtractionAidantSansDiagnostic(
      entrepot
    ).extrais();

    expect(resultat).toStrictEqual<Aidant[]>([
      {
        identifiant: expect.any(String),
        nomPrenom: 'Jean DUPONT',
        email: 'jean.dupont@yomail.com',
        compteCree: FournisseurHorloge.maintenant(),
      },
    ]);
  });
});
