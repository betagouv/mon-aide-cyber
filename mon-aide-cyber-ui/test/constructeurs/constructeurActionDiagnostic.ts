import { Constructeur } from './Constructeur';
import { ActionReponseDiagnostic } from '../../src/domaine/diagnostic/Diagnostic';
import { faker } from '@faker-js/faker/locale/fr';

class ConstructeurActionReponseDiagnostic
  implements Constructeur<ActionReponseDiagnostic>
{
  private chemin = 'contexte';
  private action = 'repondre' as const;
  private url: string = faker.internet.url();
  contexte(): ConstructeurActionReponseDiagnostic {
    this.chemin = 'contexte';
    return this;
  }

  construis(): ActionReponseDiagnostic {
    return {
      [this.chemin]: {
        action: this.action,
        ressource: { url: this.url, methode: 'PATCH' },
      },
    };
  }
}

export const uneAction = () => new ConstructeurActionReponseDiagnostic();
