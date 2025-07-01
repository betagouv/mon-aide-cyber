import { pThrottle } from './adaptateurPThrottle';

export const enCadence = async <T = void>(
  intervalleEnMs: number,
  fonctionEncapsulee: (param: T) => Promise<void>
) => {
  const cadence = pThrottle({ limit: 1, interval: intervalleEnMs });
  return cadence(fonctionEncapsulee);
};
