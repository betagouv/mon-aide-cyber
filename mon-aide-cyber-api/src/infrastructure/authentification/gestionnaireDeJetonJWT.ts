import {
  GestionnaireDeJeton,
  Jeton,
} from '../../authentification/GestionnaireDeJeton';
import jwt from 'jsonwebtoken';
import { ErreurMAC } from '../../domaine/erreurMAC';

export class GestionnaireDeJetonJWT implements GestionnaireDeJeton {
  constructor(private readonly clef: string) {}

  verifie(token: string): void {
    try {
      jwt.verify(token, this.clef);
    } catch (erreur) {
      throw ErreurMAC.cree('Accès ressource protégée', erreur as Error);
    }
  }

  genereJeton(donnee: string): Jeton {
    return jwt.sign(donnee, this.clef);
  }
}
