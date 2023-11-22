import { Express } from 'express';
import { inject, Response } from 'light-my-request';

export const executeRequete = (
  app: Express,
  verbe: 'GET' | 'POST' | 'PATCH',
  chemin: string,
  port: number,
  corps: object | undefined = undefined,
): Promise<Response> => {
  const requeteInit: RequestInit = {
    method: verbe,
    headers: { 'Content-Type': 'application/json' },
  };
  if (corps !== null) {
    requeteInit['body'] = JSON.stringify(corps);
  }
  return inject(app, {
    method: verbe,
    url: { pathname: chemin, port },
    ...(corps && { body: corps }),
  }).then((rep) => rep);
};

export const executeRequeteAuthentifie = (
  app: Express,
  verbe: 'GET' | 'POST' | 'PATCH',
  chemin: string,
  port: number,
  corps: object | undefined = undefined,
): Promise<Response> => {
  const requeteInit: RequestInit = {
    method: verbe,
    headers: { 'Content-Type': 'application/json' },
  };
  if (corps !== null) {
    requeteInit['body'] = JSON.stringify(corps);
  }
  return inject(app, {
    method: verbe,
    headers: {
      cookie:
        'session=eyJfY3NyZlNlY3JldCI6Ii9xZEM0ZUtSb3k5ZjVnPT0iLCJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUo5Lk1tRmxNbU5rWXprdE9XTm1aQzAwWmpBeExUZ3pPVFV0T1RJNE5HSmhOamd5WTJNeC44ZFBTdTFGWE5OWmNVYy1kYWJOX2NybEs5NnlXLWJGeUNQcGx5QzRZSHdzIn0=',
    },
    url: { pathname: chemin, port },
    ...(corps && { body: corps }),
  }).then((rep) => rep);
};
