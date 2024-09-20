import { Express } from 'express';
import { inject, Response } from 'light-my-request';
import { IncomingHttpHeaders } from 'http';
import qs from 'qs';

export const executeRequete = (
  app: Express,
  verbe: 'DELETE' | 'GET' | 'POST' | 'PATCH',
  chemin: string,
  port: number,
  corps: object | undefined = undefined,
  headers: IncomingHttpHeaders | undefined = undefined
): Promise<Response> => {
  const pathAndQuery = chemin.split('?');

  return inject(app, {
    method: verbe,
    url: {
      pathname: pathAndQuery[0],
      port,
      ...(pathAndQuery[1] !== undefined && {
        query: qs.parse(pathAndQuery[1]) as { [key: string]: string },
      }),
    },
    ...(corps && { body: corps }),
    ...(headers && { headers }),
  }).then((rep) => rep);
};
