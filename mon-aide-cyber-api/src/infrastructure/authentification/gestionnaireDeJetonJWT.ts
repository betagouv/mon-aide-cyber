import {
  DonneesJetonMAC,
  GestionnaireDeJeton,
  Jeton,
} from '../../authentification/GestionnaireDeJeton';
import jwt from 'jsonwebtoken';
import { FournisseurHorloge } from '../horloge/FournisseurHorloge';

export class GestionnaireDeJetonJWT implements GestionnaireDeJeton {
  constructor(private readonly clef: string) {}

  verifie(token: string): void {
    jwt.verify(token, this.clef);
  }

  genereJeton(donnee: DonneesJetonMAC): Jeton {
    return jwt.sign(
      { ...donnee, iat: FournisseurHorloge.maintenant().getTime() },
      this.clef,
    );
  }
}
