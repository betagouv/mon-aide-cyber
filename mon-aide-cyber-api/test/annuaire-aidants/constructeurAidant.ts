import { unAidant as unAidantDuDomaineAidant } from '../espace-aidant/constructeurs/constructeurAidant';
import { Constructeur } from '../constructeurs/constructeur';
import { Aidant } from '../../src/annuaire-aidants/annuaireAidants';
import {
  Departement,
  departements,
} from '../../src/gestion-demandes/departements';
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

  dansLeDepartement(departement: Departement): ConstructeurAidant {
    this.departements.push(departement);
    return this;
  }

  construis(): Aidant {
    const departementsAidant =
      this.departements.length > 0
        ? this.departements
        : [
            departements[
              fakerFR.number.int({
                min: 0,
                max: 105,
              })
            ],
          ];
    const aidant = unAidantDuDomaineAidant()
      .avecUnNomPrenom(this.nomPrenom)
      .ayantConsentiPourLAnnuaire()
      .ayantPourDepartements(departementsAidant)
      .construis();
    return {
      identifiant: aidant.identifiant,
      nomPrenom: aidant.nomPrenom,
      departements: departementsAidant,
    };
  }
}

export const unAidant = () => new ConstructeurAidant();
