import { faker } from '@faker-js/faker';
import { NiveauRecommandation } from '../../src/diagnostic/Referentiel';
import { Note, ValeurPossible } from '../../src/diagnostic/Note';

import { Association } from './types';
import { Constructeur } from './constructeur';

class ConstructeurAssociation implements Constructeur<Association> {
  constructor(
    private identifiantRecommandation: string = faker.string.alpha(10),
    private niveauRecommandation: NiveauRecommandation = 1,
    private _note: Note = { theorique: 0 },
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

  ayantPourNote(theorique: ValeurPossible): ConstructeurAssociation {
    this._note!.theorique = theorique;
    return this;
  }

  construis(): Association {
    return {
      identifiantRecommandation: this.identifiantRecommandation,
      niveauRecommandation: this.niveauRecommandation,
      note: this._note,
    };
  }
}

export const uneAssociation = () => {
  return new ConstructeurAssociation();
};
