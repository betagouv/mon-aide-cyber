import { unAidant as unAidantDuDomaineAidant } from '../authentification/constructeurs/constructeurAidant';
import { Constructeur } from '../constructeurs/constructeur';
import { Aidant } from '../../src/annuaire-aidants/annuaireAidants';
import { Departement } from '../../src/gestion-demandes/departements';
import { fakerFR } from '@faker-js/faker';

class ConstructeurAidant implements Constructeur<Aidant> {
  private nomPrenom: string = fakerFR.person.fullName();

  private departements: Departement[] = [];

  avecNomPrenom(nomPrenom: string): ConstructeurAidant {
    this.nomPrenom = nomPrenom;
    return this;
  }

  enGironde(): ConstructeurAidant {
    this.departements.push({ code: '33', nom: 'Gironde', codeRegion: '75' });
    return this;
  }

  enCorreze(): ConstructeurAidant {
    this.departements.push({ code: '19', nom: 'Corrèze', codeRegion: '75' });
    return this;
  }

  construis(): Aidant {
    const aidant = unAidantDuDomaineAidant()
      .avecUnNomPrenom(this.nomPrenom)
      .ayantConsentiPourLAnnuaire()
      .ayantPourDepartements(this.departements)
      .construis();
    return {
      identifiant: aidant.identifiant,
      nomPrenom: aidant.nomPrenom,
      departements: this.departements,
    };
  }
}

export const unAidant = () => new ConstructeurAidant();
