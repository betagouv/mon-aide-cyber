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
      'session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkdWdWRHbG1hV0Z1ZENJNkltTmlZVE16WVRSbUxUQXlNalF0TkdRNE1TMWlPRGs1TFRFMU1qRXdOV00yWWpoaFppSXNJbWxoZENJNk1UY3dNRGt3TWpZMU1UazJNSDAuV3hnRzNmSHRUUHl6R3d5T2RqcFFHcTlrbHE0eUJvNlVGOW53a1ltS3NobyJ9; session.sig=n5DahOjdSBgjYBonCTddV0mqZto';
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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWFudCI6ImNiYTMzYTRmLTAyMjQtNGQ4MS1iODk5LTE1MjEwNWM2YjhhZiIsImlhdCI6MTcwMDkwMjY1MTk2MH0.WxgG3fHtTPyzGwyOdjpQGq9klq4yBo6UF9nwkYmKsho',
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
      'session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOtctaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkdWdWRHbG1hV0Z1ZENJNkltTmlZVE16WVRSbUxUQXlNalF0TkdRNE1TMWlPRGs1TFRFMU1qRXdOV00yWWpoaFppSXNJbWxoZENJNk1UY3dNRGt3TWpZMU1UazJNSDAuV3hnRzNmSHRUUHl6R3d5T2RqcFFHcTlrbHE0eUJvNlVGOW53a1ltS3NobyJ9; session.sig=n5DahOjdSBgjYBonCTddV0mqZto';

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton(),
      ).verifie('Accès diagnostic', requete, reponse, fausseSuite, {
        session: cookieDeSession,
      });
    }).toThrow(`Session invalide.`);
  });

  it('lève une erreur quand décoder un jeton échoue', () => {
    const fauxGestionnaireDeJeton = new FauxGestionnaireDeJeton(true);
    const cookieDeSession =
      'session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkdWdWRHbG1hV0qqdZ1ZENJNkltTmlZVE16WVRSbUxUQXlNalF0TkdRNE1TMWlPRGs1TFRFMU1qRXdOV00yWWpoaFppSXNJbWxoZENJNk1UY3dNRGt3TWpZMU1UazJNSDAuV3hnRzNmSHRUUHl6R3d5T2RqcFFHcTlrbHE0eUJvNlVGOW53a1ltS3NobyJ9; session.sig=n5DahOjdSBgjYBonCTddV0mqZto';

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        fauxGestionnaireDeJeton,
      ).verifie('Accès diagnostic', requete, reponse, fausseSuite, {
        session: cookieDeSession,
      });
    }).toThrow(`Session invalide.`);
  });
});
