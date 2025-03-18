import { ServiceDeHashage } from '../../securite/ServiceDeHashage';
import { ServiceDeHashageMac } from '../securite/ServiceDeHashageMac';

class ServiceDeHashageClair implements ServiceDeHashage {
  hashe(chaine: string): string {
    return chaine;
  }
}

export const adaptateurServiceDeHashage = (): ServiceDeHashage => {
  return process.env.HASH_SEL !== undefined
    ? new ServiceDeHashageMac()
    : new ServiceDeHashageClair();
};
