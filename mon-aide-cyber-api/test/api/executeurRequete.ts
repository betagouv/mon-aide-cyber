import { Express } from 'express';
import { inject, Response } from 'light-my-request';

export const executeRequete = (
  app: Express,
  verbe: 'GET' | 'POST' | 'PATCH',
  chemin: string,
  port: number,
  corps: object | undefined = undefined,
): Promise<Response> => {
  return inject(app, {
    method: verbe,
    url: { pathname: chemin, port },
    ...(corps && { body: corps }),
  }).then((rep) => rep);
};
