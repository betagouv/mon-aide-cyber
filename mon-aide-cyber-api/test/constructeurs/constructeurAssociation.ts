import { faker } from '@faker-js/faker';
import { NiveauRecommandation } from '../../src/diagnostic/Referentiel';
import { Indice, Valeur } from '../../src/diagnostic/Indice';

import { Association } from './types';
import { Constructeur } from './constructeur';

class ConstructeurAssociation implements Constructeur<Association> {
  constructor(
    private identifiantRecommandation: string = faker.string.alpha(10),
    private niveauRecommandation: NiveauRecommandation = 1,
    private _indice: Indice = { valeur: 0 },
  ) {}

  avecIdentifiant(identifiant: string): ConstructeurAssociation {
    this.identifiantRecommandation = identifiant;

    return this;
  }

  deNiveau1(): ConstructeurAssociation {
    this.niveauRecommandation = 1;

    return this;
  }

  deNiveau2() {
    this.niveauRecommandation = 2;
    return this;
  }

  ayantPourValeurDIndice(theorique: Valeur): ConstructeurAssociation {
    this._indice.valeur = theorique;
    return this;
  }

  construis(): Association {
    return {
      identifiantRecommandation: this.identifiantRecommandation,
      niveauRecommandation: this.niveauRecommandation,
      indice: this._indice,
    };
  }
}

export const uneAssociation = () => {
  return new ConstructeurAssociation();
};
