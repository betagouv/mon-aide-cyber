import {
  CookieDeSession,
  ParseurCookieSession,
} from '../adaptateurs/ParseurCookieSession';
import { ErreurAccesRefuse } from '../adaptateurs/AdaptateurDeVerificationDeSession';

export class ParseurCookieSessionMAC implements ParseurCookieSession {
  parse(cookie: string): CookieDeSession {
    const session = cookie.match(/session=(?<session>\w+);\ssession.sig=(\w+)/)
      ?.groups?.session;

    if (!session) {
      throw new ErreurAccesRefuse('Cookie de session invalide.');
    }

    let sessionParsee: CookieDeSession;

    try {
      sessionParsee = JSON.parse(Buffer.from(session, 'base64').toString());
    } catch (e) {
      throw new ErreurAccesRefuse('Cookie de session invalide.');
    }

    return sessionParsee;
  }
}
