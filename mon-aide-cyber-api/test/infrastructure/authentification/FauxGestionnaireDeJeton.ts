import {
  DonneesJetonMAC,
  GestionnaireDeJeton,
  Jeton,
  JwtMACPayload,
} from '../../../src/authentification/GestionnaireDeJeton';
import { expect } from 'vitest';
import jwt, { JwtPayload } from 'jsonwebtoken';

export class FauxGestionnaireDeJeton implements GestionnaireDeJeton {
  constructor(private readonly jetonInvalide = false) {}
  private token = '';

  verifie(jeton: string): JwtMACPayload {
    if (this.jetonInvalide) {
      throw new Error('Jeton invalide');
    }
    this.token = jeton;
    const payload = jwt.decode(jeton) as JwtPayload;
    return { ...payload, identifiant: payload.identifiant };
  }

  genereJeton(__: DonneesJetonMAC): Jeton {
    return 'un-jeton';
  }

  verifieToken(token: string) {
    expect(this.token).toBe(token);
  }
}
