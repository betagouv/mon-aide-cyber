import { IncomingHttpHeaders } from 'http';

type IPEntete = {
  client?: string;
};

export const extraisIp = (headersExpress: IncomingHttpHeaders): IPEntete => {
  const ips = (headersExpress['x-forwarded-for'] as string)?.split(', ');

  if (!ips) return {};

  return { client: ips[0] };
};
