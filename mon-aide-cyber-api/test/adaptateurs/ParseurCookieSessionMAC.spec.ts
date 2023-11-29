import { describe, it } from 'vitest';

import { ParseurCookieSessionMAC } from '../../src/authentification/ParseurCookieSessionMAC';

describe('Parseur de cookie de session MAC', () => {
  it('extrait le contenu du cookie de session', () => {
    const parseurDeCookie = new ParseurCookieSessionMAC();

    expect(
      parseurDeCookie.parse(
        'session=eyJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkdWdWRHbG1hV0Z1ZENJNkltTmlZVE16WVRSbUxUQXlNalF0TkdRNE1TMWlPRGs1TFRFMU1qRXdOV00yWWpoaFppSXNJbWxoZENJNk1UY3dNRGt3TWpZMU1UazJNSDAuV3hnRzNmSHRUUHl6R3d5T2RqcFFHcTlrbHE0eUJvNlVGOW53a1ltS3NobyJ9; session.sig=n5DahOjdSBgjYBonCTddV0mqZto',
      ),
    ).toStrictEqual({
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWFudCI6ImNiYTMzYTRmLTAyMjQtNGQ4MS1iODk5LTE1MjEwNWM2YjhhZiIsImlhdCI6MTcwMDkwMjY1MTk2MH0.WxgG3fHtTPyzGwyOdjpQGq9klq4yBo6UF9nwkYmKsho',
    });
  });

  it("lève une erreur quand le cookie de session envoyé n'est pas un cookie", () => {
    const fauxCookieDeSession = 'pas-un-vrai-cookie-de-session';
    const parseurDeCookie = new ParseurCookieSessionMAC();

    expect(() => {
      parseurDeCookie.parse(fauxCookieDeSession);
    }).toThrow(`Cookie de session invalide.`);
  });

  it('lève une erreur quand le cookie de session est malformé', () => {
    const parseurCookieDeSession = new ParseurCookieSessionMAC();
    const cookieDeSession =
      'session=eyJ0b2tlbiI6Imformé-nimporte-comment-OW53a1ltS3NobyJ9; session.sig=n5DahOjdSBgjYBonCTddV0mqZto';

    expect(() => {
      parseurCookieDeSession.parse(cookieDeSession);
    }).toThrow(`Cookie de session invalide.`);
  });
});
