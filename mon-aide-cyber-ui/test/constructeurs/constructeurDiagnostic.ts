import { unReferentiel } from './constructeurReferentiel.ts';
import { faker } from '@faker-js/faker/locale/fr';
import { UUID } from '../../src/types/Types.ts';
import { Referentiel } from '../../src/domaine/diagnostic/Referentiel.ts';
import { Diagnostic } from '../../src/domaine/diagnostic/Diagnostic.ts';
import { ConstructeurActionReponseDiagnostic } from './constructeurActionDiagnostic.ts';

class ConstructeurDiagnostic {
  private referentiel: Referentiel = unReferentiel().construis();
  private identifiant: UUID = faker.string.uuid() as UUID;
  private actions: ConstructeurActionReponseDiagnostic[] = [];

  avecUnReferentiel(referentiel: Referentiel): ConstructeurDiagnostic {
    this.referentiel = referentiel;
    return this;
  }

  avecIdentifiant(identifiant: UUID): ConstructeurDiagnostic {
    this.identifiant = identifiant;
    return this;
  }

  ajouteAction(
    constructeurAction: ConstructeurActionReponseDiagnostic
  ): ConstructeurDiagnostic {
    this.actions.push(constructeurAction);
    return this;
  }

  construis(): Diagnostic {
    return {
      identifiant: this.identifiant,
      referentiel: this.referentiel,
      actions: this.actions.map((a) =>
        a.avecIdDiagnostic(this.identifiant).construis()
      ),
    };
  }
}

export const unDiagnostic = () => new ConstructeurDiagnostic();
