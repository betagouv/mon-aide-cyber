import { unReferentiel } from './constructeurReferentiel.ts';
import { faker } from '@faker-js/faker/locale/fr';
import { UUID } from '../../src/types/Types.ts';
import { Referentiel } from '../../src/domaine/diagnostic/Referentiel.ts';
import { Action, Diagnostic } from '../../src/domaine/diagnostic/Diagnostic.ts';

class ConstructeurDiagnostic {
  private referentiel: Referentiel = unReferentiel().construis();
  private identifiant: UUID = faker.string.uuid() as UUID;
  private actions: Action[] = [];

  avecUnReferentiel(referentiel: Referentiel): ConstructeurDiagnostic {
    this.referentiel = referentiel;
    return this;
  }

  avecIdentifiant(identifiant: UUID): ConstructeurDiagnostic {
    this.identifiant = identifiant;
    return this;
  }

  ajouteAction(action: Action): ConstructeurDiagnostic {
    this.actions.push(action);
    return this;
  }

  construis(): Diagnostic {
    return {
      identifiant: this.identifiant,
      referentiel: this.referentiel,
      actions: this.actions,
    };
  }
}

export const unDiagnostic = () => new ConstructeurDiagnostic();
