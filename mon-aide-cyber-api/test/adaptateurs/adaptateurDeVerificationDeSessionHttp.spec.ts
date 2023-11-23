import { describe, it } from 'vitest';
import { AdaptateurDeVerificationDeSessionHttp } from '../../src/adaptateurs/AdaptateurDeVerificationDeSessionHttp';
import { FauxGestionnaireDeJeton } from '../../src/infrastructure/authentification/FauxGestionnaireDeJeton';
import { NextFunction } from 'express-serve-static-core';
import { Request, Response } from 'express';

describe('adaptateur de vérification de session', () => {
  it('lève une erreur quand les cookies de session sonts absents', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const fausseSuite: NextFunction = () => {};
    const requete: Request = { headers: {} } as Request;
    const reponse = {} as Response;

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton(),
      ).verifie(requete, reponse, fausseSuite);
    }).toThrow('Aucun cookie de session trouvé.');
  });

  it('lève une erreur quand le cookies de session est malformé', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const fausseSuite: NextFunction = () => {};
    const cookieDeSession = 'pas-un-vrai-cookie-de-session';
    const requete: Request = {
      headers: { cookie: cookieDeSession },
    } as Request;
    const reponse = {} as Response;

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton(),
      ).verifie(requete, reponse, fausseSuite);
    }).toThrow(`Cookie de session malformé: '${cookieDeSession}'.`);
  });
});
