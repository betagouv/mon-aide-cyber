import { describe, it } from 'vitest';
import { AdaptateurDeVerificationDeSessionHttp } from '../../src/adaptateurs/AdaptateurDeVerificationDeSessionHttp';
import { FauxGestionnaireDeJeton } from '../../src/infrastructure/authentification/FauxGestionnaireDeJeton';
import { NextFunction } from 'express-serve-static-core';
import { Request, Response } from 'express';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { ErreurAccesRefuse } from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { FauxParseurDeCookieSession } from './FauxParseurDeCookieSession';

describe('Adaptateur de vérification de session', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fausseSuite: NextFunction = () => {};
  const requete: Request = { headers: {} } as Request;
  const reponse = {} as Response;

  it('passe à la suite quand le cookie de session est vérifié', () => {
    const fauxGestionnaireDeJeton = new FauxGestionnaireDeJeton();
    const requete: Request = {
      headers: { cookie: 'cookie-de-session' },
    } as Request;

    const suite: NextFunction = () => {
      expect(true).toBe(true);
    };

    new AdaptateurDeVerificationDeSessionHttp(
      new FauxParseurDeCookieSession(),
      fauxGestionnaireDeJeton,
    ).verifie('Accède aux diagnostics', requete, reponse, suite);
  });

  it('lève une erreur quand les cookies de session sont absents', () => {
    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxParseurDeCookieSession(),
        new FauxGestionnaireDeJeton(),
      ).verifie('Accès diagnostic', requete, reponse, fausseSuite);
    }).toThrow(
      ErreurMAC.cree(
        'Accès diagnostic',
        new ErreurAccesRefuse('Cookie de session invalide.'),
      ),
    );
  });

  it("propage l'erreur du parseur de cookie s'il a échoué", () => {
    const fauxGestionnaireDeJeton = new FauxGestionnaireDeJeton();
    const requete: Request = {
      headers: { cookie: 'cookie-de-session' },
    } as Request;

    const suite: NextFunction = () => {
      expect(true).toBe(true);
    };

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxParseurDeCookieSession().echoueraAuParse(),
        fauxGestionnaireDeJeton,
      ).verifie('Accède aux diagnostics', requete, reponse, suite);
    }).toThrow('Cookie de session invalide.');
  });

  it("propage l'erreur du decodeur de jeton s'il a échoué", () => {
    const fauxGestionnaireDeJeton = new FauxGestionnaireDeJeton(true);
    const requete: Request = {
      headers: { cookie: 'cookie-de-session-indecodable' },
    } as Request;

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxParseurDeCookieSession(),
        fauxGestionnaireDeJeton,
      ).verifie('Accès diagnostic', requete, reponse, fausseSuite);
    }).toThrow(`Cookie de session invalide.`);
  });
});
