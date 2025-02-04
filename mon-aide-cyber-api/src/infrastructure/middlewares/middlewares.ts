import { NextFunction, Request, RequestHandler, Response } from 'express';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';

const redirigeVersUrlBase: RequestHandler = (
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

export { redirigeVersUrlBase };
