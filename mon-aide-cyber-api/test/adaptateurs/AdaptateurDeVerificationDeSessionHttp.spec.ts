import { describe, it } from 'vitest';
import { AdaptateurDeVerificationDeSessionHttp } from '../../src/adaptateurs/AdaptateurDeVerificationDeSessionHttp';
import { FauxGestionnaireDeJeton } from '../../src/infrastructure/authentification/FauxGestionnaireDeJeton';
import { NextFunction } from 'express-serve-static-core';
import { Request, Response } from 'express';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { ErreurAccesRefuse } from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';

describe('Adaptateur de vérification de session', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fausseSuite: NextFunction = () => {};
  const requete: Request = { headers: {} } as Request;
  const reponse = {} as Response;

  it('valide le cookie', () => {
    const fauxGestionnaireDeJeton = new FauxGestionnaireDeJeton();
    const cookieDeSession =
      'session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUo5Lll6RTFZekF5T0RNdE56ZGhNQzAwTlRReExXRXlZVE10TldJeE4yTm1OemMwWlRVdy5YVTExUkxJZlNfd2NJcWlhdTBmZzZ3RUtNZUVsNDhiNzhJdUVpeDd2Z2ZRIn0=';
    const requete: Request = {
      headers: { cookie: cookieDeSession },
    } as Request;

    new AdaptateurDeVerificationDeSessionHttp(fauxGestionnaireDeJeton).verifie(
      'Accède aux diagnostics',
      requete,
      reponse,
      fausseSuite,
    );

    fauxGestionnaireDeJeton.verifieToken(
      'eyJhbGciOiJIUzI1NiJ9.YzE1YzAyODMtNzdhMC00NTQxLWEyYTMtNWIxN2NmNzc0ZTUw.XU11RLIfS_wcIqiau0fg6wEKMeEl48b78IuEix7vgfQ',
    );
  });

  it('lève une erreur quand les cookies de session sont absents', () => {
    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton(),
      ).verifie('Accès diagnostic', requete, reponse, fausseSuite);
    }).toThrow(
      ErreurMAC.cree(
        'Accès diagnostic',
        new ErreurAccesRefuse('Cookie invalide.'),
      ),
    );
  });

  it("lève une erreur quand le cookie de session envoyé n'est pas un cookie", () => {
    const cookieDeSession = 'pas-un-vrai-cookie-de-session';
    const requete: Request = {
      headers: { cookie: cookieDeSession },
    } as Request;

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton(),
      ).verifie('Accès diagnostic', requete, reponse, fausseSuite);
    }).toThrow(`Cookie invalide.`);
  });

  it('lève une erreur quand le cookie de session est malformé', () => {
    const cookieDeSession =
      'session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFtctOaUo5Lll6RTFZekF5T0RNdE56ZGhNQzAwTlRReExXRXlZVE10TldJeE4yTm1OemMwWlRVdy5YVTExUkxJZlNfd2NJcWlhdTBmZzZ3RUtNZUVsNDhiNzhJdUVpeDd2Z2ZRIn0=';
    const requete: Request = {
      headers: { cookie: cookieDeSession },
    } as Request;

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton(),
      ).verifie('Accès diagnostic', requete, reponse, fausseSuite);
    }).toThrow(`Session invalide.`);
  });

  it('lève une erreur quand décoder un jeton échoue', () => {
    const fauxGestionnaireDeJeton = new FauxGestionnaireDeJeton(true);
    const cookieDeSession =
      'session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUo5Lll6RTFZekF5T0RNdE56ZGhNQzAwTlRReExXRXlZVE10TldJeE4yTm1OemMwWlRVdy5YVTExUkxJZlNfd2NJcWlhdTBmZzZ3RUtNZUVsNDhiNzhJdUVpeDd2Z2ZRIn0=';
    const requete: Request = {
      headers: { cookie: cookieDeSession },
    } as Request;

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        fauxGestionnaireDeJeton,
      ).verifie('Accès diagnostic', requete, reponse, fausseSuite);
    }).toThrow(`Session invalide.`);
  });
});
