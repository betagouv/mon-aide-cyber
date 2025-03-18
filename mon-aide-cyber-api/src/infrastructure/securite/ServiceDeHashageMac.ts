import crypto from 'crypto';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { ServiceDeHashage } from '../../securite/ServiceDeHashage';

export class ServiceDeHashageMac implements ServiceDeHashage {
  hashe(chaine: string): string {
    return crypto
      .pbkdf2Sync(
        chaine,
        adaptateurEnvironnement.parametresDeHash().sel(),
        1000,
        64,
        'sha512'
      )
      .toString('hex');
  }
}
