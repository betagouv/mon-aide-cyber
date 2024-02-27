import { Express } from 'express';
import { inject, Response } from 'light-my-request';
import { IncomingHttpHeaders } from 'http';

export const executeRequete = (
  app: Express,
  verbe: 'DELETE' | 'GET' | 'POST' | 'PATCH',
  chemin: string,
  port: number,
  corps: object | undefined = undefined,
  headers: IncomingHttpHeaders | undefined = undefined,
): Promise<Response> => {
  return inject(app, {
    method: verbe,
    url: { pathname: chemin, port },
    ...(corps && { body: corps }),
    ...(headers && { headers }),
  }).then((rep) => rep);
};
