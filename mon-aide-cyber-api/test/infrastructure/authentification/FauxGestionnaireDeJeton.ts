import {
  DonneesJetonMAC,
  GestionnaireDeJeton,
  Jeton,
  JwtMACPayload,
} from '../../../src/authentification/GestionnaireDeJeton';
import { expect } from 'vitest';
import { JwtPayload } from 'jsonwebtoken';

export class FauxGestionnaireDeJeton implements GestionnaireDeJeton {
  constructor(private readonly jetonInvalide = false) {}
  private token = '';

  verifie(jeton: string): JwtMACPayload {
    if (this.jetonInvalide) {
      throw new Error('Jeton invalide');
    }
    this.token = jeton;
    const payload = JSON.parse(jeton) as JwtPayload;
    return {
      ...payload,
      identifiant: payload.identifiant,
      estProconnect: false,
    };
  }

  genereJeton(__: DonneesJetonMAC): Jeton {
    return 'un-jeton';
  }

  verifieToken(token: string) {
    expect(this.token).toBe(token);
  }
}
