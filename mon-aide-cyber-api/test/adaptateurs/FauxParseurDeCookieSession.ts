import {
  CookieDeSession,
  ParseurCookieSession,
} from '../../src/adaptateurs/ParseurCookieSession';
import { ErreurAccesRefuse } from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';

export class FauxParseurDeCookieSession implements ParseurCookieSession {
  private echec = false;

  parse(_: string): CookieDeSession {
    if (this.echec) {
      throw new ErreurAccesRefuse('Cookie de session invalide.');
    }

    return { token: 'token décodé' };
  }

  echoueraAuParse() {
    this.echec = true;

    return this;
  }
}
