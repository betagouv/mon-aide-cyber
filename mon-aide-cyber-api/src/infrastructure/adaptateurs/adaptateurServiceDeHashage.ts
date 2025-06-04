import { ServiceDeHashage } from '../../securite/ServiceDeHashage';
import { ServiceDeHashageMac } from '../securite/ServiceDeHashageMac';

export class ServiceDeHashageClair implements ServiceDeHashage {
  hashe(chaine: string): string {
    return `HASH_EN_CLAIR:<${chaine}>`;
  }
}

export const adaptateurServiceDeHashage = (): ServiceDeHashage => {
  return process.env.HASH_SEL !== undefined
    ? new ServiceDeHashageMac()
    : new ServiceDeHashageClair();
};
