import { Constructeur } from './constructeur';
import { JwtMACPayload } from '../../src/authentification/GestionnaireDeJeton';
import { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';

class ConstructeurJwtPayload implements Constructeur<JwtPayload> {
  private estProConnect = false;
  private identifiant: crypto.UUID = crypto.randomUUID();

  proConnect(): ConstructeurJwtPayload {
    this.estProConnect = true;
    return this;
  }

  ayantPourAidant(identifiant: crypto.UUID): ConstructeurJwtPayload {
    this.identifiant = identifiant;
    return this;
  }

  construis(): JwtMACPayload {
    return { estProconnect: this.estProConnect, identifiant: this.identifiant };
  }
}

export const unConstructeurDeJwtPayload = () => new ConstructeurJwtPayload();
