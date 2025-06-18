import { NextFunction, Request, RequestHandler, Response } from 'express';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

export const redirigeVersUrlBase: RequestHandler = (
  requete: Request,
  reponse: Response,
  suite: NextFunction
): void => {
  if (
    requete.headers.host ===
    new URL(adaptateurEnvironnement.mac().urlMAC()).host
  ) {
    return suite();
  }
  return reponse.redirect(
    `${adaptateurEnvironnement.mac().urlMAC()}${requete.originalUrl}`
  );
};

export const interdisLaMiseEnCache =
  (): RequestHandler =>
  (_: Request, reponse: Response, suite: NextFunction) => {
    reponse.setHeader(
      'cache-control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    reponse.setHeader('pragma', 'no-cache');
    reponse.setHeader('expires', '0');
    reponse.setHeader('surrogate-control', 'no-store');
    suite();
  };
