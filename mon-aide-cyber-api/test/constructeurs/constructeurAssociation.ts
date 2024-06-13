import { faker } from '@faker-js/faker';
import { NiveauMesure } from '../../src/diagnostic/Referentiel';
import { Indice, Valeur } from '../../src/diagnostic/Indice';

import { Association } from './types';
import { Constructeur } from './constructeur';

class ConstructeurAssociation implements Constructeur<Association> {
  constructor(
    private identifiantMesure: string = faker.string.alpha(10),
    private niveauMesure: NiveauMesure = 1,
    private _indice: Indice = { valeur: 0 }
  ) {}

  avecIdentifiant(identifiant: string): ConstructeurAssociation {
    this.identifiantMesure = identifiant;

    return this;
  }

  deNiveau1(): ConstructeurAssociation {
    this.niveauMesure = 1;

    return this;
  }

  deNiveau2() {
    this.niveauMesure = 2;
    return this;
  }

  ayantPourValeurDIndice(theorique: Valeur): ConstructeurAssociation {
    this._indice.valeur = theorique;
    return this;
  }

  construis(): Association {
    return {
      identifiantMesure: this.identifiantMesure,
      niveauMesure: this.niveauMesure,
      indice: this._indice,
    };
  }
}

export const uneAssociation = () => {
  return new ConstructeurAssociation();
};
