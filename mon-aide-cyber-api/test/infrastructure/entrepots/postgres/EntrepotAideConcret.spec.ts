import { unAide } from '../../../aide/ConstructeurAide';
import {
  AideBrevo,
  EntrepotAideConcret,
  EntrepotAideToto,
} from '../../../../src/infrastructure/entrepots/postgres/EntrepotAideConcret';
import { FauxServiceDeChiffrement } from '../../securite/FauxServiceDeChiffrement';
import { cloneDeep } from 'lodash';

class EntrepotAideBrevoMemoire implements EntrepotAideToto {
  protected entites: Map<crypto.UUID, AideBrevo> = new Map();

  async persiste(aide: { email: string; attributes: { metadata: string } }) {
    const entiteClonee = cloneDeep(aide);
    this.entites.set(aide.email, entiteClonee);
  }
}

describe('Entrepot Aidé Concret', () => {
  it('persiste un aidé dans MAC', async () => {
    const aide = unAide().construis();

    await new EntrepotAideConcret(
      new FauxServiceDeChiffrement(new Map([['', '']]))
    ).persiste(aide);

    const aideRecu = await new EntrepotAideConcret(
      new FauxServiceDeChiffrement(new Map([['', '']]))
    ).lis(aide.identifiant);

    expect(aideRecu.identifiant).toStrictEqual(aide.identifiant);
    expect(aideRecu.dateSignatureCGU).toStrictEqual(aide.dateSignatureCGU);
  });

  it('persiste un aidé chiffré dans Brevo', async () => {
    const aide = unAide().construis();
    const serviceDeChiffrement = new FauxServiceDeChiffrement(
      new Map([
        [
          JSON.stringify({
            identifiantMAC: aide.identifiant,
            departement: aide.departement,
            raisonSociale: aide.raisonSociale,
          }),
          'abc',
        ],
      ])
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
