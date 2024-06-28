import { Constructeur } from './Constructeur';
import { ActionReponseDiagnostic } from '../../src/domaine/diagnostic/Diagnostic';
import { faker } from '@faker-js/faker/locale/fr';
import { UUID } from '../../src/types/Types.ts';

export class ConstructeurActionReponseDiagnostic
  implements Constructeur<ActionReponseDiagnostic>
{
  private chemin = 'contexte';
  private action = 'repondre' as const;
  private url: string = faker.internet.url();
  private identifiantDiagnostic: UUID = faker.string.uuid() as UUID;
  contexte(): ConstructeurActionReponseDiagnostic {
    this.chemin = 'contexte';
    return this;
  }

  construis(): ActionReponseDiagnostic {
    return {
      [this.chemin]: {
        action: this.action,
        ressource: {
          url: `${this.url}/${this.identifiantDiagnostic}`,
          methode: 'PATCH',
        },
      },
    };
  }

  avecIdDiagnostic(identifiant: UUID): ConstructeurActionReponseDiagnostic {
    this.identifiantDiagnostic = identifiant;
    return this;
  }
}

export const uneAction = () => new ConstructeurActionReponseDiagnostic();
