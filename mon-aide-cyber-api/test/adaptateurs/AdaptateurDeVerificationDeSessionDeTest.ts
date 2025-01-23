import { AdaptateurDeVerificationDeSession } from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { NextFunction } from 'express-serve-static-core';
import { RequestHandler, Response } from 'express';
import { Contexte } from '../../src/domaine/erreurMAC';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import crypto from 'crypto';

export class AdaptateurDeVerificationDeSessionDeTest
  implements AdaptateurDeVerificationDeSession
{
  private _utilisateurConnecte?: crypto.UUID | undefined;
  private _estProConnect?: boolean | undefined;

  constructor(private estPassee = false) {}

  verifie(__contexte: Contexte): RequestHandler {
    return (
      _requete: RequeteUtilisateur,
      _reponse: Response,
      suite: NextFunction
    ) => {
      this.estPassee = true;
      if (this._utilisateurConnecte) {
        _requete.identifiantUtilisateurCourant = this._utilisateurConnecte;
      }
      if (this._estProConnect) {
        _requete.estProConnect = this._estProConnect;
      }
      suite();
    };
  }

  verifiePassage(): boolean {
    return this.estPassee;
  }

  utilisateurConnecte(identifiantUtilisateurConnecte: crypto.UUID) {
    this._utilisateurConnecte = identifiantUtilisateurConnecte;
  }

  utilisateurProConnect(identifiantUtilisateurConnecte: crypto.UUID) {
    this.utilisateurConnecte(identifiantUtilisateurConnecte);
    this._estProConnect = true;
  }

  reinitialise() {
    this._utilisateurConnecte = undefined;
    this.estPassee = false;
    this._estProConnect = undefined;
  }
}
