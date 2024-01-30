import {
  DonneesJetonMAC,
  GestionnaireDeJeton,
  Jeton,
} from '../../../src/authentification/GestionnaireDeJeton';
import { expect } from 'vitest';

export class FauxGestionnaireDeJeton implements GestionnaireDeJeton {
  constructor(private readonly jetonInvalide = false) {}
  private token = '';

  verifie(token: string): void {
    if (this.jetonInvalide) {
      throw new Error('Jeton invalide');
    }
    this.token = token;
    return;
  }

  genereJeton(__: DonneesJetonMAC): Jeton {
    return 'un-jeton';
  }

  verifieToken(token: string) {
    expect(this.token).toBe(token);
  }
}
