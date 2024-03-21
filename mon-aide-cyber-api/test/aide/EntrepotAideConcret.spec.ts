import { unAide } from './ConstructeurAide';
import { EntrepotAideConcret } from '../../src/infrastructure/entrepots/postgres/EntrepotAideConcret';

describe('Entrepot Aidé Concret', () => {
  it('persiste un aidé dans MAC', async () => {
    const aide = unAide().construis();

    await new EntrepotAideConcret().persiste(aide);

    const aideRecu = await new EntrepotAideConcret().lis(aide.identifiant);

    expect(aideRecu.identifiant).toStrictEqual(aide.identifiant);
    expect(aideRecu.dateSignatureCGU).toStrictEqual(aide.dateSignatureCGU);
  });
});
