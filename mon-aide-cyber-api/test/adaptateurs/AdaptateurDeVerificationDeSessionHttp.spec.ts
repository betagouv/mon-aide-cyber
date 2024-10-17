import { describe, expect, it, assert } from 'vitest';
import { AdaptateurDeVerificationDeSessionHttp } from '../../src/adaptateurs/AdaptateurDeVerificationDeSessionHttp';
import { FauxGestionnaireDeJeton } from '../infrastructure/authentification/FauxGestionnaireDeJeton';
import { NextFunction } from 'express-serve-static-core';
import { Request, Response } from 'express';
import { ErreurMAC } from '../../src/domaine/erreurMAC';
import { ErreurAccesRefuse } from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { MACCookies } from '../../src/adaptateurs/fabriqueDeCookies';
import { RequeteUtilisateur } from '../../src/api/routesAPI';

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

    const token = JSON.stringify({
      identifiant: 'cba33a4f-0224-4d81-b899-152105c6b8af',
    });
    new AdaptateurDeVerificationDeSessionHttp(fauxGestionnaireDeJeton).verifie(
      'Accède aux diagnostics',
      () => ({
        session: btoa(
          JSON.stringify({
            token,
          })
        ),
      })
    )(requete, reponse, fausseSuite);

    fauxGestionnaireDeJeton.verifieToken(token);
  });

  it('lève une erreur quand les cookies de session sont absents', () => {
    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton()
      ).verifie('Accès diagnostic')(requete, reponse, fausseSuite);
    }).toThrowError(
      ErreurMAC.cree(
        'Accès diagnostic',
        new ErreurAccesRefuse('Cookie invalide.')
      )
    );
  });

  it("vérifie que l'erreur levée est de type Accès Refusé", () => {
    try {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton()
      ).verifie('Accès diagnostic')(requete, reponse, fausseSuite);
      assert.fail('Ce test est sensé échouer');
    } catch (e) {
      expect(
        (e as ErreurMAC<ErreurAccesRefuse>).erreurOriginelle
      ).toBeInstanceOf(ErreurAccesRefuse);
    }
  });

  it("lève une erreur quand le cookie de session envoyé n'est pas un cookie", () => {
    const cookieDeSession = 'pas-un-vrai-cookie-de-session';
    const requete: Request = {
      headers: { cookie: cookieDeSession },
    } as Request;

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton()
      ).verifie('Accès diagnostic')(requete, reponse, fausseSuite);
    }).toThrow(`Cookie invalide.`);
  });

  it('lève une erreur quand le cookie de session est malformé', () => {
    const cookieDeSession =
      'session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOtctaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkdWdWRHbG1hV0Z1ZENJNkltTmlZVE16WVRSbUxUQXlNalF0TkdRNE1TMWlPRGs1TFRFMU1qRXdOV00yWWpoaFppSXNJbWxoZENJNk1UY3dNRGt3TWpZMU1UazJNSDAuV3hnRzNmSHRUUHl6R3d5T2RqcFFHcTlrbHE0eUJvNlVGOW53a1ltS3NobyJ9; session.sig=n5DahOjdSBgjYBonCTddV0mqZto';

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        new FauxGestionnaireDeJeton()
      ).verifie(
        'Accès diagnostic',
        () =>
          ({
            session: cookieDeSession,
          }) as MACCookies
      )(requete, reponse, fausseSuite);
    }).toThrow(`Session invalide.`);
  });

  it('lève une erreur quand décoder un jeton échoue', () => {
    const fauxGestionnaireDeJeton = new FauxGestionnaireDeJeton(true);
    const cookieDeSession =
      'session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkdWdWRHbG1hV0qqdZ1ZENJNkltTmlZVE16WVRSbUxUQXlNalF0TkdRNE1TMWlPRGs1TFRFMU1qRXdOV00yWWpoaFppSXNJbWxoZENJNk1UY3dNRGt3TWpZMU1UazJNSDAuV3hnRzNmSHRUUHl6R3d5T2RqcFFHcTlrbHE0eUJvNlVGOW53a1ltS3NobyJ9; session.sig=n5DahOjdSBgjYBonCTddV0mqZto';

    expect(() => {
      new AdaptateurDeVerificationDeSessionHttp(
        fauxGestionnaireDeJeton
      ).verifie(
        'Accès diagnostic',
        () =>
          ({
            session: cookieDeSession,
          }) as MACCookies
      )(requete, reponse, fausseSuite);
    }).toThrow(`Session invalide.`);
  });

  it("ajoute l'identifiant de l'utilisateur lorsque le jeton est vérifié", () => {
    const fauxGestionnaireDeJeton = new FauxGestionnaireDeJeton();
    const cookieDeSession = `session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkdWdWRHbG1hV0Z1ZENJNkltTmlZVE16WVRSbUxUQXlNalF0TkdRNE1TMWlPRGs1TFRFMU1qRXdOV00yWWpoaFppSXNJbWxoZENJNk1UY3dNRGt3TWpZMU1UazJNSDAuV3hnRzNmSHRUUHl6R3d5T2RqcFFHcTlrbHE0eUJvNlVGOW53a1ltS3NobyJ9; session.sig=n5DahOjdSBgjYBonCTddV0mqZto`;
    const requete: RequeteUtilisateur = {
      headers: { cookie: cookieDeSession },
    } as RequeteUtilisateur;

    new AdaptateurDeVerificationDeSessionHttp(fauxGestionnaireDeJeton).verifie(
      'Accède aux diagnostics',
      () => ({
        session: btoa(
          JSON.stringify({
            token: JSON.stringify({
              identifiant: 'cba33a4f-0224-4d81-b899-152105c6b8af',
            }),
          })
        ),
      })
    )(requete, reponse, fausseSuite);

    expect(requete.identifiantUtilisateurCourant).toStrictEqual(
      'cba33a4f-0224-4d81-b899-152105c6b8af'
    );
  });
});
