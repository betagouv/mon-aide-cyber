import { IpFilter } from 'express-ipfilter';
import { RequestHandler } from 'express';

export const filtreIp = (ipAutorisees: string[]): RequestHandler => {
  return IpFilter(ipAutorisees, {
    detectIp: (request) => {
      const forwardedFor = request.headers['x-forwarded-for'];
      if (typeof forwardedFor === 'string') {
        const ips = forwardedFor
          .split(',')
          .map((ip) => ip.trim())
          .filter((ip) => ip !== '');

        if (ips.length > 0) {
          const ipWaf = ips[ips.length - 1];
          return ipWaf;
        }
      }
      return 'interdire';
    },
    mode: 'allow',
    log: false,
  });
};
