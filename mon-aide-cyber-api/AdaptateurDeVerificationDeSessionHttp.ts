import { GestionnaireDeJeton } from './src/authentification/GestionnaireDeJeton';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { AdaptateurDeVerificationDeSession } from './src/adaptateurs/AdaptateurDeVerificationDeSession';

export class AdaptateurDeVerificationDeSessionHttp
  implements AdaptateurDeVerificationDeSession
{
  constructor(private readonly gestionnaireDeJeton: GestionnaireDeJeton) {}

  verifie(requete: Request, _reponse: Response, suite: NextFunction) {
    const matches = requete.headers.cookie!.match(/session=(\w+)=/);

    const sessionDecodee = JSON.parse(
      Buffer.from(matches![1], 'base64').toString()
    );

    this.gestionnaireDeJeton.verifie(sessionDecodee.token);

    suite();
  }
}
