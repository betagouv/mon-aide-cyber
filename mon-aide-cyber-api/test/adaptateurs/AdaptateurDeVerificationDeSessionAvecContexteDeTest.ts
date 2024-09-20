import {
  ErreurAccesRefuse,
  InformationsContexte,
} from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { RequestHandler, Response } from 'express';
import { Contexte, ErreurMAC } from '../../src/domaine/erreurMAC';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { AdaptateurDeVerificationDeSessionDeTest } from './AdaptateurDeVerificationDeSessionDeTest';

export class AdaptateurDeVerificationDeSessionAvecContexteDeTest extends AdaptateurDeVerificationDeSessionDeTest {
  verifie(contexte: Contexte): RequestHandler {
    return (
      requete: RequeteUtilisateur,
      _reponse: Response,
      _suite: NextFunction
    ) => {
      throw ErreurMAC.cree(
        contexte,
        new ErreurAccesRefuse(
          'Une erreur',
          requete.query as InformationsContexte
        )
      );
    };
  }
}
