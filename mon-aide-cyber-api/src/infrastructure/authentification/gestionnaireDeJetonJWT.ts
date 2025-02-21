import {
  DonneesJetonMAC,
  GestionnaireDeJeton,
  Jeton,
  JwtMACPayload,
} from '../../authentification/GestionnaireDeJeton';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { FournisseurHorloge } from '../horloge/FournisseurHorloge';

export class GestionnaireDeJetonJWT implements GestionnaireDeJeton {
  constructor(private readonly clef: string) {}

  verifie(jeton: string, jetonProconnect?: string): JwtMACPayload {
    const payload: JwtPayload = jwt.verify(jeton, this.clef) as JwtPayload;
    return {
      ...payload,
      identifiant: payload.identifiant,
      estProconnect: !!jetonProconnect,
    };
  }

  genereJeton(donnee: DonneesJetonMAC): Jeton {
    return jwt.sign(
      { ...donnee, iat: FournisseurHorloge.maintenant().getTime() },
      this.clef,
      { expiresIn: '3h' }
    );
  }
}
