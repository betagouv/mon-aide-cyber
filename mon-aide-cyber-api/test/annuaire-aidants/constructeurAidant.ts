import { unAidant as unAidantDuDomaineAidant } from '../authentification/constructeurs/constructeurAidant';
import { Constructeur } from '../constructeurs/constructeur';
import { Aidant } from '../../src/annuaire-aidants/annuaireAidants';

class ConstructeurAidant implements Constructeur<Aidant> {
  construis(): Aidant {
    const aidant = unAidantDuDomaineAidant()
      .ayantConsentiPourLAnnuaire()
      .construis();
    return {
      identifiant: aidant.identifiant,
      nomPrenom: aidant.nomPrenom,
    };
  }
}

export const unAidant = () => new ConstructeurAidant();
