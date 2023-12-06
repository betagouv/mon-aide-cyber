import { faker } from '@faker-js/faker';
import { NiveauRecommandation } from '../../src/diagnostic/Referentiel';
import { Valeur, ValeurPossible } from '../../src/diagnostic/Valeur';

import { Association } from './types';
import { Constructeur } from './constructeur';

class ConstructeurAssociation implements Constructeur<Association> {
  constructor(
    private identifiantRecommandation: string = faker.string.alpha(10),
    private niveauRecommandation: NiveauRecommandation = 1,
    private _valeur: Valeur = { theorique: 0 },
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

  ayantPourValeurTheorique(theorique: ValeurPossible): ConstructeurAssociation {
    this._valeur!.theorique = theorique;
    return this;
  }

  construis(): Association {
    return {
      identifiantRecommandation: this.identifiantRecommandation,
      niveauRecommandation: this.niveauRecommandation,
      valeur: this._valeur,
    };
  }
}

export const uneAssociation = () => {
  return new ConstructeurAssociation();
};
