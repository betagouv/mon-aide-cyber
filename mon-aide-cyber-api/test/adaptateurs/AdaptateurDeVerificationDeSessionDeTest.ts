import { AdaptateurDeVerificationDeSession } from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { NextFunction } from 'express-serve-static-core';
import { RequestHandler, Response } from 'express';
import { Contexte } from '../../src/domaine/erreurMAC';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { Aidant } from '../../src/espace-aidant/Aidant';

export class AdaptateurDeVerificationDeSessionDeTest
  implements AdaptateurDeVerificationDeSession
{
  private _utilisateurConnecte?: Aidant | undefined;
  constructor(private estPassee = false) {}

  verifie(__contexte: Contexte): RequestHandler {
    return (
      _requete: RequeteUtilisateur,
      _reponse: Response,
      suite: NextFunction
    ) => {
      this.estPassee = true;
      if (this._utilisateurConnecte) {
        _requete.identifiantUtilisateurCourant =
          this._utilisateurConnecte.identifiant;
      }
      suite();
    };
  }

  verifiePassage(): boolean {
    return this.estPassee;
  }

  utilisateurConnecte(utilisateur: Aidant) {
    this._utilisateurConnecte = utilisateur;
  }

  reinitialise() {
    this._utilisateurConnecte = undefined;
    this.estPassee = false;
  }
}
