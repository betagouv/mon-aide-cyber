import crypto from 'crypto';
import { Action, ActionDiagnostic, ActionRepondreDiagnostic } from './types';

export class ConstructeurAction {
  private static readonly CORRESPONDANCE: Map<
    'repondre' | 'terminer' | 'restituer',
    { chemin?: string; methode: 'PATCH' | 'GET' }
  > = new Map([
    ['repondre', { methode: 'PATCH' }],
    ['restituer', { chemin: 'restitution', methode: 'GET' }],
    ['terminer', { chemin: 'termine', methode: 'GET' }],
  ]);

  private constructor(
    private readonly identifiant: crypto.UUID,
    private readonly action: 'repondre' | 'terminer' | 'restituer',
    private readonly chemin?: string,
  ) {}

  private genere(): Action {
    const correspondance = ConstructeurAction.CORRESPONDANCE.get(this.action);
    return {
      action: this.action,
      ...(this.chemin && { chemin: this.chemin }),
      ressource: {
        methode: correspondance?.methode || 'GET',
        url: `/api/diagnostic/${this.identifiant}${
          (correspondance &&
            correspondance.chemin &&
            '/'.concat(correspondance.chemin)) ||
          ''
        }`,
      },
    } as Action;
  }

  static terminer(identifiant: crypto.UUID): Action {
    return new ConstructeurAction(identifiant, 'terminer').genere();
  }

  static restituer(identifiant: crypto.UUID): Action {
    return new ConstructeurAction(identifiant, 'restituer').genere();
  }

  static repondre(
    thematique: string,
    identifiant: crypto.UUID,
  ): ActionRepondreDiagnostic {
    return {
      [thematique]: new ConstructeurAction(identifiant, 'repondre').genere(),
    } as ActionRepondreDiagnostic;
  }

  static repondreThematique(
    chemin: string,
    identifiant: crypto.UUID,
  ): ActionDiagnostic {
    return new ConstructeurAction(
      identifiant,
      'repondre',
      chemin,
    ).genere() as ActionDiagnostic;
  }
}
